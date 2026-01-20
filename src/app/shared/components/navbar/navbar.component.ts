import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="navbar">
      <div class="search-bar">
        <span class="search-icon">🔍</span>
        <input type="text" placeholder="Rechercher un produit...">
      </div>

      <div class="navbar-actions">
        <button class="notification-btn">
          <span class="icon">🔔</span>
          <span class="notification-badge">3</span>
        </button>

        <div class="user-info">
          <div class="user-avatar">{{ getUserInitials() }}</div>
          <div class="user-details">
            <div class="user-name">{{ getUserName() }}</div>
            <div class="user-role">{{ getUserRole() }}</div>
          </div>
        </div>

        <button class="logout-btn" (click)="logout()">
          <span class="icon">🚪</span>
          Déconnexion
        </button>
      </div>
    </div>
  `,
  styles: [`
    .navbar {
      height: 70px;
      background: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 30px;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .search-bar {
      display: flex;
      align-items: center;
      background-color: #f5f5f5;
      border-radius: 25px;
      padding: 10px 20px;
      width: 400px;
      max-width: 100%;
    }

    .search-icon {
      margin-right: 10px;
      font-size: 18px;
    }

    .search-bar input {
      border: none;
      background: none;
      outline: none;
      flex: 1;
      font-size: 14px;
    }

    .navbar-actions {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .notification-btn {
      position: relative;
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      border-radius: 50%;
      transition: background-color 0.3s;
    }

    .notification-btn:hover {
      background-color: #f5f5f5;
    }

    .notification-btn .icon {
      font-size: 24px;
    }

    .notification-badge {
      position: absolute;
      top: 2px;
      right: 2px;
      background-color: #e74c3c;
      color: white;
      font-size: 10px;
      padding: 2px 5px;
      border-radius: 10px;
      font-weight: 600;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 16px;
      background-color: #f8f9fa;
      border-radius: 25px;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 14px;
    }

    .user-details {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-weight: 600;
      font-size: 14px;
      color: #333;
    }

    .user-role {
      font-size: 12px;
      color: #999;
    }

    .logout-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      background-color: #e74c3c;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .logout-btn:hover {
      background-color: #c0392b;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
    }

    .logout-btn .icon {
      font-size: 18px;
    }

    @media (max-width: 768px) {
      .navbar {
        padding: 0 15px;
      }

      .search-bar {
        width: 200px;
      }

      .user-details {
        display: none;
      }

      .logout-btn span:not(.icon) {
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
