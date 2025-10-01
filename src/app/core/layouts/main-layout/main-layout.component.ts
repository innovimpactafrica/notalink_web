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
  templateUrl: 'main-layout.component.html',
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