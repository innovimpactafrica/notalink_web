export const APP_CONSTANTS = {
  STORAGE_KEYS: {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    USER: 'current_user',
  },
  
  API_ENDPOINTS: {
    AUTH: {
      SIGN_IN: 'auth/signin',
      SIGN_UP: 'auth/signup',
      REFRESH: 'auth/refresh',
      LOGOUT: 'auth/api/auth/logout',
      PASSWORD_RESET: 'auth/password/reset',
      PASSWORD_CHANGE: 'auth/password/change/{id}',
      RESERVATAIRE: 'auth/reservataire/{id}'
    },
    USER: {
      ME: 'v1/user/me',
      BY_ID: 'v1/user/{id}',
      UPDATE: 'v1/user/update/{id}',
      LOCATION: 'v1/user/{id}/location',
      PHOTO: 'v1/user/photo/{id}',
      PASSWORD_CHANGE: 'v1/user/password/change',
      TOGGLE_ONLINE: 'v1/user/{id}/toggle-online',
      MARITAL_STATUS: 'v1/user/{id}/marital-status',
      DELETE: 'v1/user/{id}',
      SEARCH: 'v1/user/search',
      NEARBY: 'v1/user/nearby',
    },
    USER_DOCUMENT: {
      UPDATE: 'user/documents/{documentId}',
      DELETE: 'user/documents/{documentId}',
      STATUS: 'user/documents/user-documents/status',
      UPLOAD: 'user/documents/upload',
      BY_USER: 'user/documents/{userId}'
    },
    SIGNATURE: {
      SIGN_FORM_URL: 'signature/sign-form-url'
    },
    SIGNATURE_POSITION: {
      GET_BY_DOCUMENT: 'documents/{documentId}/signatures',
      ADD: 'documents/{documentId}/signatures',
      DELETE: 'documents/signatures/{positionId}'
    },
    RATING: {
      RATE: 'ratings/rate',
      BY_USER: 'ratings/user/{userId}',
      AVERAGE: 'ratings/average/{userId}'
    },
    PAYMENT: {
      UPDATE: 'payments/{id}',
      DELETE: 'payments/{id}',
      CREATE: 'payments',
      KPI_BY_CABINET: 'payments/kpi/cabinet/{cabinetId}',
      BY_CASE_FILE: 'payments/case-file/{caseFileId}'
    },
    MEETING: {
      BY_ID: 'meetings/{id}',
      UPDATE: 'meetings/{id}',
      DELETE: 'meetings/{id}',
      CREATE: 'meetings',
      UPCOMING_BY_CLIENT: 'meetings/upcoming/client/{clientId}',
      UPCOMING_BY_CABINET: 'meetings/upcoming/cabinet/{cabinetId}',
      NEXT_BY_CABINET: 'meetings/next/cabinet/{cabinetId}',
      BY_CLIENT_AND_DATE: 'meetings/client/{clientId}/date',
      BY_CABINET_AND_DATE: 'meetings/cabinet/{cabinetId}/date',
      ARCHIVED_BY_CLIENT: 'meetings/archived/client/{clientId}',
      ARCHIVED_BY_CABINET: 'meetings/archived/cabinet/{cabinetId}'
    },
    CASE_TYPE: {
      BY_ID: 'case-types/{id}',
      UPDATE: 'case-types/{id}',
      DELETE: 'case-types/{id}',
      CREATE: 'case-types',
      ALL: 'case-types',
      ADD_REQUIRED_DOCUMENT: 'case-types/{caseTypeId}/required-documents',
      GET_REQUIRED_DOCUMENTS: 'case-types/required-documents/case-type/{caseTypeId}',
      REMOVE_REQUIRED_DOCUMENT: 'case-types/{caseTypeId}/required-documents/{documentId}'
    },
    CASE_PRODUCED_DOCUMENT: {
      DOCUMENT_TYPES: 'case-produced-documents/document-types/all',
      UPDATE_STATUS: 'case-produced-documents/{id}/status',
      TYPE_BY_ID: 'case-produced-documents/types/{id}',
      UPDATE_TYPE: 'case-produced-documents/types/{id}',
      DELETE_TYPE: 'case-produced-documents/types/{id}',
      CREATE_TYPE: 'case-produced-documents/types',
      SAVE: 'case-produced-documents/save',
      PENDING_SIGNATURES_BY_CLIENT: 'case-produced-documents/client/{clientId}/pending-signatures',
      KPI_BY_CLIENT: 'case-produced-documents/client/{clientId}/kpi',
      BY_CASE_FILE: 'case-produced-documents/case-file/{caseFileId}',
      KPI_BY_CASE_FILE: 'case-produced-documents/case-file/{caseFileId}/kpi',
      URGENT_SIGNATURES_BY_CABINET: 'case-produced-documents/cabinet/{cabinetId}/urgent-signatures',
      KPI_BY_CABINET: 'case-produced-documents/cabinet/{cabinetId}/kpi',
      DELETE: 'case-produced-documents/{id}'
    },
    CASE_FILE: {
      UPDATE: 'case-files/{id}',
      CREATE: 'case-files',
      ADD_CLIENT: 'case-files/{id}/clients/{clientId}',
      PERCENTAGE_KPI_BY_CLIENT: 'case-files/kpi/percentage/client/{clientId}',
      PERCENTAGE_KPI_BY_CABINET: 'case-files/kpi/percentage/cabinet/{cabinetId}',
      BY_CLIENT: 'case-files/client/{clientId}',
      KPI_BY_CLIENT: 'case-files/client/{clientId}/kpi',
      BY_CABINET: 'case-files/cabinet/{cabinetId}',
      KPI_BY_CABINET: 'case-files/cabinet/{cabinetId}/kpi'
    },
    CABINET: {
      BY_ID: 'cabinets/{id}',
      UPDATE: 'cabinets/{id}',
      DELETE: 'cabinets/{id}',
      ADD_AGENT: 'cabinets/{cabinetId}/agents/{agentId}',
      REMOVE_AGENT: 'cabinets/{cabinetId}/agents/{agentId}',
      CREATE: 'cabinets/save',
      AGENTS: 'cabinets/{cabinetId}/agents',
      SEARCH: 'cabinets/search',
      BY_NOTARY: 'cabinets/by-notary{id}'
    }
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