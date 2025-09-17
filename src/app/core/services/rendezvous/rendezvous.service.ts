// src/app/core/services/rendezvous.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { RendezVous, CreateRendezVousDto } from '../../../shared/interfaces/rendezvous.interface';

@Injectable({
  providedIn: 'root'
})
export class RendezVousService {
  private rendezVousSubject = new BehaviorSubject<RendezVous[]>(this.generateMockData());
  public rendezVous$ = this.rendezVousSubject.asObservable();

  private generateMockData(): RendezVous[] {
    return [
      {
        id: '1',
        motif: 'Point téléphonique',
        type: 'telephonique',
        clientId: '1',
        clientName: 'Marie Dubois',
        date: new Date('2025-08-01'),
        heure: '14:30',
        duree: 30,
        statut: 'confirme',
        createdAt: new Date('2025-07-25'),
        updatedAt: new Date('2025-07-25')
      },
      {
        id: '2',
        motif: 'Lecture du compromis',
        type: 'physique',
        clientId: '2',
        clientName: 'Jean Martin',
        date: new Date('2025-08-04'),
        heure: '10:00',
        duree: 60,
        statut: 'planifie',
        createdAt: new Date('2025-07-26'),
        updatedAt: new Date('2025-07-26')
      },
      {
        id: '3',
        motif: 'Consultation préliminaire',
        type: 'visioconference',
        clientId: '3',
        clientName: 'Sophie Moreau',
        date: new Date('2025-08-04'),
        heure: '15:00',
        duree: 45,
        statut: 'confirme',
        lienVisio: 'https://notalink.notaire.fr/rdv',
        dossierNumero: 'DOS-2023-0042',
        createdAt: new Date('2025-07-27'),
        updatedAt: new Date('2025-07-27')
      },
      {
        id: '4',
        motif: 'Consultation initiale',
        type: 'visioconference',
        clientId: '4',
        clientName: 'Paul Durand',
        date: new Date('2025-08-17'),
        heure: '14:00',
        duree: 30,
        statut: 'planifie',
        lienVisio: 'https://notalink.notaire.fr/consultation',
        createdAt: new Date('2025-07-28'),
        updatedAt: new Date('2025-07-28')
      },
      {
        id: '5',
        motif: 'Consultation préliminaire',
        type: 'visioconference',
        clientId: '5',
        clientName: 'Amédée Ndiaye',
        date: new Date('2025-08-08'),
        heure: '10:00',
        duree: 30,
        statut: 'confirme',
        lienVisio: 'https://notalink.notaire.fr/rdv',
        dossierNumero: 'DOS-2023-0042',
        notes: 'Discussion sur les étapes à suivre pour l\'acquisition immobilière',
        createdAt: new Date('2025-07-29'),
        updatedAt: new Date('2025-07-29')
      }
    ];
  }

  getRendezVous(): Observable<RendezVous[]> {
    return this.rendezVous$;
  }

  getRendezVousByMonth(year: number, month: number): Observable<RendezVous[]> {
    return new BehaviorSubject(
      this.rendezVousSubject.value.filter(rdv => {
        const rdvDate = new Date(rdv.date);
        return rdvDate.getFullYear() === year && rdvDate.getMonth() === month;
      })
    ).asObservable();
  }

  createRendezVous(rendezVous: CreateRendezVousDto): Observable<RendezVous> {
    const newRendezVous: RendezVous = {
      id: Date.now().toString(),
      ...rendezVous,
      clientName: this.getClientName(rendezVous.clientId),
      statut: 'planifie',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const currentRendezVous = this.rendezVousSubject.value;
    this.rendezVousSubject.next([...currentRendezVous, newRendezVous]);
    
    return new BehaviorSubject(newRendezVous).asObservable();
  }

  updateRendezVous(id: string, updates: Partial<RendezVous>): Observable<RendezVous> {
    const currentRendezVous = this.rendezVousSubject.value;
    const index = currentRendezVous.findIndex(rdv => rdv.id === id);
    
    if (index !== -1) {
      const updatedRendezVous = {
        ...currentRendezVous[index],
        ...updates,
        updatedAt: new Date()
      };
      
      currentRendezVous[index] = updatedRendezVous;
      this.rendezVousSubject.next([...currentRendezVous]);
      
      return new BehaviorSubject(updatedRendezVous).asObservable();
    }
    
    throw new Error('Rendez-vous non trouvé');
  }

  deleteRendezVous(id: string): Observable<boolean> {
    const currentRendezVous = this.rendezVousSubject.value;
    const filteredRendezVous = currentRendezVous.filter(rdv => rdv.id !== id);
    this.rendezVousSubject.next(filteredRendezVous);
    
    return new BehaviorSubject(true).asObservable();
  }

  private getClientName(clientId: string): string {
    const clients = [
      { id: '1', name: 'Marie Dubois' },
      { id: '2', name: 'Jean Martin' },
      { id: '3', name: 'Sophie Moreau' },
      { id: '4', name: 'Paul Durand' },
      { id: '5', name: 'Amédée Ndiaye' }
    ];
    
    return clients.find(c => c.id === clientId)?.name || 'Client inconnu';
  }

  getClients(): Observable<{id: string, name: string}[]> {
    return new BehaviorSubject([
      { id: '1', name: 'Marie Dubois' },
      { id: '2', name: 'Jean Martin' },
      { id: '3', name: 'Sophie Moreau' },
      { id: '4', name: 'Paul Durand' },
      { id: '5', name: 'Amédée Ndiaye' }
    ]).asObservable();
  }

  getDossiers(): Observable<{id: string, numero: string, client: string}[]> {
    return new BehaviorSubject([
      { id: '1', numero: 'DOS-2023-0042', client: 'Amédée Ndiaye' },
      { id: '2', numero: 'DOS-2023-0043', client: 'Marie Dubois' },
      { id: '3', numero: 'DOS-2023-0044', client: 'Jean Martin' }
    ]).asObservable();
  }
}