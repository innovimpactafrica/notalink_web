import { STATUS_CODES } from "http";

// shared/constants/app.constants.ts
export const APP_CONSTANTS = {
  STORAGE_KEYS: {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    USER: 'current_user',
  },
  
  API_ENDPOINTS: {
    AUTH: {
      SIGN_IN: 'api/auth/signin',
      SIGN_UP: 'api/auth/signup',
      REFRESH: 'api/auth/refresh',
      LOGOUT: 'api/auth/logout',
      PASSWORD_RESET: 'api/auth/password/reset',
      PASSWORD_CHANGE: 'api/auth/password/change',
      RESERVATAIRE: 'api/auth/reservataire'
    },
    USER: {
      ME: 'api/v1/user/me',
      BY_ID: 'api/v1/user',
      UPDATE: 'api/v1/user/update',
      LOCATION: 'api/v1/user/location',
      PHOTO: 'api/v1/user/photo',
      PASSWORD_CHANGE: 'api/v1/user/password/change',
      TOGGLE_ONLINE: 'api/v1/user/toggle-online',
      MARITAL_STATUS: 'api/v1/user/marital-status',
      DELETE: 'api/v1/user',
      SEARCH: 'api/v1/user/search',
      NEARBY: 'api/v1/user/nearby',
    },
  },

  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504
  },

  REQUEST_TIMEOUT: {
    DEFAULT: 10000, // 10 secondes
    UPLOAD: 30000,  // 30 secondes pour les uploads
    DOWNLOAD: 60000 // 60 secondes pour les downloads
  },

  RETRY_CONFIG: {
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000, // 1 seconde
    RETRY_STATUS_CODES: [408, 429, 500, 502, 503, 504]
  },

  PAGINATION: {
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
    DEFAULT_OFFSET: 0
  },

  VALIDATION: {
    PASSWORD: {
      MIN_LENGTH: 8,
      MAX_LENGTH: 128,
      REQUIRE_UPPERCASE: true,
      REQUIRE_LOWERCASE: true,
      REQUIRE_NUMERIC: true,
      REQUIRE_SPECIAL: true
    },
    EMAIL: {
      MAX_LENGTH: 255
    },
    PHONE: {
      MIN_LENGTH: 8,
      MAX_LENGTH: 15
    },
    NAME: {
      MIN_LENGTH: 2,
      MAX_LENGTH: 50
    },
    ADDRESS: {
      MIN_LENGTH: 5,
      MAX_LENGTH: 255
    }
  },

  MESSAGES: {
    SUCCESS: {
      LOGIN: 'Connexion réussie',
      REGISTER: 'Inscription réussie',
      LOGOUT: 'Déconnexion réussie',
      UPDATE: 'Mise à jour réussie',
      DELETE: 'Suppression réussie',
      PASSWORD_CHANGED: 'Mot de passe modifié avec succès',
      PASSWORD_RESET: 'Réinitialisation de mot de passe envoyée',
      LOCATION_UPDATED: 'Localisation mise à jour',
      PHOTO_UPDATED: 'Photo mise à jour',
      PROFILE_UPDATED: 'Profil mis à jour',
      STATUS_UPDATED: 'Statut mis à jour'
    },
    ERROR: {
      LOGIN_FAILED: 'Échec de la connexion',
      REGISTER_FAILED: 'Échec de l\'inscription',
      UPDATE_FAILED: 'Échec de la mise à jour',
      DELETE_FAILED: 'Échec de la suppression',
      PASSWORD_CHANGE_FAILED: 'Échec de la modification du mot de passe',
      NETWORK_ERROR: 'Erreur de réseau',
      UNAUTHORIZED: 'Vous n\'êtes pas autorisé à effectuer cette action',
      FORBIDDEN: 'Accès refusé',
      NOT_FOUND: 'Ressource non trouvée',
      VALIDATION_ERROR: 'Erreur de validation des données',
      GENERIC_ERROR: 'Une erreur inattendue s\'est produite'
    },
    VALIDATION: {
      REQUIRED: 'Ce champ est obligatoire',
      EMAIL_INVALID: 'Adresse email invalide',
      PASSWORD_TOO_SHORT: 'Le mot de passe doit contenir au moins 8 caractères',
      PASSWORD_WEAK: 'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial',
      PASSWORD_MISMATCH: 'Les mots de passe ne correspondent pas',
      PHONE_INVALID: 'Numéro de téléphone invalide',
      NAME_TOO_SHORT: 'Le nom doit contenir au moins 2 caractères',
      ADDRESS_TOO_SHORT: 'L\'adresse doit contenir au moins 5 caractères'
    },
    CODES: {
      NETWORK_ERROR: 'Erreur de réseau',
      BAD_REQUEST: 'Données invalides',
      UNAUTHORIZED: 'Session expirée, veuillez vous reconnecter',
      FORBIDDEN: 'Accès non autorisé',
      NOT_FOUND: 'Ressource non trouvée',
      CONFLICT: 'Conflit de données',
      UNPROCESSABLE_ENTITY: 'Données non valides',
      INTERNAL_SERVER_ERROR: 'Erreur serveur interne',
      SERVICE_UNAVAILABLE: 'Service temporairement indisponible',
    }
  },

  MARITAL_STATUS: {
    SINGLE: 'SINGLE',
    MARRIED: 'MARRIED',
    DIVORCED: 'DIVORCED',
    WIDOWED: 'WIDOWED'
  },

  USER_ROLES: {
    ADMIN: 'ADMIN',
    USER: 'USER',
    MODERATOR: 'MODERATOR'
  },

  FILE_UPLOAD: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp']
  },

  DATE_FORMATS: {
    DEFAULT: 'DD/MM/YYYY',
    WITH_TIME: 'DD/MM/YYYY HH:mm',
    ISO: 'YYYY-MM-DDTHH:mm:ss.SSSZ'
  },

  CACHE: {
    USER_PROFILE: 'user_profile',
    SETTINGS: 'app_settings'
  }
} as const;

