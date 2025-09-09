import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Client } from '../../../core/interfaces/client.interface';
import { ClientService } from '../../../core/services/clients/client.service';
import { MainLayoutComponent } from '../../../core/layouts/main-layout/main-layout.component';

@Component({
  selector: 'app-client-details',
  standalone: true,
  imports: [CommonModule, MainLayoutComponent],
  template: `
    <app-main-layout [pageTitle]="getPageTitle()">
      <div class="bg-white rounded-xl shadow-sm">

        <div class="p-6" *ngIf="client">
          <!-- Client Header -->
          <div class="flex items-start gap-4 mb-8">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <span class="text-xl font-semibold text-gray-600">
                {{ getInitials(client.firstName, client.lastName) }}
              </span>
            </div>
            
            <div class="flex-1">
              <h1 class="text-2xl font-bold text-gray-900 mb-1">
                {{ client.firstName }} {{ client.lastName }}
              </h1>
              <p class="text-gray-500">{{ client.email }}</p>
            </div>
          </div>

          <!-- Content Area -->
          <div class="flex gap-8">
            <!-- Left Side - Personal Information -->
            <div class="w-1/4 bg-[#F9FAFB] p-4 rounded-xl">
              <h2 class="text-lg font-semibold text-gray-900 mb-4">Informations personnelles</h2>
              
              <div class="space-y-4">
                <div>
                  <label class="text-sm font-medium text-gray-500">Adresse</label>
                  <p class="text-gray-900">{{ client.address }}</p>
                </div>
                
                <div>
                  <label class="text-sm font-medium text-gray-500">Téléphone</label>
                  <p class="text-gray-900">{{ client.phone }}</p>
                </div>
                
                <div>
                  <label class="text-sm font-medium text-gray-500">Numéro d'identité</label>
                  <p class="text-gray-900">{{ client.identityNumber }}</p>
                </div>
                
                <div>
                  <label class="text-sm font-medium text-gray-500">Date de naissance</label>
                  <p class="text-gray-900">{{ client.birthDate }}</p>
                </div>
                
                <div>
                  <label class="text-sm font-medium text-gray-500">Lieu de naissance</label>
                  <p class="text-gray-900">{{ client.birthPlace }}</p>
                </div>
                
                <div>
                  <label class="text-sm font-medium text-gray-500">Profession</label>
                  <p class="text-gray-900">{{ client.profession }}</p>
                </div>
                
                <div>
                  <label class="text-sm font-medium text-gray-500">Situation matrimoniale</label>
                  <p class="text-gray-900">{{ client.maritalStatus }}</p>
                </div>
                
                <div class="pt-4 flex space-x-3">
                  <button class="text-blue-600 hover:text-blue-800 font-medium">Modifier</button>
                  <button class="text-blue-600 hover:text-blue-800 font-medium">Historique</button>
                </div>
              </div>
            </div>

            <!-- Right Side - Tab Content -->
            <div class="flex-1 bg-white rounded-xl border border-gray-200">
              
               <!-- Tabs -->
              <div class="border-b border-gray-200 mb-6 pt-6">
                <nav class="flex space-x-8">
                  <button 
                    class="w-full py-2 px-1 border-b-2 font-medium text-sm transition-colors"
                    [class]="activeTab === 'dossiers' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
                    (click)="activeTab = 'dossiers'"
                  >
                    Dossiers
                  </button>
                  <button 
                    class="w-full py-2 px-1 border-b-2 font-medium text-sm transition-colors"
                    [class]="activeTab === 'documents' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
                    (click)="activeTab = 'documents'"
                  >
                    Documents
                  </button>
                  <button 
                    class="w-full py-2 px-1 border-b-2 font-medium text-sm transition-colors"
                    [class]="activeTab === 'appointments' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
                    (click)="activeTab = 'appointments'"
                  >
                    Rendez-vous
                  </button>
                </nav>
              </div>

              <!-- Dossiers Tab -->
              <div *ngIf="activeTab === 'dossiers'" class="flex flex-col gap-4 px-4 pb-6">
                <div>
                  <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold">Dossiers ({{ client.activeCases }})</h3>
                    <button class="flex items-center gap-2 text-blue-600 font-semibold">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                      </svg>
                      Nouveau dossier
                    </button>
                  </div>
                  
                  <div class="space-y-3" *ngIf="client.activeCases > 0; else noCases">
                    <div class="flex flex-col justify-between p-4 border border-gray-200 rounded-lg">
                      <div class="flex items-center gap-3">
                        <div class="flex justify-between items-center gap-2 w-full">
                          <span class="font-medium">Achat Terrain Agricole</span>
                          <button class="flex gap-2 items-center text-blue-600 hover:text-blue-800">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                            </svg>
                            <span>Voir</span>
                          </button>
                        </div>
                      </div>
                      <div class="flex items-center gap-2">
                        <span class="w-2 h-2 bg-orange-500 rounded-full"></span>
                        <span class="text-sm text-gray-500">En cours</span>
                      </div>
                      <div class="flex items-center gap-4">
                        <span class="text-sm text-gray-500">Créé le 01/07/2023</span>
                      </div>
                    </div>
                    
                    <div class="flex flex-col justify-between p-4 border border-gray-200 rounded-lg">
                      <div class="flex items-center gap-3">
                        <div class="flex justify-between items-center gap-2 w-full">
                          <span class="font-medium">Création SCI</span>
                          <button class="flex gap-2 items-center text-blue-600 hover:text-blue-800">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                            </svg>
                            <span>Voir</span>
                          </button>
                        </div>
                      </div>
                      <div class="flex items-center gap-2">
                        <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span class="text-sm text-gray-500">Terminé</span>
                      </div>
                      <div class="flex items-center gap-4">
                        <span class="text-sm text-gray-500">Créé le 15/03/2023</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="mb-6">
                  <h4 class="font-semibold text-gray-900 mb-3">Rendez-vous à venir</h4>
                  
                  <div class="border border-gray-200 rounded-lg p-4">
                    <div class="flex items-center justify-between">
                      <div>
                        <h5 class="font-medium text-black">Signature acte</h5>
                        <p class="text-gray-500 text-sm">15/08/2023 à 11:00</p>
                      </div>
                      <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        Planifié
                      </span>
                    </div>
                  </div>
                </div>
                
                <ng-template #noCases>
                  <div class="text-center py-8 text-gray-500">
                    <p>Aucun dossier actif</p>
                  </div>
                </ng-template>
              </div>

              <!-- Documents Tab -->
              <div *ngIf="activeTab === 'documents'" class="flex flex-col gap-4 px-4 pb-6">
                <div class="text-center py-8 text-gray-500">
                  <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                  </svg>
                  <p>Aucun document disponible</p>
                </div>
              </div>

              <!-- Appointments Tab -->
              <div *ngIf="activeTab === 'appointments'" class="flex flex-col gap-4 px-4 pb-6">
                <div class="mb-6">
                  <h4 class="font-semibold text-gray-900 mb-3">Rendez-vous à venir</h4>
                  
                  <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div class="flex items-center justify-between">
                      <div>
                        <h5 class="font-medium text-blue-900">Signature acte</h5>
                        <p class="text-blue-700 text-sm">15/08/2023 à 11:00</p>
                      </div>
                      <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        Planifié
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div *ngIf="!client && !isLoading" class="p-6 text-center">
          <div class="text-red-500 mb-2">
            <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Client non trouvé</h3>
          <p class="text-gray-500 mb-4">Le client demandé n'existe pas ou a été supprimé.</p>
          <button 
            (click)="goBack()"
            class="inline-flex items-center gap-2 px-4 py-2 bg-[#D4B068] text-white rounded-lg hover:bg-[#C19B52] transition-colors"
          >
            Retour aux clients
          </button>
        </div>

      </div>
      <!-- Back Button -->
      <div class="py-6" *ngIf="client">
        <button 
          (click)="goBack()"
          class="flex items-center gap-2 px-4 py-2 bg-[#D9D9D9] text-[#374151] rounded-lg"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          Retour
        </button>
      </div>
    </app-main-layout>
  `
})
export class ClientDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private clientService = inject(ClientService);

  client: Client | null = null;
  activeTab: string = 'dossiers';
  isLoading = true;
  clientId: string = '';

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.clientId = params.get('id') || '';
      this.loadClient();
    });
  }

  loadClient() {
    this.isLoading = true;
    if (this.clientId) {
      // Simuler un délai de chargement pour une meilleure UX
      setTimeout(() => {
        this.client = this.clientService.getClientById(this.clientId) ?? null;
        this.isLoading = false;
      }, 300);
    }
  }

  getInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }

  getPageTitle(): string {
    return this.client ? `${this.client.firstName} ${this.client.lastName}` : 'Détails du client';
  }

  goBack() {
    this.router.navigate(['/clients']);
  }
}