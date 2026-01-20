import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LoginRequest } from '../../shared/models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <div class="logo">📦</div>
          <h1>Plateforme d'Inventaire</h1>
          <p>Connectez-vous pour continuer</p>
        </div>

        <form (ngSubmit)="login()" class="login-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              [(ngModel)]="credentials.email"
              name="email"
              placeholder="votre@email.com"
              required
            >
          </div>

          <div class="form-group">
            <label for="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              [(ngModel)]="credentials.password"
              name="password"
              placeholder="••••••••"
              required
            >
          </div>

          <div class="error-message" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

          <button type="submit" class="btn-login" [disabled]="loading">
            <span *ngIf="!loading">Se connecter</span>
            <span *ngIf="loading">Connexion...</span>
          </button>

          <div class="demo-credentials">
            <p>📧 Demo: admin&#64;inventaire.tn</p>
            <p>🔑 Password: admin123</p>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .login-card {
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      padding: 50px 40px;
      width: 100%;
      max-width: 450px;
    }

    .login-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .logo {
      font-size: 64px;
      margin-bottom: 20px;
    }

    .login-header h1 {
      font-size: 28px;
      color: #333;
      margin-bottom: 10px;
      font-weight: 600;
    }

    .login-header p {
      color: #999;
      font-size: 14px;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-group label {
      font-weight: 500;
      color: #555;
      font-size: 14px;
    }

    .form-group input {
      padding: 14px 16px;
      border: 2px solid #e0e0e0;
      border-radius: 10px;
      font-size: 15px;
      transition: all 0.3s ease;
    }

    .form-group input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .error-message {
      background-color: #fee;
      color: #c33;
      padding: 12px;
      border-radius: 8px;
      font-size: 14px;
      text-align: center;
    }

    .btn-login {
      padding: 16px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-top: 10px;
    }

    .btn-login:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
    }

    .btn-login:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .demo-credentials {
      margin-top: 20px;
      padding: 15px;
      background-color: #f0f7ff;
      border-radius: 8px;
      border-left: 4px solid #2196F3;
      text-align: left;
    }

    .demo-credentials p {
      margin: 5px 0;
      font-size: 13px;
      color: #555;
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .login-card {
        padding: 40px 30px;
      }

      .login-header h1 {
        font-size: 24px;
      }
    }
  `]
})
export class LoginComponent {
  credentials: LoginRequest = {
    email: '',
    password: ''
  };
  errorMessage = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
    this.errorMessage = '';
    this.loading = true;

    // Call the updated mock login method
    this.authService.login(this.credentials.email, this.credentials.password);
    this.loading = false;
  }
}
