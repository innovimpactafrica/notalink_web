import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

interface MenuItem {
  label: string;
  icon: string;
  link: string;
  active?: boolean;
  badge?: string;
  subItems?: MenuItem[];
  expanded?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Mobile overlay -->
    <div 
      *ngIf="isMobileMenuOpen" 
      class="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
      (click)="toggleMobileMenu()">
    </div>

    <!-- Sidebar -->
    <div [class]="getSidebarClasses()">
      <!-- Logo -->
      <div class="p-6">
        <div class="flex items-center justify-center">
          <img src="images/logo.png" alt="notalink" class="lg:h-32 h-8 w-auto">
        </div>
      </div>
      
      <!-- Menu Items -->
      <nav class="flex-1 p-4 overflow-y-auto">
        <ul class="space-y-1">
          <li *ngFor="let item of menuItems">
            <!-- Main Menu Item -->
            <div>
              <button 
                [class]="getMenuItemClass(item)"
                type="button"
                [routerLink]="item.subItems ? undefined : (item.link === '/logout' ? undefined : item.link)"
                (click)="handleMenuClick(item, $event)"
                [disabled]="isLoggingOut && item.link === '/logout'">
                <img [src]="item.icon" [alt]="item.label" class="w-5 h-5">
                
                <!-- Loading spinner for logout -->
                <div *ngIf="isLoggingOut && item.link === '/logout'" class="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                
                <span class="flex-1" [class.text-yellow-500]="item.active">
                  {{ isLoggingOut && item.link === '/logout' ? 'Déconnexion...' : item.label }}
                </span>
                
                <!-- Badge -->
                <span *ngIf="item.badge" class="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {{ item.badge }}
                </span>
                
                <!-- Expand/Collapse Icon for items with subItems -->
                <svg 
                  *ngIf="item.subItems" 
                  class="w-4 h-4 transition-transform duration-200"
                  [class.rotate-180]="item.expanded"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              <!-- Sub Menu Items -->
              <div 
                *ngIf="item.subItems && item.expanded"
                class="mt-1 space-y-1 pl-4">
                <button 
                  *ngFor="let subItem of item.subItems"
                  [class]="getSubMenuItemClass(subItem)"
                  type="button"
                  [routerLink]="subItem.link"
                  (click)="navigateToPage(subItem)">
                  <div class="flex items-center border-2 border-gray-700 rounded-full p-0.5"
                  [class.bg-yellow-500]="subItem.active"
                  [class.border-none]="subItem.active"
                  ></div>
                  <span class="flex-1" [class.text-yellow-500]="subItem.active">{{ subItem.label }}</span>
                  <span *ngIf="subItem.badge" class="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full"
                  [class.bg-yellow-500]="subItem.active"
                  [class.text-white]="subItem.active">
                    {{ subItem.badge }}
                  </span>
                </button>
              </div>
            </div>
          </li>
        </ul>
      </nav>
    </div>

