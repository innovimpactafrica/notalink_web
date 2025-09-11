// services/signature.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SignatureDocument, SignatureStats, SignatureRequest, Client, Document, SignatureStatus } from '../../interfaces/signature.interface';

@Injectable({
  providedIn: 'root'
})
export class SignatureService {
  private mockDocuments: SignatureDocument[] = [
    {
      id: '1',
      title: 'Compromis de vente - Appartement Dakar',
      documentType: 'Compromis de vente',
      folderName: 'Achat Appartement Dakar',
      clientName: 'Amadou Diop',
      clientEmail: 'amadou.diop@example.com',
      clientInitials: 'AD',
      status: 'pending',
      requestDate: '25/07/2025',
      dueDate: '10/08/2025',
      lastReminder: '01/08/2025',
      documentUrl: 'compromis-vente-dakar.pdf'
    },
    {
      id: '2',
      title: 'Statuts - SARL TechSénégal',
      documentType: 'Statuts société',
      folderName: 'Création SARL TechSénégal',
      clientName: 'Fatou Ndiaye',
      clientEmail: 'fatou.ndiaye@example.com',
      clientInitials: 'FN',
      status: 'urgent',
      requestDate: '20/07/2025',
      dueDate: '10/08/2025',
      documentUrl: 'statuts-sarl.pdf'
    },
    {
      id: '3',
      title: 'Acte de vente - Appartement Dakar',
      documentType: 'Acte authentique',
      folderName: 'Achat Appartement Dakar',
      clientName: 'Amadou Diop',
      clientEmail: 'amadou.diop@example.com',
      clientInitials: 'AD',
      status: 'scheduled',
      requestDate: '15/07/2025',
      dueDate: '09/08/2025',
      documentUrl: 'acte-vente-dakar.pdf'
    },
    {
      id: '4',
      title: 'Procuration - Vente Terrain Thiès',
      documentType: 'Procuration',
      folderName: 'Vente Terrain Agricole Thiès',
      clientName: 'Moussa Fall',
      clientEmail: 'moussa.fall@example.com',
      clientInitials: 'MF',
      status: 'signed',
      requestDate: '10/07/2025',
      dueDate: '09/08/2025',
      documentUrl: 'procuration-thies.pdf'
    },
    {
      id: '5',
      title: 'Attestation de propriété - Succession',
      documentType: 'Attestation',
      folderName: 'Succession',
      clientName: 'Aïcha Seck',
      clientEmail: 'aicha.seck@example.com',
      clientInitials: 'AS',
      status: 'rejected',
      requestDate: '05/07/2025',
      dueDate: '08/08/2025',
      documentUrl: 'attestation-succession.pdf'
    }
  ];

  private documentsSubject = new BehaviorSubject<SignatureDocument[]>(this.mockDocuments);
  private statsSubject = new BehaviorSubject<SignatureStats>(this.calculateStats());

  documents$ = this.documentsSubject.asObservable();
  stats$ = this.statsSubject.asObservable();

  mockClients: Client[] = [
    { id: '1', name: 'Amadou Diop', email: 'amadou.diop@example.com', initials: 'AD' },
    { id: '2', name: 'Fatou Ndiaye', email: 'fatou.ndiaye@example.com', initials: 'FN' },
    { id: '3', name: 'Moussa Fall', email: 'moussa.fall@example.com', initials: 'MF' },
    { id: '4', name: 'Aïcha Seck', email: 'aicha.seck@example.com', initials: 'AS' }
  ];

  mockDocumentsList: Document[] = [
    { id: '1', name: 'Compromis de vente - Appartement Dakar.pdf', type: 'Compromis de vente' },
    { id: '2', name: 'Acte authentique - Maison Rufisque.pdf', type: 'Acte authentique' },
    { id: '3', name: 'Statuts SARL - Entreprise.pdf', type: 'Statuts société' },
    { id: '4', name: 'Procuration - Terrain Thiès.pdf', type: 'Procuration' }
  ];

  getDocuments(): Observable<SignatureDocument[]> {
    return this.documents$;
  }

  getStats(): Observable<SignatureStats> {
    return this.stats$;
  }

  getClients(): Client[] {
    return this.mockClients;
  }

  getAvailableDocuments(): Document[] {
    return this.mockDocumentsList;
  }

  sendSignatureRequest(request: SignatureRequest): Observable<boolean> {
    // Simuler l'envoi de demande
    return new Observable(observer => {
      setTimeout(() => {
        observer.next(true);
        observer.complete();
      }, 1000);
    });
  }

  updateDocumentStatus(documentId: string, status: SignatureStatus): void {
    const documents = this.documentsSubject.value;
    const docIndex = documents.findIndex(d => d.id === documentId);
    
    if (docIndex !== -1) {
      documents[docIndex].status = status;
      this.documentsSubject.next([...documents]);
      this.statsSubject.next(this.calculateStats());
    }
  }

  scheduleAppointment(documentId: string): void {
    this.updateDocumentStatus(documentId, 'scheduled');
  }

  resendSignatureRequest(documentId: string): void {
    const documents = this.documentsSubject.value;
    const docIndex = documents.findIndex(d => d.id === documentId);
    
    if (docIndex !== -1) {
      documents[docIndex].lastReminder = new Date().toLocaleDateString('fr-FR');
      this.documentsSubject.next([...documents]);
    }
  }

  markAsSigned(documentId: string): void {
    this.updateDocumentStatus(documentId, 'signed');
  }

  searchDocuments(query: string): Observable<SignatureDocument[]> {
    return new Observable(observer => {
      const filtered = this.mockDocuments.filter(doc => 
        doc.title.toLowerCase().includes(query.toLowerCase()) ||
        doc.clientName.toLowerCase().includes(query.toLowerCase()) ||
        doc.folderName.toLowerCase().includes(query.toLowerCase())
      );
      observer.next(filtered);
      observer.complete();
    });
  }

  private calculateStats(): SignatureStats {
    const documents = this.documentsSubject.value;
    return {
      total: documents.length,
      toValidate: documents.filter(d => d.status === 'rejected').length,
      pending: documents.filter(d => d.status === 'pending').length,
      signed: documents.filter(d => d.status === 'signed').length
    };
  }
}