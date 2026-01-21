import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LiveStatusComponent } from '../live-status/live-status.component';
import { AnimatedBadgeComponent } from '../animated-badge/animated-badge.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LiveStatusComponent, AnimatedBadgeComponent],
  template: `
    <div class="sidebar" [class.collapsed]="isCollapsed">
      <div class="sidebar-header">
        <div class="logo">
          <div class="logo-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="6" fill="url(#gradient)"/>
              <path d="M9 12h14M9 16h14M9 20h10" stroke="white" stroke-width="2" stroke-linecap="round"/>
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="32" y2="32">
                  <stop offset="0%" stop-color="#2196F3"/>
                  <stop offset="100%" stop-color="#1976D2"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h2 *ngIf="!isCollapsed">Inventaire</h2>
        </div>
        <button class="toggle-btn" (click)="toggleSidebar()" *ngIf="!isMobile()">
          <span>{{ isCollapsed ? '→' : '←' }}</span>
        </button>
      </div>

      <nav class="sidebar-nav">
        <a routerLink="/dashboard" routerLinkActive="active" class="nav-item" title="Tableau de bord">
          <span class="icon">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
          </span>
          <span class="label" *ngIf="!isCollapsed">Tableau de bord</span>
        </a>

        <a routerLink="/products" routerLinkActive="active" class="nav-item" title="Produits">
          <span class="icon">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M4 3h12l2 4v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7l2-4zm0 2l-1 2h14l-1-2H4zm-2 4v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9H2z"/>
            </svg>
          </span>
          <span class="label" *ngIf="!isCollapsed">Produits</span>
        </a>

        <a routerLink="/stock" routerLinkActive="active" class="nav-item" title="Mouvements">
          <span class="icon">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 3L3 9l7 6 7-6-7-6zm0 2.83L14.17 9 10 12.17 5.83 9 10 5.83zM10 15l-7-6v7l7 6 7-6v-7l-7 6z"/>
            </svg>
          </span>
          <span class="label" *ngIf="!isCollapsed">Mouvements</span>
        </a>

        <a routerLink="/scanner" routerLinkActive="active" class="nav-item" title="Scanner">
          <span class="icon">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 4h4V2H2v2zm14-2v2h4V2h-4zM2 18h4v-2H2v2zm14 0h4v-2h-4v2zM3 7v6h14V7H3zm13 5H4V8h12v4z"/>
            </svg>
          </span>
          <span class="label" *ngIf="!isCollapsed">Scanner</span>
        </a>

        <a routerLink="/alerts" routerLinkActive="active" class="nav-item" title="Alertes">
          <span class="icon">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2L2 18h16L10 2zm0 4.83L14.17 16H5.83L10 6.83zM9 11h2v2H9v-2zm0-4h2v3H9V7z"/>
            </svg>
          </span>
          <span class="label" *ngIf="!isCollapsed">Alertes</span>
          <app-animated-badge 
            *ngIf="alertCount > 0 && !isCollapsed" 
            variant="danger" 
            size="sm" 
            [pulse]="true"
            [gradient]="true"
          >
            {{ alertCount }}
          </app-animated-badge>
        </a>

        <a routerLink="/sites" routerLinkActive="active" class="nav-item" *ngIf="authService.hasRole(['Admin'])" title="Sites">
          <span class="icon">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2L2 7v11h6v-6h4v6h6V7l-8-5zm6 14h-2v-6H6v6H4V8l6-4 6 4v8z"/>
            </svg>
          </span>
          <span class="label" *ngIf="!isCollapsed">Sites</span>
        </a>
      </nav>

      <div class="sidebar-bottom">
        <app-live-status *ngIf="!isCollapsed"></app-live-status>
      </div>

      <div class="sidebar-footer" *ngIf="!isCollapsed">
        <div class="user-card">
          <div class="user-avatar">
            {{ getUserInitials() }}
          </div>
          <div class="user-info">
            <div class="user-name">{{ getUserName() }}</div>
            <div class="user-role">{{ getUserRole() }}</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sidebar {
      width: 280px;
      height: 100vh;
      background: linear-gradient(180deg, var(--color-dark-bg) 0%, var(--color-dark-bg-secondary) 100%);
      color: var(--color-text-inverse);
      position: fixed;
      left: 0;
      top: 0;
      overflow-y: auto;
      overflow-x: hidden;
      box-shadow: var(--shadow-xl);
      transition: width var(--transition-base);
      z-index: var(--z-index-fixed);
      display: flex;
      flex-direction: column;
    }

    .sidebar.collapsed {
      width: 80px;
    }

    .sidebar::-webkit-scrollbar {
      width: 6px;
    }

    .sidebar::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.05);
    }

    .sidebar::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 3px;
    }

    .sidebar::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .sidebar-header {
      padding: var(--spacing-xl) var(--spacing-lg);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--spacing-md);
    }

    .logo {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      flex: 1;
      min-width: 0;
    }

    .logo-icon {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
      }
    }

    .logo h2 {
      margin: 0;
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .toggle-btn {
      background: rgba(255, 255, 255, 0.1);
      border: none;
      width: 32px;
      height: 32px;
      border-radius: var(--radius-md);
      cursor: pointer;
      color: var(--color-text-inverse);
      transition: all var(--transition-base);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--font-size-lg);
      flex-shrink: 0;
    }

    .toggle-btn:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: scale(1.1);
    }

    .sidebar-nav {
      flex: 1;
      padding: var(--spacing-lg) 0;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
      overflow-y: auto;
    }

    .sidebar-bottom {
      padding: var(--spacing-md) var(--spacing-lg);
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      padding: var(--spacing-md) var(--spacing-lg);
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      transition: all var(--transition-base);
      position: relative;
      cursor: pointer;
      border-left: 3px solid transparent;
      margin: 0 var(--spacing-sm);
      border-radius: 0 var(--radius-md) var(--radius-md) 0;
    }

    .nav-item::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 0;
      background: linear-gradient(90deg, rgba(33, 150, 243, 0.1), transparent);
      transition: width var(--transition-base);
      border-radius: 0 var(--radius-md) var(--radius-md) 0;
    }

    .nav-item:hover {
      color: var(--color-text-inverse);
      background: rgba(255, 255, 255, 0.05);
      transform: translateX(4px);
    }

    .nav-item:hover::before {
      width: 100%;
    }

    .nav-item.active {
      color: var(--color-text-inverse);
      background: linear-gradient(90deg, rgba(33, 150, 243, 0.2), rgba(139, 92, 246, 0.2));
      border-left-color: var(--color-primary-400);
      font-weight: var(--font-weight-semibold);
      box-shadow: 0 0 20px rgba(33, 150, 243, 0.3);
    }

    .nav-item.active::before {
      width: 100%;
    }

    .nav-item .icon {
      flex-shrink: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform var(--transition-base);
    }

    .nav-item:hover .icon {
      transform: scale(1.1);
    }

    .nav-item .label {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: var(--font-size-sm);
    }

    .sidebar-footer {
      padding: var(--spacing-lg);
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      margin-top: auto;
    }

    .user-card {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      padding: var(--spacing-md);
      background: rgba(255, 255, 255, 0.05);
      border-radius: var(--radius-lg);
      transition: all var(--transition-base);
      cursor: pointer;
    }

    .user-card:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600));
      color: var(--color-text-inverse);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: var(--font-weight-bold);
      font-size: var(--font-size-sm);
      flex-shrink: 0;
      box-shadow: var(--shadow-md);
    }

    .user-info {
      flex: 1;
      min-width: 0;
    }

    .user-name {
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-sm);
      color: var(--color-text-inverse);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .user-role {
      font-size: var(--font-size-xs);
      color: rgba(255, 255, 255, 0.6);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    @media (max-width: 768px) {
      .sidebar {
        width: 80px;
      }

      .sidebar.collapsed {
        width: 80px;
      }

      .logo h2,
      .nav-item .label,
      .nav-item .badge,
      .sidebar-footer,
      .toggle-btn {
        display: none;
      }

      .sidebar-header {
        justify-content: center;
      }

      .logo {
        justify-content: center;
      }

      .nav-item {
        justify-content: center;
        padding: var(--spacing-md);
      }

      .sidebar-bottom {
        display: none;
      }
    }
  `]
})
export class SidebarComponent implements OnInit {
  alertCount = 0;
  isCollapsed = false;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    // Set a mock alert count
    this.alertCount = 3;
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  isMobile(): boolean {
    if (typeof window !== 'undefined') {
      return window.innerWidth <= 768;
    }
    return false;
  }

  getUserName(): string {
    const user = this.authService.currentUser();
    return user ? `${user.prenom} ${user.nom}` : 'Utilisateur';
  }

  getUserInitials(): string {
    const user = this.authService.currentUser();
    if (user && user.prenom && user.nom) {
      return `${user.prenom.charAt(0)}${user.nom.charAt(0)}`.toUpperCase();
    }
    return 'U';
  }

  getUserRole(): string {
    const user = this.authService.currentUser();
    return user ? user.role : '';
  }
}
