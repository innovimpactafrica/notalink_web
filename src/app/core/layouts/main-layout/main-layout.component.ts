import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, HeaderComponent, SidebarComponent],
  template: `
    <div class="flex flex-col min-h-screen bg-[#F5F5F3]">
      <!-- Sidebar -->
      <app-sidebar class="lg:fixed lg:top-0 lg:left-0 lg:h-full"></app-sidebar>

      <!-- Main Content Area -->
      <div class="flex-1 flex flex-col lg:ml-64 transition-all duration-300">
        <!-- Header -->
        <app-header 
          [pageTitle]="pageTitle"
          class="sticky top-0 z-10 bg-[#F5F5F3] shadow-sm">
        </app-header>

        <!-- Page Content -->
        <main class="flex-1 overflow-y-auto">
          <div class="p-4 sm:p-6">
            <ng-content></ng-content>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }
  `]
})
export class MainLayoutComponent {
  @Input() pageTitle: string = 'Tableau de bord';
}