import { Component, Input, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, HeaderComponent, SidebarComponent],
  template: `
    <div class="flex flex-col min-h-screen bg-[#F5F5F3]" *ngIf="isAuthenticated; else loginRedirect">
      <!-- Sidebar -->
      <app-sidebar class="lg:fixed lg:top-0 lg:left-0 lg:h-full"></app-sidebar>

      <!-- Main Content Area -->
      <div class="flex-1 flex flex-col lg:ml-64 transition-all duration-300">
        <!-- Header -->
        <app-header 
          [pageTitle]="pageTitle"
          class="sticky top-0 z-10 bg-[#F5F5F3] shadow-sm">
        </app-header>

        <!-- Page Content -->
        <main class="flex-1 overflow-y-auto">
          <div class="p-4 sm:p-6">
            <ng-content></ng-content>
          </div>
        </main>
      </div>
    </div>

    <!-- Loading state template -->
    <ng-template #loginRedirect>
      <div class="flex items-center justify-center min-h-screen bg-[#F5F5F3]">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1C3055] mx-auto mb-4"></div>
          <p class="text-[#1C3055] text-lg">Vérification de l'authentification...</p>
        </div>
      </div>
    </ng-template>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }
  `]
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  @Input() pageTitle: string = 'Tableau de bord';

  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);

  isAuthenticated = false;
  private authSubscription?: Subscription;

  ngOnInit(): void {
    // Subscribe to authentication status
    this.authSubscription = this.authService.isAuthenticated$.subscribe(
      (authenticated) => {
        this.isAuthenticated = authenticated;
        
        // If authenticated and no current user, try to fetch user data
        if (authenticated && !this.authService.getCurrentUser()) {
          this.loadCurrentUser();
        }
      }
    );
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  private loadCurrentUser(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        // Update the user in the auth service
        this.authService['currentUserSubject'].next(user);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des données utilisateur:', error);
        // If there's an error loading user data, logout the user
        this.authService.logout().subscribe();
      }
    });
  }
}