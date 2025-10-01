// src/app/features/rendezvous/rendezvous.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MainLayoutComponent } from '../../core/layouts/main-layout/main-layout.component';
import { NewRendezVousModalComponent } from '../../shared/components/rendezvous/new-rendezvous-modal/new-rendezvous-modal.component';
import { RendezVousDetailsModalComponent } from '../../shared/components/rendezvous/rendezvous-details-modal/rendezvous-details-modal.component';
import { RendezVousService } from '../../core/services/rendezvous/rendezvous.service';
import { RendezVous, CreateRendezVousDto } from '../../shared/interfaces/rendezvous.interface';

@Component({
  selector: 'app-rendezvous',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    MainLayoutComponent, 
    NewRendezVousModalComponent,
    RendezVousDetailsModalComponent,
  ],
  styleUrls: ['./rendezvous.component.css'],
  templateUrl: './rendezvous.component.html',
})
export class RendezvousComponent implements OnInit {
  rendezVous: RendezVous[] = [];
  filteredRendezVous: RendezVous[] = [];
  
  // UI State
  currentView: 'calendar' | 'list' = 'calendar';
  calendarView: 'month' | 'week' | 'day' = 'month';
  showNewModal = false;
  showDetailsModal = false;
  selectedRendezVous: RendezVous | null = null;
  
  // Filters
  searchQuery = '';
  statusFilter = '';
  
  // Calendar
  currentDate = new Date();
  calendarDays: any[] = [];
  daysOfWeek = ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'];

  constructor(private rendezVousService: RendezVousService) {}

  ngOnInit() {
    this.loadRendezVous();
    this.generateCalendar();
  }

  loadRendezVous() {
    this.rendezVousService.getRendezVous().subscribe(rendezVous => {
      this.rendezVous = rendezVous;
      this.applyFilters();
    });
  }

  // Modal Methods
  openNewRendezVousModal() {
    this.showNewModal = true;
  }

  closeNewModal() {
    this.showNewModal = false;
  }

  openDetailsModal(rendezVous: RendezVous) {
    this.selectedRendezVous = rendezVous;
    this.showDetailsModal = true;
  }

  closeDetailsModal() {
    this.showDetailsModal = false;
    this.selectedRendezVous = null;
  }

  // CRUD Operations
  createRendezVous(rendezVousData: CreateRendezVousDto) {
    this.rendezVousService.createRendezVous(rendezVousData).subscribe(() => {
      this.loadRendezVous();
    });
  }

  editRendezVous(rendezVous: RendezVous) {
    console.log('Edit rendez-vous:', rendezVous);
    // Implement edit functionality
  }

  cancelRendezVous(id: string) {
    this.rendezVousService.updateRendezVous(id, { statut: 'annule' }).subscribe(() => {
      this.loadRendezVous();
    });
  }

  // Filter Methods
  onSearch() {
    this.applyFilters();
  }

  applyFilters() {
    this.filteredRendezVous = this.rendezVous.filter(rdv => {
      const matchesSearch = !this.searchQuery || 
        rdv.motif.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        rdv.clientName.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      const matchesStatus = !this.statusFilter || rdv.statut === this.statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }

  clearFilters() {
    this.searchQuery = '';
    this.statusFilter = '';
    this.applyFilters();
  }

  switchView(view: 'calendar' | 'list') {
    this.currentView = view;
  }

  // Calendar Methods
  generateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    this.calendarDays = [];
    const currentDate = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      const today = new Date();
      this.calendarDays.push({
        date: new Date(currentDate),
        isCurrentMonth: currentDate.getMonth() === month,
        isToday: currentDate.toDateString() === today.toDateString()
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  getCurrentMonthYear(): string {
    return this.currentDate.toLocaleString('default', { month: 'long' }) + ' ' + this.currentDate.getFullYear();
  }

  previousMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.generateCalendar();
  }

  nextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.generateCalendar();
  }

  getRendezVousForDay(date: Date): RendezVous[] {
    return this.filteredRendezVous.filter(rdv => {
      const rdvDate = new Date(rdv.date);
      return rdvDate.toDateString() === date.toDateString();
    });
  }
  
  getEventClass(rdv: RendezVous): string {
    switch (rdv.type) {
      case 'physique': return 'bg-green-100 text-green-800 border-l-4 border-green-600';
      case 'telephonique': return 'bg-blue-100 text-blue-800 border-l-4 border-blue-600';
      case 'visioconference': return 'bg-purple-100 text-purple-800 border-l-4 border-purple-600';
      default: return '';
    }
  } 
  getTypeLabel(type: string): string {
    switch (type) {
      case 'physique': return 'Physique';
      case 'telephonique': return 'Téléphonique';
      case 'visioconference': return 'Visioconférence';
      default: return '';
    }
  }

  getTypeClass(type: string): string {
    switch (type) {
      case 'physique': return 'px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded';
      case 'telephonique': return 'px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded';
      case 'visioconference': return 'px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded';
      default: return '';
    }
  }
  
  getStatusLabel(status: string): string {
    switch (status) {
      case 'planifie': return 'Planifié';
      case 'confirme': return 'Confirmé';
      case 'annule': return 'Annulé';
      case 'reporte': return 'Reporté';
      case 'termine': return 'Terminé';
      default: return '';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'planifie': return 'px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded';
      case 'confirme': return 'px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded';
      case 'annule': return 'px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded';
      case 'reporte': return 'px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded';
      case 'termine': return 'px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded';
      default: return '';
    }
  }

  getFormattedDate(date: string | Date): string {
    const d = new Date(date);
    // Format: dd/mm/yyyy
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

}