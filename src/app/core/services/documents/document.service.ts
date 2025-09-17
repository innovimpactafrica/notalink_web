import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Document, DocumentFolder, DocumentStats, DocumentStatus, DocumentFilter } from '../../../shared/interfaces/document.interface';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private documentsSubject = new BehaviorSubject<Document[]>([]);
  private foldersSubject = new BehaviorSubject<DocumentFolder[]>([]);
  private filterSubject = new BehaviorSubject<DocumentFilter>({ status: 'tous', searchTerm: '' });
  private selectedDocumentSubject = new BehaviorSubject<Document | null>(null);

  documents$ = this.documentsSubject.asObservable();
  folders$ = this.foldersSubject.asObservable();
  filter$ = this.filterSubject.asObservable();
  selectedDocument$ = this.selectedDocumentSubject.asObservable();

  constructor() {
    this.loadMockData();
  }

  private loadMockData(): void {
    const mockDocuments: Document[] = [
      {
        id: '1',
        name: 'Compromis de vente',
        type: 'PDF',
        size: '2.5 MB',
        category: 'Contrat',
        status: 'a-signer',
        createdDate: new Date('2023-07-25'),
        validatedBy: 'Me Fatou Ndiaye',
        validatedDate: new Date('2023-07-26'),
        folderId: 'folder1',
        folderName: 'Vente Appartement Paris',
        clientId: 'client1',
        clientName: 'Amadou Diop',
        notes: 'En attente de signature client'
      },
      {
        id: '2',
        name: 'Relevé de comptes',
        type: 'PDF',
        size: '1.7 MB',
        category: 'Financier',
        status: 'a-valider',
        createdDate: new Date('2023-07-10'),
        folderId: 'folder2',
        folderName: 'Succession Martin',
        clientId: 'client2',
        clientName: 'Fatou Sow'
      }
    ];

    const mockFolders: DocumentFolder[] = [
      {
        id: 'folder1',
        name: 'Vente Appartement Paris',
        documentsCount: 3,
        expanded: true,
        subfolders: [
          {
            id: 'subfolder1',
            name: 'Propriété',
            documentsCount: 2,
            expanded: false,
            documents: []
          },
          {
            id: 'subfolder2',
            name: 'Contrat',
            documentsCount: 1,
            expanded: true,
            documents: [mockDocuments[0]]
          }
        ]
      },
      {
        id: 'folder2',
        name: 'Succession Martin',
        documentsCount: 3,
        expanded: false
      },
      {
        id: 'folder3',
        name: 'Création SARL TechSénégal',
        documentsCount: 3,
        expanded: false
      }
    ];

    this.documentsSubject.next(mockDocuments);
    this.foldersSubject.next(mockFolders);
  }

  getDocumentStats(): Observable<DocumentStats> {
    const documents = this.documentsSubject.value;
    const stats: DocumentStats = {
      total: documents.length,
      aValider: documents.filter(d => d.status === 'a-valider').length,
      enAttente: documents.filter(d => d.status === 'en-attente').length,
      valides: documents.filter(d => d.status === 'valides').length
    };
    
    // Mock data for demo
    stats.total = 9;
    stats.aValider = 1;
    stats.enAttente = 1;
    stats.valides = 5;

    return of(stats);
  }

  setFilter(filter: Partial<DocumentFilter>): void {
    const currentFilter = this.filterSubject.value;
    this.filterSubject.next({ ...currentFilter, ...filter });
  }

  selectDocument(document: Document | null): void {
    this.selectedDocumentSubject.next(document);
  }

  toggleFolder(folderId: string): void {
    const folders = this.foldersSubject.value.map(folder => 
      folder.id === folderId 
        ? { ...folder, expanded: !folder.expanded }
        : folder
    );
    this.foldersSubject.next(folders);
  }

  toggleSubfolder(folderId: string, subfolderId: string): void {
    const folders = this.foldersSubject.value.map(folder => {
      if (folder.id === folderId && folder.subfolders) {
        const updatedSubfolders = folder.subfolders.map(subfolder =>
          subfolder.id === subfolderId
            ? { ...subfolder, expanded: !subfolder.expanded }
            : subfolder
        );
        return { ...folder, subfolders: updatedSubfolders };
      }
      return folder;
    });
    this.foldersSubject.next(folders);
  }

  validateDocument(documentId: string): Observable<boolean> {
    // Mock validation
    const documents = this.documentsSubject.value.map(doc =>
      doc.id === documentId
        ? { ...doc, status: 'valides' as DocumentStatus, validatedDate: new Date() }
        : doc
    );
    this.documentsSubject.next(documents);
    return of(true);
  }

  addDocument(document: Omit<Document, 'id'>): Observable<boolean> {
    const newDocument: Document = {
      ...document,
      id: Date.now().toString()
    };
    const documents = [...this.documentsSubject.value, newDocument];
    this.documentsSubject.next(documents);
    return of(true);
  }

  requestDocuments(clientId: string, documents: string[]): Observable<boolean> {
    // Mock request documents
    return of(true);
  }
}