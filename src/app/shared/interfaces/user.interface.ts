export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adress: string;
  lat: number;
  lon: number;
  profil: string;
  isOnline?: boolean;
  maritalStatus?: MaritalStatus;
  photoUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UpdateUserRequest {
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

export interface UpdateLocationRequest {
  adress: string;
  lat: number;
  lon: number;
}

export interface UpdatePhotoRequest {
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

export interface UpdateMaritalStatusRequest {
  maritalStatus: MaritalStatus;
}

export interface CreateReservataire {
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

export enum MaritalStatus {
  SINGLE = 'SINGLE',
  MARRIED = 'MARRIED',
  DIVORCED = 'DIVORCED',
  WIDOWED = 'WIDOWED'
}