import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MainLayoutComponent } from '../../core/layouts/main-layout/main-layout.component';
import { ClientsListComponent } from '../../shared/components/clients/client-list/client-list.component';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MainLayoutComponent, 
    ClientsListComponent,
  ],
  template: `
    <app-main-layout pageTitle="Clients">
      <app-clients-list></app-clients-list>
    </app-main-layout>
  `
})
export class ClientsComponent {}