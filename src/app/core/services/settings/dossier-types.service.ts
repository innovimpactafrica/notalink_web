// services/dossier-types.service.ts
import { Injectable } from '@angular/core';
import { Observable, of, throwError, delay } from 'rxjs';
import { DossierType, CreateDossierTypeRequest, UpdateDossierTypeRequest, DocumentType, CreateDocumentTypeRequest } from '../../interfaces/dossier-type.interface';

@Injectable({
  providedIn: 'root'
})
export class DossierTypesService {
  private dossierTypes: DossierType[] = [
    {
      id: '1',
      nom: 'Achat immobilier',
      description: 'Dossiers liés aux transactions d\'achat immobilier',
      dateCreation: new Date('2024-01-15'),
      dateModification: new Date('2024-01-15'),
      actif: true
    },
    {
      id: '2',
      nom: 'Succession',
      description: 'Dossiers de succession et héritage',
      dateCreation: new Date('2024-01-20'),
      dateModification: new Date('2024-01-20'),
      actif: true
    },
    {
      id: '3',
      nom: 'Donations',
      description: 'Dossiers de donations entre particuliers',
      dateCreation: new Date('2024-02-01'),
      dateModification: new Date('2024-02-01'),
      actif: true
    },
    {
      id: '4',
      nom: 'Vente immobilière',
      description: 'Dossiers liés aux ventes immobilières',
      dateCreation: new Date('2024-02-10'),
      dateModification: new Date('2024-02-10'),
      actif: true
    },
    {
      id: '5',
      nom: 'Contrat de mariage',
      description: 'Contrats de mariage et régimes matrimoniaux',
      dateCreation: new Date('2024-02-15'),
      dateModification: new Date('2024-02-15'),
      actif: true
    },
    {
      id: '6',
      nom: 'Création de société',
      description: 'Constitution de sociétés et statuts',
      dateCreation: new Date('2024-03-01'),
      dateModification: new Date('2024-03-01'),
      actif: true
    }
  ];

  private documentTypes: DocumentType[] = [
    // Documents pour Achat immobilier
    {
      id: '1',
      nom: 'Pièce d\'identité',
      description: 'Document d\'identité valide',
      dossierTypeId: '1',
      documentRequis: true,
      signatureRequise: false,
      ordre: 1,
      actif: true
    },
    {
      id: '2',
      nom: 'Titre de propriété',
      description: 'Titre de propriété du bien',
      dossierTypeId: '1',
      documentRequis: true,
      signatureRequise: true,
      ordre: 2,
      actif: true
    },
    {
      id: '3',
      nom: 'Justificatif de domicile',
      description: 'Justificatif de domicile récent',
      dossierTypeId: '1',
      documentRequis: true,
      signatureRequise: false,
      ordre: 3,
      actif: true
    },
    // Documents produits pour Achat immobilier (documentRequis: false, avec signatureRequise)
    {
      id: '4',
      nom: 'Compromis de vente',
      description: 'Contrat préliminaire entre le vendeur et l\'acheteur.',
      dossierTypeId: '1',
      documentRequis: false,
      signatureRequise: true,
      ordre: 4,
      actif: true
    },
    {
      id: '5',
      nom: 'Acte authentique de vente',
      description: 'Acte final de transfert de propriété',
      dossierTypeId: '1',
      documentRequis: false,
      signatureRequise: true,
      ordre: 5,
      actif: true
    },
    {
      id: '6',
      nom: 'Procuration',
      description: 'Document permettant à une personne d\'agir au ...',
      dossierTypeId: '1',
      documentRequis: false,
      signatureRequise: false,
      ordre: 6,
      actif: true
    }
  ];

  getDossierTypes(): Observable<DossierType[]> {
    return of([...this.dossierTypes]).pipe(delay(300));
  }

  getDossierTypeById(id: string): Observable<DossierType | null> {
    const dossierType = this.dossierTypes.find(dt => dt.id === id);
    return of(dossierType || null).pipe(delay(200));
  }

