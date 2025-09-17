# Architecture Angular Standalone - API Auth & User Management

Cette architecture respecte les principes SOLID et suit une structure modulaire avec des composants standalone Angular.

## Structure des Dossiers

```
src/
├── app/
│   ├── core/
│   │   ├── services/
│   │   │   ├── api.service.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── user.service.ts
│   │   │   ├── token.service.ts
│   │   │   ├── loading.service.ts
│   │   │   └── notification.service.ts
│   │   ├── guards/
│   │   │   ├── auth.guard.ts
│   │   │   ├── guest.guard.ts
│   │   │   └── role.guard.ts
│   │   └── interceptors/
│   │       ├── auth.interceptor.ts
│   │       ├── error.interceptor.ts
│   │       └── loading.interceptor.ts
│   ├── shared/
│   │   ├── models/
│   │   │   ├── auth.interface.ts
│   │   │   ├── user.interface.ts
│   │   │   └── api-response.interface.ts
│   │   ├── constants/
│   │   │   └── app.constants.ts
│   │   ├── utils/
│   │   │   ├── validators.ts
│   │   │   └── form-helpers.ts
│   │   └── components/
│   │       ├── unauthorized/
│   │       └── not-found/
│   ├── features/
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   ├── signin/
│   │   │   │   ├── signup/
│   │   │   │   ├── forgot-password/
│   │   │   │   └── reset-password/
│   │   │   └── auth.routes.ts
│   │   ├── profile/
│   │   │   ├── components/
│   │   │   │   ├── profile-view/
│   │   │   │   ├── profile-edit/
│   │   │   │   ├── change-password/
│   │   │   │   └── location-update/
│   │   │   └── profile.routes.ts
│   │   ├── users/
│   │   │   ├── components/
│   │   │   │   ├── users-list/
│   │   │   │   ├── user-detail/
│   │   │   │   └── user-edit/
│   │   │   └── users.routes.ts
│   │   ├── dashboard/
│   │   │   ├── components/
│   │   │   │   └── dashboard-main/
│   │   │   └── dashboard.routes.ts
│   │   └── admin/
│   │       ├── components/
│   │       │   ├── admin-users/
│   │       │   └── admin-settings/
│   │       └── admin.routes.ts
│   ├── app.config.ts
│   ├── app.routes.ts
│   └── app.component.ts
├── environments/
│   ├── environment.ts
│   └── environment.prod.ts
└── main.ts
```

## Installation et Configuration

### 1. Dépendances NPM

```bash
npm install @angular/common @angular/core @angular/forms @angular/router
npm install @angular/platform-browser @angular/platform-browser-dynamic
npm install rxjs zone.js
```

### 2. Configuration Environment

**environments/environment.ts**
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000' // Votre URL d'API locale
};
```

**environments/environment.prod.ts**
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-production-api.com' // Votre URL d'API de production
};
```

### 3. Configuration Bootstrap (app.config.ts)

Le fichier `app.config.ts` configure tous les services et intercepteurs :

- **authInterceptor** : Gère l'authentification automatique
- **errorInterceptor** : Gestion centralisée des erreurs
- **loadingInterceptor** : Indicateur de chargement global

### 4. Services Principaux

#### ApiService
- Service HTTP centralisé
- Gestion des erreurs
- Construction d'URLs dynamiques
- Support upload/download de fichiers
- Types de retour cohérents

#### AuthService
- Gestion complète de l'authentification
- Refresh token automatique
- État utilisateur réactif (BehaviorSubject)
- Méthodes utilitaires (hasRole, etc.)

#### UserService
- CRUD utilisateur complet
- Mise à jour automatique du state Auth
- Méthodes spécialisées (localisation, photo, etc.)

#### TokenService
- Stockage sécurisé des tokens
- Validation JWT
- Gestion expiration

## 5. Fonctionnalités Clés

### ✅ Authentification Complète
- Sign In / Sign Up
- Refresh Token automatique
- Logout sécurisé
- Reset/Change Password

### ✅ Gestion Utilisateur
- Profil complet (CRUD)
- Upload photo
- Géolocalisation
- Statut marital
- Toggle online/offline

### ✅ Sécurité
- JWT Token management
- Route Guards (auth, guest, role)
- Intercepteurs automatiques
- Validation côté client

### ✅ UX/UI
- Loading states
- Error handling
- Notifications
- Form validation
- Responsive design (TailwindCSS)

### ✅ Architecture
- Principes SOLID respectés
- Composants Standalone
- Services injectables
- Types TypeScript stricts
- Séparation des responsabilités

## API Endpoints Supportés

Tous les endpoints de votre API sont intégrés :

**Auth**
- POST `/api/auth/signin`
- POST `/api/auth/signup`  
- POST `/api/auth/refresh`
- POST `/api/auth/password/reset`
- PUT `/api/auth/password/change/{id}`
- POST `/api/auth/reservataire/{id}`
- GET `/api/auth/logout`

**User**
- GET `/api/v1/user/me`
- GET `/api/v1/user/{id}`
- PUT `/api/v1/user/update/{id}`
- PUT `/api/v1/user/{userId}/location`
- POST `/api/v1/user/photo/{id}`
- POST `/api/v1/user/password/change`
- PATCH `/api/v1/user/{id}/toggle-online`
- PATCH `/api/v1/user/{id}/marital-status`
- DELETE `/api/v1/user/{id}`
