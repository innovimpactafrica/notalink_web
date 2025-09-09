// header.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="bg-[#1C3055] border-b border-gray-200 px-4 py-3 lg:px-6">
      <div class="flex items-center justify-between">
        <!-- Left Side - Page Title -->
        <div class="flex items-center space-x-4">
          <h1 class="text-xl font-semibold text-white">{{ pageTitle }}</h1>
        </div>
        
        <!-- Right Side - Actions -->
        <div class="flex items-center space-x-3">
          
          <!-- Notifications -->
          <div class="relative">
            <button 
              class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors relative"
              (click)="toggleNotifications()">
              <img src="images/notif.svg" alt="Messages" class="h-5 w-5">
              <span *ngIf="notificationCount > 0" class="absolute top-0 right-1 h-4 w-4 bg-[#D4B036] text-white text-xs rounded-full flex items-center justify-center">
                {{ notificationCount > 9 ? '9+' : notificationCount }}
              </span>
            </button>
            
            <!-- Notifications Dropdown -->
            <div *ngIf="showNotifications" class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div class="p-4 border-b border-gray-200">
                <h3 class="text-sm font-semibold text-gray-900">Notifications</h3>
              </div>
              <div class="max-h-64 overflow-y-auto">
                <div *ngFor="let notification of notifications" class="p-4 border-b border-gray-100 hover:bg-gray-50">
                  <div class="flex items-start space-x-3">
                    <div class="flex-shrink-0">
                      <div class="h-8 w-8 bg-[#D4B036] rounded-full flex items-center justify-center">
                        <svg class="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414L11 7.586 9.707 6.293z"/>
                        </svg>
                      </div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm text-gray-900">{{ notification.title }}</p>
                      <p class="text-xs text-gray-500 mt-1">{{ notification.time }}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="p-3 bg-gray-50">
                <button class="text-sm text-[#D4B036] hover:text-[#B8941F] font-medium">
                  Voir toutes les notifications
                </button>
              </div>
            </div>
          </div>
          
          <!-- Messages -->
          <div class="relative">
            <button 
              class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors relative"
              (click)="navigateToMessages()">
              <img src="images/messenger_white.svg" alt="Messages" class="h-5 w-5">
              <span *ngIf="messageCount > 0" class="absolute top-0 right-1 h-4 w-4 bg-[#D4B036] text-white text-xs rounded-full flex items-center justify-center">
                {{ messageCount > 9 ? '9+' : messageCount }}
              </span>
            </button>
          </div>
          
          <!-- User Profile -->
          <div class="relative">
            <button 
              class="flex items-center space-x-3 p-2 rounded-lg hover:bg-[#D4B036] transition-colors"
              (click)="toggleUserMenu()">
              <div class="h-8 w-8 bg-[#D4B036] bg-opacity-30 rounded-full flex items-center justify-center">
                <span class="text-[#D4B036] font-semibold text-sm">{{ currentUser.initials }}</span>
              </div>
              <div class="text-left hidden sm:block">
                <div class="text-sm font-bold text-white">{{ currentUser.name }}</div>
                <div class="text-xs text-[#D1D5DB]">{{ currentUser.role }}</div>
              </div>
              <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            
            <!-- User Menu Dropdown -->
            <div *ngIf="showUserMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div class="py-2">
                <button 
                  *ngFor="let item of userMenuItems" 
                  class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  (click)="handleUserMenuClick(item.action)">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="item.icon"></path>
                  </svg>
                  <span>{{ item.label }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  `,
})
export class HeaderComponent implements OnInit {
  @Input() pageTitle: string = 'Tableau de bord';
  @Input() breadcrumbs: { label: string; link?: string }[] = [];

  showNotifications = false;
  showUserMenu = false;
  notificationCount = 3;
  messageCount = 5;

  currentUser = {
    name: 'Fatou Ndiaye',
    role: 'Notaire',
    initials: 'FN'
  };

  notifications = [
    { title: 'Nouveau document signé', time: 'Il y a 5 min' },
    { title: 'Rendez-vous confirmé', time: 'Il y a 15 min' },
    { title: 'Paiement reçu', time: 'Il y a 1h' }
  ];

  userMenuItems = [
    {
      label: 'Mon Profil',
      action: 'profile',
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
    },
    {
      label: 'Paramètres',
      action: 'settings',
      icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z'
    },
    {
      label: 'Aide & Support',
      action: 'help',
      icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    },
    {
      label: 'Se déconnecter',
      action: 'logout',
      icon: 'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
    }
  ];

  constructor(private router: Router) { }
  ngOnInit(): void {
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    this.showUserMenu = false;
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
    this.showNotifications = false;
  }

  navigateToMessages(): void {
    this.router.navigate(['/messages']);
  }

  handleUserMenuClick(action: string): void {
    this.showUserMenu = false;

    switch (action) {
      case 'profile':
        this.router.navigate(['/settings/profile']);
        break;
      case 'settings':
        this.router.navigate(['/settings']);
        break;
      case 'help':
        this.router.navigate(['/help']);
        break;
      case 'logout':
        this.handleLogout();
        break;
    }
  }

  private handleLogout(): void {
    localStorage.removeItem('authToken');
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}