export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  identityNumber: string;
  birthDate: string;
  birthPlace: string;
  profession: string;
  maritalStatus: string;
  activeCases: number;
  lastActivity: string;
  status: 'active' | 'inactive';
  avatar?: string;
}

export interface ClientFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
}