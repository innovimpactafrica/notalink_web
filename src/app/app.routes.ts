import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login/login.component').then(c => c.LoginComponent)
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/register/register.component').then(c => c.RegisterComponent)
  },
  {
    path: 'forgot-password',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/forgot-password/forgot-password.component').then(c => c.ForgotPasswordComponent)
  },
  {
    path: 'otp-verification',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/otp-verification/otp-verification.component').then(c => c.OtpVerificationComponent)
  },
  {
    path: 'reset-password',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/reset-password/reset-password.component').then(c => c.ResetPasswordComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(c => c.DashboardComponent)
  },
  {
    path: 'clients',
    canActivate: [authGuard],
    loadComponent: () => import('./features/clients/clients.component').then(c => c.ClientsComponent) 
  },
  {
    path: 'clients/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./features/clients/client-details/client-details.component').then(c => c.ClientDetailsComponent) 
  },
  {
    path: 'documents',
    canActivate: [authGuard],
    loadComponent: () => import('./features/documents/documents.component').then(c => c.DocumentsComponent) 
  },
  {
    path: 'folders',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dossiers/dossiers.component').then(c => c.DossiersComponent) 
  },
  {
    path: 'folders/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dossiers/dossier-details/dossier-details.component').then(c => c.DossierDetailsComponent)
  },
  {
    path: 'notaire',
    canActivate: [authGuard],
    loadComponent: () => import('./features/espace/espace.component').then(c => c.EspaceComponent) 
  },
  {
    path: 'messages',
    canActivate: [authGuard],
    loadComponent: () => import('./features/messages/messages.component').then(c => c.MessagesComponent) 
  },
  {
    path: 'settings',
    canActivate: [authGuard],
    loadComponent: () => import('./features/parametres/parametres.component').then(c => c.ParametresComponent) 
  },
  {
    path: 'settings/dossier-types',
    canActivate: [authGuard],
    loadComponent: () => import('./features/parametres/dossier-types/dossier-types.component').then(c => c.DossierTypesComponent)
  },
  {
    path: 'payment',
    canActivate: [authGuard],
    loadComponent: () => import('./features/payments/payments.component').then(c => c.PaymentsComponent) 
  },
  {
    path: 'rendez-vous',
    canActivate: [authGuard],
    loadComponent: () => import('./features/rendezvous/rendezvous.component').then(c => c.RendezvousComponent) 
  },
  {
    path: 'signatures',
    canActivate: [authGuard],
    loadComponent: () => import('./features/signatures/signatures.component').then(c => c.SignaturesComponent) 
  },
  {
    path: 'archives',
    canActivate: [authGuard],
    loadComponent: () => import('./features/archivages/archivages.component').then(c => c.ArchivagesComponent) 
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];