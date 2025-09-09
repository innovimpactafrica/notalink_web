import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { MainLayoutComponent } from '../../core/layouts/main-layout/main-layout.component';
import { MessagesService } from '../../core/services/messages/message.service';
import { Conversation, Message } from '../../core/interfaces/message.interface';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, FormsModule, MainLayoutComponent, NgIf],
  template: `
    <app-main-layout [pageTitle]="'Messages'">
      <div class="flex h-[calc(100vh-8rem)] rounded-lg overflow-hidden">
        <!-- Conversations List -->
        <div class="w-96 border-r border-gray-200 flex flex-col">
          <!-- Search Bar -->
          <div class="p-4 bg-white border-b border-gray-300">
            <div class="relative">
              <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" 
                   fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                type="text"
                placeholder="Recherche"
                class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                [(ngModel)]="searchTerm"
                (input)="onSearchChange()"
              />
            </div>
          </div>

          <!-- Conversations -->
          <div class="flex-1 overflow-y-auto mt-4">
            <div 
              *ngFor="let conversation of filteredConversations" 
              class="flex items-center p-4 bg-white border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
              [class.bg-blue-50]="selectedConversation?.id === conversation.id"
              (click)="selectConversation(conversation.id)"
            >
              <!-- Avatar -->
              <div class="relative flex-shrink-0">
                <div class="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-white font-medium">
                  {{ conversation.participantInitials }}
                </div>
                <div 
                  *ngIf="conversation.isOnline"
                  class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
                ></div>
              </div>

              <!-- Conversation Info -->
              <div class="flex-1 ml-3 min-w-0">
                <div class="flex items-center justify-between">
                  <h3 class="text-sm font-medium text-gray-900 truncate">
                    {{ conversation.participantName }}
                  </h3>
                  <span class="text-xs text-gray-500">
                    {{ conversation.lastMessageTime }}
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <p class="text-sm text-gray-600 truncate mt-1">
                    {{ conversation.lastMessage }}
                  </p>
                  <!-- Unread Badge -->
                  <div 
                    *ngIf="conversation.unreadCount > 0"
                    class="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center ml-2"
                  >
                    <span class="text-xs text-white font-bold">
                      {{ conversation.unreadCount }}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- Chat Area -->
        <div class="flex-1 flex flex-col">
          <!-- No conversation selected -->
          <div 
            *ngIf="!selectedConversation" 
            class="flex-1 flex items-center justify-center"
          >
            <div class="text-center">
              <div class="w-52 h-52 mx-auto flex items-center justify-center">
                <img src="images/conversation.svg" alt="Messages" class="w-full h-full object-contain"/>
              </div>
              <h2 class="text-xl font-medium text-gray-900 mb-2">Aucune utilisateur sélectionné</h2>
              <p class="text-gray-600">Sélectionnez une conversation pour commencer à discuter</p>
            </div>
          </div>

          <!-- Chat Header -->
          <div 
            *ngIf="selectedConversation" 
            class="px-6 py-4 border-b border-gray-200 bg-white"
          >
            <div class="flex items-center">
              <div class="relative flex-shrink-0">
                <div class="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-white font-medium">
                  {{ selectedConversation.participantInitials }}
                </div>
                <div 
                  *ngIf="selectedConversation.isOnline"
                  class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
                ></div>
              </div>
              <div class="ml-3">
                <h2 class="text-lg font-medium text-gray-900">
                  {{ selectedConversation.participantName }}
                </h2>
                <p class="text-sm text-green-600" *ngIf="selectedConversation.isOnline">
                  En ligne
                </p>
              </div>
            </div>
          </div>

          <!-- Messages -->
          <div 
            *ngIf="selectedConversation" 
            class="flex-1 overflow-y-auto p-6 bg-gray-50"
            #messagesContainer
          >
            <div class="text-center mb-6">
              <span class="inline-block px-3 py-1 bg-white rounded-full text-xs text-gray-600 shadow-sm">
                03 août 2025
              </span>
            </div>

            <div 
              *ngFor="let message of selectedConversation.messages" 
              class="mb-4 flex"
              [class.flex-row-reverse]="message.senderId === currentUserId"
              [class.justify-end]="message.senderId === currentUserId"
            >
              <div 
                class="flex gap-2 max-w-xs lg:max-w-md"
                [class.ml-auto]="message.senderId === currentUserId"
              >
                <div *ngIf="message.senderId !== currentUserId" class="relative flex-shrink-0">
                  <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-[#4B5563] text-xs font-semibold">
                    {{ message.senderInitials }}
                  </div>
                </div>
                <div 
                  [ngClass]="{
                    'bg-white text-gray-900 shadow-sm': message.senderId !== currentUserId,
                    'rounded-br-xl rounded-bl-xl rounded-xl': message.senderId !== currentUserId,
                    'rounded-tl-none': message.senderId !== currentUserId,
                    'bg-yellow-500 text-white': message.senderId === currentUserId,
                    'rounded-bl-xl rounded-br-xl rounded-tl-xl': message.senderId === currentUserId,
                    'rounded-tr-none': message.senderId === currentUserId
                  }"
                  class="px-4 py-2 shadow"
                >
                  <p class="text-sm">{{ message.content }}</p>
                  <div 
                    class="mt-1 text-xs text-gray-500 text-right"
                  >
                    {{ formatMessageTime(message.timestamp) }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Message Input -->
          <div 
            *ngIf="selectedConversation" 
            class="px-6 py-4 bg-white border-t border-gray-200"
          >
            <div class="flex items-center space-x-3">
              <button class="text-gray-400 hover:text-gray-600 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/>
                </svg>
              </button>
              
              <div class="flex-1 flex relative">
                <input
                  type="text"
                  placeholder="Votre message ici ..."
                  class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  [(ngModel)]="newMessage"
                  (keydown.enter)="sendMessage()"
                  #messageInput
                />
                <button class="absolute right-2 top-3">
                  <img src="images/emojis.svg" alt="emojis" class="w-4 h-4"/>
                </button>
              </div>
              
              <button 
                class="text-[#D4B036]"
                [disabled]="!newMessage.trim()"
                (click)="sendMessage()"
              >
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </app-main-layout>
  `
})
export class MessagesComponent implements OnInit, OnDestroy {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @ViewChild('messageInput') messageInput!: ElementRef;