    <!-- Mobile menu button -->
    <button
      *ngIf="!isMobileMenuOpen"
      class="fixed top-4 left-4 z-30 lg:hidden bg-white p-2 rounded-md shadow-lg border"
      (click)="toggleMobileMenu()">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
      </svg>
    </button>
  `,
})
export class SidebarComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  isMobileMenuOpen = false;
  isLoggingOut = false;
  private routerSubscription!: Subscription;

  menuItems: MenuItem[] = [
    { label: 'Tableau de bord', link: '/dashboard', icon: 'images/home_li.svg', active: false },
    { label: 'Clients', link: '/clients', icon: 'images/users_gray.svg', active: false },
    { label: 'Dossiers', link: '/folders', icon: 'images/folder.svg', active: false },
    { label: 'Documents', link: '/documents', icon: 'images/file_text.svg', active: false },
    { label: 'Rendez-vous', link: '/rendez-vous', icon: 'images/calendar_none.svg', active: false },
    { label: 'Signatures', link: '/signatures', icon: 'images/signature.svg', active: false },
    { label: 'Paiements', link: '/payment', icon: 'images/cards.svg', active: false },
    { label: 'Archivages', link: '/archives', icon: 'images/packages.svg', active: false },
    { label: 'Messages', link: '/messages', icon: 'images/messenger_gray.svg', badge: '3', active: false },
    { label: 'Espace Notaire', link: '/notaire', icon: 'images/circle_user.svg', active: false },
    { 
      label: 'Parametres', 
      link: '/settings', 
      icon: 'images/settings.svg',
      expanded: false,
      active: false,
      subItems: [
        { label: 'Type de dossiers', link: 'settings/dossier-types', icon: 'images/shield.svg', badge: '6', active: false },
        { label: 'Documents requis', link: '/settings/notifications', icon: 'images/bell.svg', badge: '5', active: false },
        { label: 'Documents produits', link: '/settings/preferences', icon: 'images/sliders.svg', badge: '6', active: false }
      ]
    },
    { label: 'Deconnexion', link: '/logout', icon: 'images/logout.svg', active: false }
  ];

  ngOnInit() {
    // Initialize active state based on current route
    this.updateActiveMenuItem(this.router.url);

    // Subscribe to router events to update active state on navigation
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateActiveMenuItem(event.urlAfterRedirects);
      }
    });
  }

  ngOnDestroy() {
    // Unsubscribe to prevent memory leaks
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  getSidebarClasses(): string {
    const baseClass = `
      fixed top-0 left-0 z-50 h-screen bg-white shadow-xl flex flex-col
      transform transition-transform duration-300 ease-in-out
    `;
    const mobileClass = this.isMobileMenuOpen 
      ? 'translate-x-0' 
      : '-translate-x-full lg:translate-x-0';
    const widthClass = 'w-64 lg:w-64';
    return `${baseClass} ${mobileClass} ${widthClass}`;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  handleMenuClick(item: MenuItem, event: Event): void {
    if (item.subItems) {
      event.preventDefault();
      item.expanded = !item.expanded;
    } else if (item.link === '/logout') {
      event.preventDefault();
      this.handleLogout();
    } else {
      this.navigateToPage(item);
    }
  }

  navigateToPage(item: MenuItem): void {
    // Don't navigate if it's logout
    if (item.link === '/logout') {
      return;
    }

    // Close mobile menu on navigation
    if (this.isMobileMenuOpen) {
      this.isMobileMenuOpen = false;
    }

    // Update active state and navigate
    this.updateActiveMenuItem(item.link);
    this.router.navigate([item.link]);
  }

  private updateActiveMenuItem(currentLink: string): void {
    // Normalize the current link to remove query parameters or fragments
    const normalizedLink = currentLink.split('?')[0].split('#')[0];

    // Reset active states
    this.menuItems.forEach(item => {
      item.active = false;
      if (item.subItems) {
        item.subItems.forEach(subItem => (subItem.active = false));
      }
    });

    // Set active state for the current route
    this.menuItems.forEach(item => {
      if (item.link === normalizedLink) {
        item.active = true;
      }
      if (item.subItems) {
        item.subItems.forEach(subItem => {
          if (subItem.link === normalizedLink) {
            subItem.active = true;
            item.expanded = true; // Expand parent menu
            item.active = true; // Highlight parent menu
          }
        });
      }
    });
  }

  private handleLogout(): void {
    if (this.isLoggingOut) return; // Prevent multiple logout calls

    this.isLoggingOut = true;

    // Close mobile menu if open
    if (this.isMobileMenuOpen) {
      this.isMobileMenuOpen = false;
    }

    this.authService.logout().subscribe({
      next: () => {
        this.isLoggingOut = false;
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Erreur lors de la déconnexion:', error);
        this.isLoggingOut = false;
        // Even if logout fails on server, redirect to login
        this.router.navigate(['/login']);
      }
    });
  }

  getMenuItemClass(item: MenuItem): string {
    const baseClass = 'flex items-center space-x-3 p-3 rounded-lg transition-colors w-full text-left cursor-pointer';
    const disabledClass = this.isLoggingOut && item.link === '/logout' ? 'opacity-50 cursor-not-allowed' : '';
    
    if (item.active) {
      return `${baseClass} bg-[#1C3055] bg-opacity-10 border-l-4 border-[#D4B036] text-[#1C3055] font-medium ${disabledClass}`;
    }
    return `${baseClass} text-[#4B5563] hover:text-gray-800 hover:bg-gray-50 ${disabledClass}`;
  }

  getSubMenuItemClass(item: MenuItem): string {
    const baseClass = 'flex items-center space-x-2 p-2 rounded text-sm transition-colors w-full text-left cursor-pointer';
    if (item.active) {
      return `${baseClass} bg-[#1C3055] bg-opacity-10 text-[#1C3055] font-medium`;
    }
    return `${baseClass} text-[#6B7280] hover:text-gray-800 hover:bg-gray-50`;
  }
}