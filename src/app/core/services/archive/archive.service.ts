// services/archive.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ArchiveItem, ArchiveFilter } from '../../../shared/interfaces/archive.interface';

@Injectable({
  providedIn: 'root'
})
export class ArchiveService {
  private archivesSubject = new BehaviorSubject<ArchiveItem[]>([]);
  public archives$ = this.archivesSubject.asObservable();

  private mockArchives: ArchiveItem[] = [
    {
      id: '1',
      title: 'Vente Appartement Plateau',
      dossierNumber: 'Dossier C010',
      type: 'Vente immobilier',
      archivedDate: new Date('2025-08-09'),
      clientName: 'Ousmane Ndiaye',
      icon: 'folder'
    },
    {
      id: '2',
      title: 'Succession Famille Gueye',
      dossierNumber: 'Dossier C011',
      type: 'Succession',
      archivedDate: new Date('2025-08-09'),
      clientName: 'Omar Cissé',
      icon: 'folder'
    },
    {
      id: '3',
      title: 'Donation entre Époux Diallo',
      dossierNumber: 'Dossier C012',
      type: 'Donation',
      archivedDate: new Date('2025-08-09'),
      clientName: 'Aïssatou Diallo',
      icon: 'folder'
    }
  ];

  constructor() {
    this.archivesSubject.next(this.mockArchives);
  }

  getArchives(): Observable<ArchiveItem[]> {
    return this.archives$;
  }

  filterArchives(filter: Partial<ArchiveFilter>): Observable<ArchiveItem[]> {
    const filteredArchives = this.mockArchives.filter(archive => {
      let matches = true;

      if (filter.client && filter.client !== 'Tous les clients') {
        matches = matches && archive.clientName.toLowerCase().includes(filter.client.toLowerCase());
      }

      if (filter.type && filter.type !== 'Tous les types') {
        matches = matches && archive.type === filter.type;
      }

      if (filter.year && filter.year !== 'Tous les années') {
        matches = matches && archive.archivedDate.getFullYear().toString() === filter.year;
      }

      if (filter.month && filter.month !== 'Tous les mois') {
        const monthIndex = this.getMonthIndex(filter.month);
        matches = matches && archive.archivedDate.getMonth() === monthIndex;
      }

      return matches;
    });

    this.archivesSubject.next(filteredArchives);
    return this.archives$;
  }

  getClients(): string[] {
    return Array.from(new Set(this.mockArchives.map(archive => archive.clientName)));
  }

  getTypes(): string[] {
    return Array.from(new Set(this.mockArchives.map(archive => archive.type)));
  }

  getYears(): string[] {
    return Array.from(new Set(this.mockArchives.map(archive => archive.archivedDate.getFullYear().toString())));
  }

  getMonths(): string[] {
    return [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
  }

  private getMonthIndex(monthName: string): number {
    const months = this.getMonths();
    return months.indexOf(monthName);
  }

  resetFilters(): void {
    this.archivesSubject.next(this.mockArchives);
  }
}