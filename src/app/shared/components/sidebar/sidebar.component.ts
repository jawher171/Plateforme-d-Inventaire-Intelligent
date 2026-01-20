import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <div class="sidebar">
      <div class="sidebar-header">
        <div class="logo">
          <span class="logo-icon">📦</span>
          <h2>Inventaire</h2>
        </div>
      </div>

      <nav class="sidebar-nav">
        <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
          <span class="icon">📊</span>
          <span>Tableau de bord</span>
        </a>

        <a routerLink="/products" routerLinkActive="active" class="nav-item">
          <span class="icon">📦</span>
          <span>Produits</span>
        </a>

        <a routerLink="/stock" routerLinkActive="active" class="nav-item">
          <span class="icon">🔄</span>
          <span>Mouvements</span>
        </a>

        <a routerLink="/scanner" routerLinkActive="active" class="nav-item">
          <span class="icon">📱</span>
          <span>Scanner</span>
        </a>

        <a routerLink="/alerts" routerLinkActive="active" class="nav-item">
          <span class="icon">⚠️</span>
          <span>Alertes</span>
          <span class="badge" *ngIf="alertCount > 0">{{ alertCount }}</span>
        </a>

        <a routerLink="/sites" routerLinkActive="active" class="nav-item" *ngIf="authService.hasRole('Admin')">
          <span class="icon">🏢</span>
          <span>Sites</span>
        </a>
      </nav>
    </div>
  `,
  styles: [`
    .sidebar {
      width: 260px;
      height: 100vh;
      background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
      color: white;
      position: fixed;
      left: 0;
      top: 0;
      overflow-y: auto;
      box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
    }

    .sidebar-header {
      padding: 25px 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-icon {
      font-size: 32px;
    }

    .logo h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
    }

    .sidebar-nav {
      padding: 20px 0;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 20px;
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      transition: all 0.3s ease;
      position: relative;
      cursor: pointer;
    }

    .nav-item:hover {
      background-color: rgba(255, 255, 255, 0.05);
      color: white;
    }

    .nav-item.active {
      background-color: rgba(33, 150, 243, 0.2);
      color: white;
      border-left: 4px solid #2196F3;
    }

    .nav-item .icon {
      font-size: 20px;
      width: 24px;
      text-align: center;
    }

    .nav-item .badge {
      margin-left: auto;
      background-color: #e74c3c;
      color: white;
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 11px;
      font-weight: 600;
    }

    @media (max-width: 768px) {
      .sidebar {
        width: 80px;
      }

      .logo h2,
      .nav-item span:not(.icon):not(.badge) {
        display: none;
      }

      .sidebar-header {
        padding: 20px 10px;
      }

      .logo {
        justify-content: center;
      }

      .nav-item {
        justify-content: center;
        padding: 14px 10px;
      }
    }
  `]
})
export class SidebarComponent {
  alertCount = 0;

  constructor(public authService: AuthService) {}
}
