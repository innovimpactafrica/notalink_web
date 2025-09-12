import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from '../../core/layouts/main-layout/main-layout.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Dossier } from '../../core/interfaces/dossier.interface';
import { DossierService } from '../../core/services/dossiers/dossier.service';

@Component({
  selector: 'app-dossiers',
  standalone: true,
  imports: [CommonModule, MainLayoutComponent, FormsModule],
  templateUrl: './dossiers.component.html',
})
export class DossiersComponent implements OnInit {
  breadcrumbs = [
    { label: 'Accueil' },
    { label: 'Dossiers clients' }
  ];

  searchTerm = '';
  selectedStatus = '';
  showAdvancedFilters = false;

  dossiers: Dossier[] = [];

  filteredDossiers: Dossier[] = [];

  constructor(private router: Router, private dossierService: DossierService) {}

  ngOnInit(): void {
    this.dossiers = this.dossierService.getDossiers();
    this.filteredDossiers = [...this.dossiers];
  }

  filterDossiers(): void {
    this.filteredDossiers = this.dossiers.filter(dossier => {
      const matchesSearch = !this.searchTerm || 
        dossier.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        dossier.client.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        dossier.type.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus = !this.selectedStatus || dossier.status === this.selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'En cours':
        return 'bg-[#FEF3C7] text-[#92400E]';
      case 'En attente':
        return 'bg-[#1C3055] bg-opacity-10 text-[#1C3055]';
      case 'Terminé':
        return 'bg-[#16A34A] bg-opacity-10 text-[#16A34A]';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  toggleAdvancedFilters(): void {
    this.showAdvancedFilters = !this.showAdvancedFilters;
  }

  createNewDossier(): void {
    console.log('Créer un nouveau dossier');
  }

  openDossier(dossier: Dossier): void {
    this.router.navigate(['/folders', dossier.id]);
  }
}