  conversations: Conversation[] = [];
  filteredConversations: Conversation[] = [];
  selectedConversation: Conversation | null = null;
  searchTerm: string = '';
  newMessage: string = '';
  currentUserId = 'current-user';

  private destroy$ = new Subject<void>();

  constructor(private messagesService: MessagesService) {}

  ngOnInit() {
    this.loadConversations();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadConversations() {
    this.messagesService.getConversations()
      .pipe(takeUntil(this.destroy$))
      .subscribe(conversations => {
        this.conversations = conversations;
        this.filteredConversations = conversations;
      });

    this.messagesService.getSelectedConversation()
      .pipe(takeUntil(this.destroy$))
      .subscribe(conversation => {
        this.selectedConversation = conversation;
        if (conversation) {
          setTimeout(() => this.scrollToBottom(), 100);
        }
      });
  }

  selectConversation(conversationId: string) {
    this.messagesService.selectConversation(conversationId);
  }

  sendMessage() {
    if (this.selectedConversation && this.newMessage.trim()) {
      this.messagesService.sendMessage(this.selectedConversation.id, this.newMessage);
      this.newMessage = '';
      setTimeout(() => this.scrollToBottom(), 100);
    }
  }

  onSearchChange() {
    if (this.searchTerm.trim()) {
      this.filteredConversations = this.conversations.filter(conversation =>
        conversation.participantName.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredConversations = this.conversations;
    }
  }

  formatMessageTime(timestamp: Date): string {
    return timestamp.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  private scrollToBottom() {
    if (this.messagesContainer) {
      const element = this.messagesContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }
}