// Type helpers pour une meilleure intellisense
export type HttpStatusCode = typeof APP_CONSTANTS.HTTP_STATUS[keyof typeof APP_CONSTANTS.HTTP_STATUS];
export type MaritalStatus = typeof APP_CONSTANTS.MARITAL_STATUS[keyof typeof APP_CONSTANTS.MARITAL_STATUS];
export type UserRole = typeof APP_CONSTANTS.USER_ROLES[keyof typeof APP_CONSTANTS.USER_ROLES];
export type AllowedFileType = typeof APP_CONSTANTS.FILE_UPLOAD.ALLOWED_TYPES[number];

// Helper functions pour les constantes
export const APP_HELPERS = {
  // Construction d'URL avec paramètres
  buildUrl: (template: string, params: Record<string, string | number>): string => {
    return Object.entries(params).reduce(
      (url, [key, value]) => url.replace(`{${key}}`, String(value)),
      template
    );
  },

  // Vérification du type de fichier
  isValidFileType: (file: File): boolean => {
    return (APP_CONSTANTS.FILE_UPLOAD.ALLOWED_TYPES as readonly string[]).includes(file.type);
  },

  // Vérification de la taille du fichier
  isValidFileSize: (file: File): boolean => {
    return file.size <= APP_CONSTANTS.FILE_UPLOAD.MAX_SIZE;
  },

  // Formatage des messages d'erreur
  getErrorMessage: (statusCode: number): string => {
    switch (statusCode) {
      case APP_CONSTANTS.HTTP_STATUS.BAD_REQUEST:
        return APP_CONSTANTS.MESSAGES.ERROR.VALIDATION_ERROR;
      case APP_CONSTANTS.HTTP_STATUS.UNAUTHORIZED:
        return APP_CONSTANTS.MESSAGES.ERROR.UNAUTHORIZED;
      case APP_CONSTANTS.HTTP_STATUS.FORBIDDEN:
        return APP_CONSTANTS.MESSAGES.ERROR.FORBIDDEN;
      case APP_CONSTANTS.HTTP_STATUS.NOT_FOUND:
        return APP_CONSTANTS.MESSAGES.ERROR.NOT_FOUND;
      case APP_CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR:
        return APP_CONSTANTS.MESSAGES.ERROR.NETWORK_ERROR;
      default:
        return APP_CONSTANTS.MESSAGES.ERROR.GENERIC_ERROR;
    }
  },

  // Vérification si un code de statut nécessite une nouvelle tentative
  shouldRetry: (statusCode: number): boolean => {
    return APP_CONSTANTS.RETRY_CONFIG.RETRY_STATUS_CODES.includes(statusCode as any);
  }
};