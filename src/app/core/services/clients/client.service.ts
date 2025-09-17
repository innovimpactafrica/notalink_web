import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Client, ClientFormData } from '../../../shared/interfaces/client.interface';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private clientsSubject = new BehaviorSubject<Client[]>([
    {
      id: '1',
      firstName: 'Amadou',
      lastName: 'Diop',
      email: 'amadou.diop@example.com',
      phone: '+221 77 234 56 78',
      address: '45 Avenue Cheikh Anta Diop, Dakar',
      identityNumber: 'SEN2345678901',
      birthDate: '22/08/1990',
      birthPlace: 'Thiès',
      profession: 'Médecin',
      maritalStatus: 'Célibataire',
      activeCases: 2,
      lastActivity: '29/05/2025',
      status: 'active'
    },
    {
      id: '2',
      firstName: 'Fatou',
      lastName: 'Sow',
      email: 'fatou.sow@example.com',
      phone: '+221 77 234 56 78',
      address: '45 Avenue Cheikh Anta Diop, Dakar',
      identityNumber: 'SEN2345678901',
      birthDate: '22/08/1990',
      birthPlace: 'Thiès',
      profession: 'Médecin',
      maritalStatus: 'Célibataire',
      activeCases: 1,
      lastActivity: '27/05/2025',
      status: 'active'
    },
    {
      id: '3',
      firstName: 'Ousmane',
      lastName: 'Ndiaye',
      email: 'ousmane.ndiaye@example.com',
      phone: '+221 77 234 56 78',
      address: '45 Avenue Cheikh Anta Diop, Dakar',
      identityNumber: 'SEN2345678901',
      birthDate: '22/08/1990',
      birthPlace: 'Thiès',
      profession: 'Médecin',
      maritalStatus: 'Célibataire',
      activeCases: 1,
      lastActivity: '27/05/2025',
      status: 'active'
    },
    {
      id: '4',
      firstName: 'Aïssatou',
      lastName: 'Diallo',
      email: 'aissatou.diallo@example.com',
      phone: '+221 77 234 56 78',
      address: '45 Avenue Cheikh Anta Diop, Dakar',
      identityNumber: 'SEN2345678901',
      birthDate: '22/08/1990',
      birthPlace: 'Thiès',
      profession: 'Médecin',
      maritalStatus: 'Célibataire',
      activeCases: 1,
      lastActivity: '26/05/2025',
      status: 'inactive'
    },
    {
      id: '5',
      firstName: 'Mamadou',
      lastName: 'Ba',
      email: 'mamadou.ba@example.com',
      phone: '+221 77 234 56 78',
      address: '45 Avenue Cheikh Anta Diop, Dakar',
      identityNumber: 'SEN2345678901',
      birthDate: '22/08/1990',
      birthPlace: 'Thiès',
      profession: 'Médecin',
      maritalStatus: 'Célibataire',
      activeCases: 1,
      lastActivity: '26/05/2025',
      status: 'active'
    },
    {
      id: '6',
      firstName: 'Moussa',
      lastName: 'Fall',
      email: 'mfall@example.com',
      phone: '+221 77 234 56 78',
      address: '45 Avenue Cheikh Anta Diop, Dakar',
      identityNumber: 'SEN2345678901',
      birthDate: '22/08/1990',
      birthPlace: 'Thiès',
      profession: 'Médecin',
      maritalStatus: 'Célibataire',
      activeCases: 1,
      lastActivity: '26/05/2025',
      status: 'active'
    }
  ]);

  clients$ = this.clientsSubject.asObservable();

  getClients(): Observable<Client[]> {
    return this.clients$;
  }

  getClientById(id: string): Client | undefined {
    return this.clientsSubject.value.find(client => client.id === id);
  }

  addClient(clientData: ClientFormData): void {
    const newClient: Client = {
      ...clientData,
      id: Date.now().toString(),
      identityNumber: 'SEN' + Date.now(),
      birthDate: '',
      birthPlace: '',
      profession: '',
      maritalStatus: '',
      activeCases: 0,
      lastActivity: new Date().toLocaleDateString('fr-FR'),
      status: 'active'
    };
    
    const currentClients = this.clientsSubject.value;
    this.clientsSubject.next([...currentClients, newClient]);
  }

  updateClient(id: string, clientData: Partial<Client>): void {
    const currentClients = this.clientsSubject.value;
    const index = currentClients.findIndex(client => client.id === id);
    
    if (index !== -1) {
      currentClients[index] = { ...currentClients[index], ...clientData };
      this.clientsSubject.next([...currentClients]);
    }
  }

  toggleClientStatus(id: string): void {
    const client = this.getClientById(id);
    if (client) {
      const newStatus = client.status === 'active' ? 'inactive' : 'active';
      this.updateClient(id, { status: newStatus });
    }
  }
}