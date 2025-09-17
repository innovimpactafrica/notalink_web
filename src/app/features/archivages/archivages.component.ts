import { Component, HostListener, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { MainLayoutComponent } from '../../core/layouts/main-layout/main-layout.component';
import { FilterModalComponent } from '../../shared/components/archive/filter-modal/filter-modal.component';
import { ArchiveService } from '../../core/services/archive/archive.service';
import { ArchiveItem, ArchiveFilter } from '../../shared/interfaces/archive.interface';

@Component({
  selector: 'app-archivages',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MainLayoutComponent, 
    FilterModalComponent
  ],
  template: `
    <app-main-layout pageTitle="Dossiers archivés">
      <!-- Page Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Dossiers archivés</h1>
        <p class="text-gray-600">Retrouver tous vos dossier archivés dans cette endroit.</p>
      </div>

      <!-- Search and Filter Bar -->
      <div class="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-t-lg">
        <!-- Search Input -->
        <div class="flex-1 relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input 
            type="text" 
            [(ngModel)]="searchTerm"
            (ngModelChange)="onSearchChange()"
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Rechercher un nom, numéro de dossier, type...">
        </div>

        <!-- Filter Button -->
        <div class="relative">
          <button 
            #filterButton
            type="button"
            (click)="openFilterModal()"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293.707L3.293 7.707A1 1 0 013 7V4z"></path>
            </svg>
            Filter
          </button>
          <app-filter-modal
            [(isOpen)]="showFilterModal"
            [position]="dropdownPosition"
            (filtersApplied)="onFiltersApplied($event)">
          </app-filter-modal>
        </div>
      </div>

      <!-- Archives List -->
      <div class="space-y-4 bg-white p-4 rounded-b-lg min-h-[300px]">
        <div 
          *ngFor="let archive of archives$ | async; trackBy: trackByArchiveId" 
          class="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow">
          
          <div class="flex items-center justify-between">
            <!-- Left Content -->
            <div class="flex items-start space-x-4">
              <!-- Folder Icon -->
              <div class="flex-shrink-0 w-10 h-10 bg-[#1C3055] bg-opacity-20 rounded-full flex items-center justify-center">
                <img src="images/archive.svg" alt="Archive Icon" class="w-4 h-4">
              </div>

              <!-- Archive Details -->
              <div class="flex-1 min-w-0">
                <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ archive.title }}</h3>
                
                <div class="flex items-center space-x-4 text-sm text-gray-600">
                  <!-- Dossier Number -->
                  <div class="flex items-center space-x-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                    </svg>
                    <span>{{ archive.dossierNumber }}</span>
                  </div>

                  <!-- Separator -->
                  <span class="text-gray-600">•</span>

                  <!-- Type -->
                  <div class="flex items-center space-x-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                    </svg>
                    <span>{{ archive.type }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Content -->
            <div class="flex flex-col items-end space-y-2">
              <div class="text-sm text-gray-500">Archivé le {{ formatDate(archive.archivedDate) }}</div>
              <div class="flex items-center text-sm text-gray-600">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <span>{{ archive.clientName }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div 
          *ngIf="(archives$ | async)?.length === 0" 
          class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 2a1 1 0 000 2h6a1 1 0 100-2H9z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Aucun dossier archivé trouvé</h3>
          <p class="text-gray-500">Essayez de modifier vos filtres ou votre recherche.</p>
        </div>
      </div>
    </app-main-layout>
  `,
  styles: [`
    :host {
      display: block;
    }
    .relative {
      position: relative;
    }
  `]
})
export class ArchivagesComponent implements OnInit, AfterViewInit {
  @ViewChild('filterButton', { static: false }) filterButton!: ElementRef;
  @ViewChild(FilterModalComponent, { read: ElementRef }) filterContainer!: ElementRef;
  archives$: Observable<ArchiveItem[]>;
  searchTerm = '';
  showFilterModal = false;
  dropdownPosition: { top: number; left: number } | null = null;
  private originalArchives: ArchiveItem[] = [];

  constructor(private archiveService: ArchiveService) {
    this.archives$ = this.archiveService.getArchives();
  }

  ngOnInit(): void {
    this.loadArchives();
  }

  ngAfterViewInit(): void {
  }

  loadArchives(): void {
    this.archiveService.getArchives().subscribe(archives => {
      this.originalArchives = archives;
    });
  }

  onSearchChange(): void {
    if (!this.searchTerm.trim()) {
      this.archives$ = this.archiveService.getArchives();
      return;
    }

    const filteredArchives = this.originalArchives.filter(archive => 
      archive.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      archive.dossierNumber.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      archive.type.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      archive.clientName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    this.archiveService['archivesSubject'].next(filteredArchives);
  }

  openFilterModal(): void {
    if (this.filterButton) {
      const rect = this.filterButton.nativeElement.getBoundingClientRect();
      this.dropdownPosition = {
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX
      };
    }
    this.showFilterModal = true;
  }

  onFiltersApplied(filter: ArchiveFilter): void {
    this.archives$ = this.archiveService.filterArchives(filter);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(date);
  }

  trackByArchiveId(index: number, archive: ArchiveItem): string {
    return archive.id;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (this.showFilterModal && this.filterContainer && !this.filterContainer.nativeElement.contains(event.target as HTMLElement) &&
        !this.filterButton.nativeElement.contains(event.target as HTMLElement)) {
      this.showFilterModal = false;
    }
  }
}