import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Conversation, Message, MessagesState } from '../../../shared/interfaces/message.interface';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private messagesState = new BehaviorSubject<MessagesState>({
    conversations: this.generateMockData(),
    selectedConversation: null,
    currentUserId: 'current-user'
  });

  public messagesState$ = this.messagesState.asObservable();

  private generateMockData(): Conversation[] {
    return [
      {
        id: '1',
        participantId: 'moussa-sall',
        participantName: 'Moussa Sall',
        participantInitials: 'MS',
        lastMessage: 'Lorem ipsum dolor.......',
        lastMessageTime: '06:41',
        isOnline: false,
        unreadCount: 1,
        messages: [
          {
            id: 'm1',
            senderId: 'moussa-sall',
            senderName: 'Moussa Sall',
            senderInitials: 'MS',
            content: 'Bonjour, j\'ai une question concernant le dossier.',
            timestamp: new Date('2025-09-08T06:41:00'),
            isRead: false
          }
        ]
      },
      {
        id: '2',
        participantId: 'mamadou-fall',
        participantName: 'Mamadou FALL',
        participantInitials: 'MF',
        lastMessage: 'Lorem ipsum dolor........',
        lastMessageTime: '09:10',
        isOnline: true,
        unreadCount: 0,
        messages: [
          {
            id: 'm2-1',
            senderId: 'mamadou-fall',
            senderName: 'Mamadou FALL',
            senderInitials: 'MF',
            content: 'Bonjour Oulimata, j\'espère que vous allez bien.',
            timestamp: new Date('2025-08-03T10:15:00'),
            isRead: true
          },
          {
            id: 'm2-2',
            senderId: 'mamadou-fall',
            senderName: 'Mamadou FALL',
            senderInitials: 'MF',
            content: 'Je vous informe que les documents pour la vente ont été préparés.',
            timestamp: new Date('2025-08-03T10:16:00'),
            isRead: true
          },
          {
            id: 'm2-3',
            senderId: 'mamadou-fall',
            senderName: 'Mamadou FALL',
            senderInitials: 'MF',
            content: 'Vous pouvez les consulter dans la section Documents de votre espace client.',
            timestamp: new Date('2025-08-03T10:17:00'),
            isRead: true
          },
          {
            id: 'm2-4',
            senderId: 'current-user',
            senderName: 'Fatou Ndiaye',
            senderInitials: 'FN',
            content: 'Merci M. Fall, je vais les consulter dès que possible.',
            timestamp: new Date('2025-08-03T10:25:00'),
            isRead: true
          },
          {
            id: 'm2-5',
            senderId: 'mamadou-fall',
            senderName: 'Mamadou FALL',
            senderInitials: 'MF',
            content: 'Parfait. N\'hésitez pas si vous avez des questions.',
            timestamp: new Date('2025-08-03T10:30:00'),
            isRead: true
          }
        ]
      },
      {
        id: '3',
        participantId: 'aissatou-tall',
        participantName: 'Aissatou Tall',
        participantInitials: 'AT',
        lastMessage: 'Lorem ipsum dolor.......',
        lastMessageTime: '10/06/2022',
        isOnline: false,
        unreadCount: 0,
        messages: [
          {
            id: 'm3',
            senderId: 'aissatou-tall',
            senderName: 'Aissatou Tall',
            senderInitials: 'AT',
            content: 'Merci pour votre aide avec les documents.',
            timestamp: new Date('2022-06-10T14:30:00'),
            isRead: true
          }
        ]
      }
    ];
  }

  selectConversation(conversationId: string): void {
    const currentState = this.messagesState.value;
    const conversation = currentState.conversations.find(c => c.id === conversationId);
    
    if (conversation) {
      // Mark messages as read
      conversation.unreadCount = 0;
      conversation.messages = conversation.messages.map(msg => ({ ...msg, isRead: true }));
      
      this.messagesState.next({
        ...currentState,
        selectedConversation: conversation
      });
    }
  }

  sendMessage(conversationId: string, content: string): void {
    const currentState = this.messagesState.value;
    const conversation = currentState.conversations.find(c => c.id === conversationId);
    
    if (conversation && content.trim()) {
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        senderId: currentState.currentUserId,
        senderName: 'Fatou Ndiaye',
        senderInitials: 'FN',
        content: content.trim(),
        timestamp: new Date(),
        isRead: true
      };
      
      conversation.messages.push(newMessage);
      conversation.lastMessage = content.trim();
      conversation.lastMessageTime = new Date().toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      this.messagesState.next({
        ...currentState,
        selectedConversation: conversation
      });
    }
  }

  getConversations(): Observable<Conversation[]> {
    return new Observable(observer => {
      this.messagesState$.subscribe(state => {
        observer.next(state.conversations);
      });
    });
  }

  getSelectedConversation(): Observable<Conversation | null> {
    return new Observable(observer => {
      this.messagesState$.subscribe(state => {
        observer.next(state.selectedConversation);
      });
    });
  }
}