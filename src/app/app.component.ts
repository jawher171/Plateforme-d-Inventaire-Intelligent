import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, NavbarComponent],
  template: `
    <div class="app-container">
      <app-sidebar *ngIf="authService.isAuthenticated()"></app-sidebar>
      
      <div class="main-content" [class.with-sidebar]="authService.isAuthenticated()">
        <app-navbar *ngIf="authService.isAuthenticated()"></app-navbar>
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      min-height: 100vh;
    }

    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      background-color: #f5f5f5;
    }

    .main-content.with-sidebar {
      margin-left: 260px;
    }

    @media (max-width: 768px) {
      .main-content.with-sidebar {
        margin-left: 80px;
      }
    }
  `]
})
export class AppComponent {
  constructor(public authService: AuthService) {}
}