  createDossierType(request: CreateDossierTypeRequest): Observable<DossierType> {
    // Simuler une vérification d'unicité
    if (this.dossierTypes.some(dt => dt.nom.toLowerCase() === request.nom.toLowerCase())) {
      return throwError(() => new Error('Un type de dossier avec ce nom existe déjà'));
    }

    const newDossierType: DossierType = {
      id: (this.dossierTypes.length + 1).toString(),
      nom: request.nom,
      description: request.description,
      dateCreation: new Date(),
      dateModification: new Date(),
      actif: true
    };

    this.dossierTypes.push(newDossierType);
    return of(newDossierType).pipe(delay(500));
  }

  updateDossierType(id: string, request: UpdateDossierTypeRequest): Observable<DossierType> {
    const index = this.dossierTypes.findIndex(dt => dt.id === id);
    if (index === -1) {
      return throwError(() => new Error('Type de dossier non trouvé'));
    }

    // Vérifier l'unicité (exclure l'élément actuel)
    if (this.dossierTypes.some(dt => dt.id !== id && dt.nom.toLowerCase() === request.nom.toLowerCase())) {
      return throwError(() => new Error('Un type de dossier avec ce nom existe déjà'));
    }

    this.dossierTypes[index] = {
      ...this.dossierTypes[index],
      nom: request.nom,
      description: request.description,
      dateModification: new Date()
    };

    return of(this.dossierTypes[index]).pipe(delay(500));
  }

  deleteDossierType(id: string): Observable<void> {
    const index = this.dossierTypes.findIndex(dt => dt.id === id);
    if (index === -1) {
      return throwError(() => new Error('Type de dossier non trouvé'));
    }

    // Vérifier s'il y a des documents associés
    const hasDocuments = this.documentTypes.some(doc => doc.dossierTypeId === id);
    if (hasDocuments) {
      return throwError(() => new Error('Impossible de supprimer ce type de dossier car il contient des documents'));
    }

    this.dossierTypes.splice(index, 1);
    return of(void 0).pipe(delay(500));
  }

  duplicateDossierType(id: string): Observable<DossierType> {
    const original = this.dossierTypes.find(dt => dt.id === id);
    if (!original) {
      return throwError(() => new Error('Type de dossier non trouvé'));
    }

    let copyName = `${original.nom} (Copie)`;
    let counter = 1;
    while (this.dossierTypes.some(dt => dt.nom === copyName)) {
      counter++;
      copyName = `${original.nom} (Copie ${counter})`;
    }

    const duplicated: DossierType = {
      id: (this.dossierTypes.length + 1).toString(),
      nom: copyName,
      description: original.description,
      dateCreation: new Date(),
      dateModification: new Date(),
      actif: true
    };

    this.dossierTypes.push(duplicated);
    
    // Dupliquer les documents associés
    const associatedDocs = this.documentTypes.filter(doc => doc.dossierTypeId === id);
    associatedDocs.forEach(doc => {
      const duplicatedDoc: DocumentType = {
        ...doc,
        id: (this.documentTypes.length + 1).toString(),
        dossierTypeId: duplicated.id
      };
      this.documentTypes.push(duplicatedDoc);
    });

    return of(duplicated).pipe(delay(500));
  }

  getDocumentsByDossierType(dossierTypeId: string): Observable<DocumentType[]> {
    const documents = this.documentTypes.filter(doc => doc.dossierTypeId === dossierTypeId);
    return of(documents).pipe(delay(200));
  }

  createDocumentType(request: CreateDocumentTypeRequest): Observable<DocumentType> {
    const newDocument: DocumentType = {
      id: (this.documentTypes.length + 1).toString(),
      nom: request.nom,
      description: request.description,
      dossierTypeId: request.dossierTypeId,
      documentRequis: request.documentRequis,
      signatureRequise: request.signatureRequise,
      ordre: this.documentTypes.filter(d => d.dossierTypeId === request.dossierTypeId).length + 1,
      actif: true
    };

    this.documentTypes.push(newDocument);
    return of(newDocument).pipe(delay(500));
  }
}