import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from '../../../core/layouts/main-layout/main-layout.component';
import { DossierApercuComponent } from '../../../shared/components/dossiers/dossier-apercu/dossier-apercu.component';
import { DossierDocumentsComponent } from '../../../shared/components/dossiers/dossier-documents/dossier-documents.component';
import { DossierPaymentsComponent } from '../../../shared/components/dossiers/dossier-payments/dossier-payments.component';
import { ActivatedRoute } from '@angular/router';
import { DossierService } from '../../../core/services/dossiers/dossier.service';
import { Dossier } from '../../../shared/interfaces/dossier.interface';

@Component({
  selector: 'app-dossier-details',
  standalone: true,
  imports: [
    CommonModule,
    MainLayoutComponent,
    DossierApercuComponent,
    DossierDocumentsComponent,
    DossierPaymentsComponent
  ],
  template: `
    <app-main-layout pageTitle="Dossiers clients">
      <!-- En-tête du dossier -->
      <div class="bg-white rounded-lg shadow-sm mb-6">
        <div class="p-6 border-b border-gray-200">
          <div class="flex flex-col mb-6">
            <h1 class="text-2xl font-semibold text-[#1C3055]">{{ dossier?.title }}</h1>
            <div>
              <span class="text-[#6B7280] text-xs font-medium rounded-full">
                {{ dossier?.type }}
              </span>
              <span class="hidden sm:inline px-2">•</span>
              <span [ngClass]="getStatusClass(dossier?.status)" class="px-3 py-1 text-xs font-medium rounded-full">
                {{ dossier?.status }}
              </span>
            </div>
          </div>
          
          <!-- Barre de progression -->
          <div class="mb-4">
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div [ngClass]="dossier?.color" class="h-2 rounded-full" [style.width]="dossier?.progress + '%'"></div>
            </div>
            <div class="flex justify-between items-center mb-2">
              <span class="text-xs font-medium text-gray-700">Progression</span>
              <span class="text-xs font-medium text-gray-700">{{ dossier?.progress }}%</span>
            </div>
          </div>
        </div>

        <!-- Navigation par onglets -->
        <div class="border-b border-gray-200">
          <nav class="flex ">
            <button 
              (click)="setActiveTab('apercu')"
              [class]="activeTab === 'apercu' 
                ? 'py-4 px-1 w-full border-b-2 border-yellow-500 text-[#D4B036] font-semibold text-md whitespace-nowrap' 
                : 'py-4 px-1 w-full border-b-2 border-transparent text-gray-500 hover:tex[#D4B036] font-semibold text-md whitespace-nowrap'">
              Aperçu
            </button>
            <button 
              (click)="setActiveTab('documents')"
              [class]="activeTab === 'documents' 
                ? 'py-4 px-1 w-full border-b-2 border-yellow-500 text-[#D4B036] font-semibold text-md whitespace-nowrap' 
                : 'py-4 px-1 w-full border-b-2 border-transparent text-gray-500 hover:tex[#D4B036] font-semibold text-md whitespace-nowrap'">
              Documents
            </button>
            <button 
              (click)="setActiveTab('paiements')"
              [class]="activeTab === 'paiements' 
                ? 'py-4 px-1 w-full border-b-2 border-yellow-500 text-[#D4B036] font-semibold text-md whitespace-nowrap' 
                : 'py-4 px-1 w-full border-b-2 border-transparent text-gray-500 hover:tex[#D4B036] font-semibold text-md whitespace-nowrap'">
              Paiements
            </button>
          </nav>
        </div>
      </div>

      <!-- Contenu dynamique selon l'onglet actif -->
      <div class="transition-all duration-300 ease-in-out">
        <app-dossier-apercu *ngIf="activeTab === 'apercu'" [dossier]="dossier"></app-dossier-apercu>
        <app-dossier-documents *ngIf="activeTab === 'documents'" [dossier]="dossier"></app-dossier-documents>
        <app-dossier-payments *ngIf="activeTab === 'paiements'" [dossier]="dossier"></app-dossier-payments>
      </div>

      <div class="fixed bottom-10 right-10 mb-4">
        <button class="rounded-full bg-[#D4B036] shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 p-4">
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M6.06704 24.975H16.54C17.5276 24.975 17.5276 24.9819 18.0009 25.3317C18.4741 25.6814 23.8786 29.3645 23.8786 29.3645V24.975H24.1324C27.0267 24.975 29.3655 22.794 29.3655 20.078V5.75057C29.3655 3.03459 27.0198 0.833008 24.1324 0.833008H6.06704C3.1796 0.833008 0.833984 3.03459 0.833984 5.75057V20.078C0.833984 22.794 3.1796 24.975 6.06704 24.975Z" fill="#1C3055"/>
        </svg>
        </button>
      </div>
    </app-main-layout>
  `
})
export class DossierDetailsComponent implements OnInit {
  activeTab: 'apercu' | 'documents' | 'paiements' = 'apercu';
  dossier: Dossier | undefined;

  constructor(private route: ActivatedRoute, private dossierService: DossierService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.dossier = this.dossierService.getDossierById(id);
      }
    });
  }

  setActiveTab(tab: 'apercu' | 'documents' | 'paiements') {
    this.activeTab = tab;
  }
  getStatusClass(status: string | undefined): string {
    switch (status) {
      case 'En cours':
        return 'bg-[#D4B036] bg-opacity-20 text-[#92400E]';
      case 'En attente':
        return 'bg-[#1C3055] bg-opacity-20 text-[#1C3055]';
      case 'Terminé':
        return 'bg-[#16A34A] bg-opacity-20 text-[#16A34A]';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}