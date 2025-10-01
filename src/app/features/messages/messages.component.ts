import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { MainLayoutComponent } from '../../core/layouts/main-layout/main-layout.component';
import { MessagesService } from '../../core/services/messages/message.service';
import { Conversation, Message } from '../../shared/interfaces/message.interface';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, FormsModule, MainLayoutComponent, NgIf],
  templateUrl: './messages.component.html',
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