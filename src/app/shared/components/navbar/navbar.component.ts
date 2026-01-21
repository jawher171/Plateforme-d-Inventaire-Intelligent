import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { StoreSelectorComponent } from '../store-selector/store-selector.component';
import { AnimatedBadgeComponent } from '../animated-badge/animated-badge.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, StoreSelectorComponent, AnimatedBadgeComponent],
  template: `
    <div class="navbar glass">
      <div class="navbar-left">
        <div class="brand">
          <div class="logo-animated">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="40" height="40" rx="8" fill="url(#gradient-logo)"/>
              <path d="M12 15h16M12 20h16M12 25h12" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
              <defs>
                <linearGradient id="gradient-logo" x1="0" y1="0" x2="40" y2="40">
                  <stop offset="0%" stop-color="#3b82f6"/>
                  <stop offset="100%" stop-color="#8b5cf6"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div class="brand-text">
            <h1 class="brand-title gradient-text">Plateforme d'Inventaire Intelligent</h1>
            <p class="brand-subtitle">Gestion multi-magasin en temps réel</p>
          </div>
        </div>
      </div>

      <div class="navbar-center">
        <app-store-selector></app-store-selector>
      </div>

      <div class="navbar-actions">
        <button class="action-btn" title="Notifications">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
          </svg>
          <app-animated-badge 
            variant="danger" 
            size="sm" 
            [pulse]="true"
            [gradient]="true"
            class="notification-badge-component"
          >
            3
          </app-animated-badge>
        </button>

        <button class="action-btn" title="Aide">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"/>
          </svg>
        </button>

        <div class="divider"></div>

        <div class="user-menu">
          <div class="user-avatar gradient-primary">{{ getUserInitials() }}</div>
          <div class="user-details">
            <div class="user-name">{{ getUserName() }}</div>
            <div class="user-role">{{ getUserRole() }}</div>
          </div>
          <button class="dropdown-btn">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4 6l4 4 4-4H4z"/>
            </svg>
          </button>
        </div>

        <button class="logout-btn gradient-danger" (click)="logout()" title="Déconnexion">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
            <path d="M3 3a1 1 0 011-1h8a1 1 0 011 1v4a1 1 0 11-2 0V4H5v10h6v-3a1 1 0 112 0v4a1 1 0 01-1 1H4a1 1 0 01-1-1V3z"/>
            <path d="M13 9a1 1 0 01.707.293l3 3a1 1 0 010 1.414l-3 3A1 1 0 0112 16v-2H9a1 1 0 110-2h3v-2a1 1 0 011-1z"/>
          </svg>
          <span class="logout-text">Déconnexion</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .navbar {
      height: 80px;
      background: var(--glass-bg);
      backdrop-filter: blur(var(--glass-blur));
      -webkit-backdrop-filter: blur(var(--glass-blur));
      box-shadow: var(--shadow-md);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 var(--spacing-2xl);
      position: sticky;
      top: 0;
      z-index: var(--z-index-sticky);
      border-bottom: 1px solid var(--glass-border);
      gap: var(--spacing-xl);
    }

    .navbar-left {
      flex: 0 1 auto;
    }

    .navbar-center {
      flex: 0 1 auto;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
    }

    .logo-animated {
      animation: rotate-glow 8s linear infinite;
      filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.4));
    }

    .brand-text {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .brand-title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      margin: 0;
      line-height: 1.2;
    }

    .brand-subtitle {
      font-size: var(--font-size-xs);
      color: var(--color-text-tertiary);
      margin: 0;
      font-weight: var(--font-weight-medium);
    }

    .navbar-actions {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
    }

    .action-btn {
      position: relative;
      background: none;
      border: none;
      padding: var(--spacing-sm);
      cursor: pointer;
      border-radius: var(--radius-md);
      color: var(--color-text-secondary);
      transition: all var(--transition-base);
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
    }

    .action-btn:hover {
      background: rgba(59, 130, 246, 0.1);
      color: var(--color-primary-600);
      transform: scale(1.05);
    }

    .notification-badge-component {
      position: absolute;
      top: 4px;
      right: 4px;
    }

    .divider {
      width: 1px;
      height: 32px;
      background: var(--color-border-medium);
      margin: 0 var(--spacing-sm);
    }

    .user-menu {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      padding: var(--spacing-sm) var(--spacing-md);
      background: rgba(59, 130, 246, 0.05);
      border-radius: var(--radius-full);
      cursor: pointer;
      transition: all var(--transition-base);
      border: 1px solid transparent;
    }

    .user-menu:hover {
      background: rgba(59, 130, 246, 0.1);
      border-color: rgba(59, 130, 246, 0.2);
      box-shadow: var(--shadow-blue);
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      color: var(--color-text-inverse);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: var(--font-weight-bold);
      font-size: var(--font-size-sm);
      flex-shrink: 0;
      box-shadow: var(--shadow-blue);
    }

    .user-details {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      min-width: 0;
    }

    .user-name {
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-sm);
      color: var(--color-text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 120px;
    }

    .user-role {
      font-size: var(--font-size-xs);
      color: var(--color-text-tertiary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 120px;
    }

    .dropdown-btn {
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
      color: var(--color-text-tertiary);
      display: flex;
      align-items: center;
      transition: transform var(--transition-base);
    }

    .user-menu:hover .dropdown-btn {
      transform: translateY(2px);
    }

    .logout-btn {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      color: var(--color-text-inverse);
      border: none;
      padding: var(--spacing-sm) var(--spacing-lg);
      border-radius: var(--radius-lg);
      cursor: pointer;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      transition: all var(--transition-base);
      box-shadow: var(--shadow-red);
    }

    .logout-btn:hover {
      filter: brightness(1.1);
      transform: translateY(-2px);
      box-shadow: var(--shadow-red-lg);
    }

    .logout-text {
      white-space: nowrap;
    }

    @media (max-width: 1024px) {
      .navbar {
        padding: 0 var(--spacing-md);
        gap: var(--spacing-md);
      }

      .brand-text {
        display: none;
      }

      .navbar-center {
        display: none;
      }

      .user-details {
        display: none;
      }

      .logout-text {
        display: none;
      }

      .logout-btn {
        padding: var(--spacing-sm);
        width: 40px;
        justify-content: center;
      }
    }

    @media (max-width: 768px) {
      .navbar {
        height: 64px;
        padding: 0 var(--spacing-md);
      }

      .divider {
        display: none;
      }
    }
  `]
})
export class NavbarComponent {
  constructor(private authService: AuthService) {}

  getUserName(): string {
    const user = this.authService.currentUser();
    return user ? `${user.prenom} ${user.nom}` : 'Utilisateur';
  }

  getUserInitials(): string {
    const user = this.authService.currentUser();
    if (user) {
      return `${user.prenom.charAt(0)}${user.nom.charAt(0)}`.toUpperCase();
    }
    return 'U';
  }

  getUserRole(): string {
    const user = this.authService.currentUser();
    return user ? user.role : '';
  }

  logout() {
    this.authService.logout();
  }
}
