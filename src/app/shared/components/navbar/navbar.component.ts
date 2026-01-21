import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="navbar">
      <div class="navbar-left">
        <div class="search-bar">
          <svg class="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"/>
          </svg>
          <input type="text" placeholder="Rechercher un produit, code-barres...">
          <kbd class="shortcut">Ctrl+K</kbd>
        </div>
      </div>

      <div class="navbar-actions">
        <button class="action-btn" title="Notifications">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
          </svg>
          <span class="notification-badge">3</span>
        </button>

        <button class="action-btn" title="Aide">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"/>
          </svg>
        </button>

        <div class="divider"></div>

        <div class="user-menu">
          <div class="user-avatar">{{ getUserInitials() }}</div>
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

        <button class="logout-btn" (click)="logout()" title="Déconnexion">
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
      height: 72px;
      background: var(--color-bg-primary);
      box-shadow: var(--shadow-sm);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 var(--spacing-xl);
      position: sticky;
      top: 0;
      z-index: var(--z-index-sticky);
      border-bottom: 1px solid var(--color-border-light);
    }

    .navbar-left {
      flex: 1;
      max-width: 600px;
    }

    .search-bar {
      display: flex;
      align-items: center;
      background: var(--color-bg-secondary);
      border: 2px solid var(--color-border-light);
      border-radius: var(--radius-full);
      padding: var(--spacing-sm) var(--spacing-lg);
      gap: var(--spacing-md);
      transition: all var(--transition-base);
      width: 100%;
    }

    .search-bar:focus-within {
      border-color: var(--color-primary-500);
      box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
      background: var(--color-bg-primary);
    }

    .search-icon {
      color: var(--color-text-tertiary);
      flex-shrink: 0;
      transition: color var(--transition-base);
    }

    .search-bar:focus-within .search-icon {
      color: var(--color-primary-500);
    }

    .search-bar input {
      border: none;
      background: none;
      outline: none;
      flex: 1;
      font-size: var(--font-size-sm);
      color: var(--color-text-primary);
      font-family: var(--font-family-primary);
      min-width: 0;
    }

    .search-bar input::placeholder {
      color: var(--color-text-tertiary);
    }

    .shortcut {
      display: none;
      padding: var(--spacing-xs) var(--spacing-sm);
      background: var(--color-gray-100);
      border: 1px solid var(--color-border-light);
      border-radius: var(--radius-sm);
      font-size: var(--font-size-xs);
      color: var(--color-text-tertiary);
      font-family: var(--font-family-mono);
      flex-shrink: 0;
    }

    @media (min-width: 1024px) {
      .shortcut {
        display: block;
      }
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
      background: var(--color-gray-100);
      color: var(--color-text-primary);
      transform: scale(1.05);
    }

    .notification-badge {
      position: absolute;
      top: 6px;
      right: 6px;
      background: linear-gradient(135deg, var(--color-danger-500), var(--color-danger-600));
      color: var(--color-text-inverse);
      font-size: 10px;
      padding: 2px 5px;
      border-radius: var(--radius-full);
      font-weight: var(--font-weight-bold);
      min-width: 18px;
      text-align: center;
      box-shadow: var(--shadow-sm);
      animation: pulse-badge 2s ease-in-out infinite;
    }

    @keyframes pulse-badge {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.1);
      }
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
      background: var(--color-bg-secondary);
      border-radius: var(--radius-full);
      cursor: pointer;
      transition: all var(--transition-base);
      border: 1px solid transparent;
    }

    .user-menu:hover {
      background: var(--color-gray-100);
      border-color: var(--color-border-medium);
    }

    .user-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600));
      color: var(--color-text-inverse);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: var(--font-weight-bold);
      font-size: var(--font-size-sm);
      flex-shrink: 0;
      box-shadow: var(--shadow-sm);
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
      background: linear-gradient(135deg, var(--color-danger-500), var(--color-danger-600));
      color: var(--color-text-inverse);
      border: none;
      padding: var(--spacing-sm) var(--spacing-lg);
      border-radius: var(--radius-lg);
      cursor: pointer;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      transition: all var(--transition-base);
      box-shadow: var(--shadow-sm);
    }

    .logout-btn:hover {
      background: linear-gradient(135deg, var(--color-danger-600), var(--color-danger-700));
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .logout-text {
      white-space: nowrap;
    }

    @media (max-width: 1024px) {
      .navbar {
        padding: 0 var(--spacing-md);
      }

      .search-bar {
        max-width: 300px;
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

      .search-bar {
        max-width: 200px;
      }

      .search-bar input::placeholder {
        content: "Rechercher...";
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
