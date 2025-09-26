import { User } from './user.interface';

enum UserRole {
  ADMIN = 'ADMIN',
  NOTAIRE = 'NOTAIRE',
  ASSISTANT = 'ASSISTANT',
  LAWYER = 'LAWYER',
  WITNESS = 'WITNESS',
  CLIENT = 'CLIENT'
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  telephone: string;
  adress: string;
  lat: number;
  lon: number;
  profil: string;
}

export interface RefreshTokenRequest {
  token: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordChangeRequest {
  email: string;
  password: string;
  newPassword: string;
}

export interface AuthResponse {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  token: string;
  refreshToken: string;
  user: User;
}

export interface RefreshResponse {
  token: string;
  refreshToken: string;
}