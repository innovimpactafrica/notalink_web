// services/notaire.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NotaireInfo, Document, Employe } from '../../../shared/interfaces/notaire.interface';

@Injectable({
  providedIn: 'root'
})
export class NotaireService {
  // Données mock
  private notaireInfoSubject = new BehaviorSubject<NotaireInfo>({
    prenom: 'Fatou',
    nom: 'Ndiaye',
    cabinet: 'Cabinet Notaire XYZ',
    email: 'notairexyz@example.com',
    telephone: '+221 77 123 45 67',
    numeroOrdre: '1 010 010 1101'
  });

  private documentsSubject = new BehaviorSubject<Document[]>([
    {
      id: '1',
      nom: 'Document de l\'ordre',
      type: 'PDF',
      dateMiseAJour: '12/05/2025',
      statut: 'verifie'
    }
  ]);

  private employesSubject = new BehaviorSubject<Employe[]>([
    {
      id: '1',
      prenom: 'Amadou',
      nom: 'Diop',
      email: 'amadou.diop@notaire.sn',
      telephone: '77 123 45 67',
      poste: 'Secrétaire',
      statut: 'inactif',
      initiales: 'AD'
    },
    {
      id: '2',
      prenom: 'Maimouna',
      nom: 'Sow',
      email: 'maimouna.sow@notaire.sn',
      telephone: '77 987 65 43',
      poste: 'Assistante',
      statut: 'actif',
      initiales: 'MS'
    }
  ]);

  // Observables publics
  notaireInfo$ = this.notaireInfoSubject.asObservable();
  documents$ = this.documentsSubject.asObservable();
  employes$ = this.employesSubject.asObservable();

  // Méthodes pour les informations du notaire
  updateNotaireInfo(info: NotaireInfo): void {
    this.notaireInfoSubject.next(info);
  }

  getNotaireInfo(): NotaireInfo {
    return this.notaireInfoSubject.value;
  }

  // Méthodes pour les documents
  addDocument(document: Document): void {
    const currentDocs = this.documentsSubject.value;
    this.documentsSubject.next([...currentDocs, document]);
  }

  // Méthodes pour les employés
  addEmploye(employe: Employe): void {
    const currentEmployes = this.employesSubject.value;
    const newEmploye = {
      ...employe,
      id: Date.now().toString(),
      initiales: `${employe.prenom.charAt(0)}${employe.nom.charAt(0)}`.toUpperCase()
    };
    this.employesSubject.next([...currentEmployes, newEmploye]);
  }

  updateEmploye(employeId: string, updatedEmploye: Partial<Employe>): void {
    const currentEmployes = this.employesSubject.value;
    const updatedList = currentEmployes.map(emp => 
      emp.id === employeId ? { ...emp, ...updatedEmploye } : emp
    );
    this.employesSubject.next(updatedList);
  }

  deleteEmploye(employeId: string): void {
    const currentEmployes = this.employesSubject.value;
    const filteredList = currentEmployes.filter(emp => emp.id !== employeId);
    this.employesSubject.next(filteredList);
  }

  toggleEmployeStatus(employeId: string): void {
    const employe = this.employesSubject.value.find(emp => emp.id === employeId);
    if (employe) {
      const newStatus = employe.statut === 'actif' ? 'inactif' : 'actif';
      this.updateEmploye(employeId, { statut: newStatus });
    }
  }

  getEmployeById(id: string): Employe | undefined {
    return this.employesSubject.value.find(emp => emp.id === id);
  }
}