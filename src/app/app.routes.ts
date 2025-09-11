import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(c => c.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(c => c.RegisterComponent)
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./features/auth/forgot-password/forgot-password.component').then(c => c.ForgotPasswordComponent)
  },
  {
    path: 'otp-verification',
    loadComponent: () => import('./features/auth/otp-verification/otp-verification.component').then(c => c.OtpVerificationComponent)
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./features/auth/reset-password/reset-password.component').then(c => c.ResetPasswordComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(c => c.DashboardComponent)
  },
  {
    path: 'clients',
    loadComponent: () => import('./features/clients/clients.component').then(c => c.ClientsComponent) 
  },
  {
    path: 'clients/:id',
    loadComponent: () => import('./features/clients/client-details/client-details.component').then(c => c.ClientDetailsComponent) 
  },
  {
    path: 'documents',
    loadComponent: () => import('./features/documents/documents.component').then(c => c.DocumentsComponent) 
  },
  {
    path: 'folders',
    loadComponent: () => import('./features/dossiers/dossiers.component').then(c => c.DossiersComponent) 
  },
  {
    path: 'folders/:id',
    loadComponent: () => import('./features/dossiers/dossier-details/dossier-details.component').then(c => c.DossierDetailsComponent)
  },
  {
    path: 'notaire',
    loadComponent: () => import('./features/espace/espace.component').then(c => c.EspaceComponent) 
  },
  {
    path: 'messages',
    loadComponent: () => import('./features/messages/messages.component').then(c => c.MessagesComponent) 
  },
  {
    path: 'settings',
    loadComponent: () => import('./features/parametres/parametres.component').then(c => c.ParametresComponent) 
  },
  {
    path: 'payment',
    loadComponent: () => import('./features/payments/payments.component').then(c => c.PaymentsComponent) 
  },
  {
    path: 'rendez-vous',
    loadComponent: () => import('./features/rendezvous/rendezvous.component').then(c => c.RendezvousComponent) 
  },
  {
    path: 'signatures',
    loadComponent: () => import('./features/signatures/signatures.component').then(c => c.SignaturesComponent) 
  },
  {
    path: 'archives',
    loadComponent: () => import('./features/archivages/archivages.component').then(c => c.ArchivagesComponent) 
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];