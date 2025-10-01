import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';
import { FilePathInterceptor } from './core/interceptors/file-path.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), // Configuration du routeur avec les routes définies
    provideHttpClient( // Configuration du client HTTP
      withFetch(), // Active l'API fetch
      withInterceptors([
        authInterceptor, // Intercepteur d'authentification
        errorInterceptor, // Intercepteur de gestion des erreurs
        loadingInterceptor // Intercepteur de gestion du chargement
      ])
    ),
    importProvidersFrom(ReactiveFormsModule), // Importation du module des formulaires réactifs
    FilePathInterceptor,
  ]
};