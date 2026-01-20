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
      <div class="login-background">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
      </div>

      <div class="login-card">
        <div class="login-header">
          <div class="logo-wrapper">
            <div class="logo">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="4" width="40" height="40" rx="8" fill="url(#gradient)"/>
                <path d="M14 18h20M14 24h20M14 30h14" stroke="white" stroke-width="3" stroke-linecap="round"/>
                <defs>
                  <linearGradient id="gradient" x1="4" y1="4" x2="44" y2="44">
                    <stop offset="0%" stop-color="#2196F3"/>
                    <stop offset="100%" stop-color="#1976D2"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
          <h1>Bienvenue</h1>
          <p>Connectez-vous à votre espace inventaire</p>
        </div>

        <form (ngSubmit)="login()" class="login-form">
          <div class="form-group">
            <label for="email">
              <span class="label-icon">📧</span>
              Adresse email
            </label>
            <input
              type="email"
              id="email"
              [(ngModel)]="credentials.email"
              name="email"
              placeholder="exemple@entreprise.com"
              required
              autocomplete="email"
            >
          </div>

          <div class="form-group">
            <label for="password">
              <span class="label-icon">🔒</span>
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              [(ngModel)]="credentials.password"
              name="password"
              placeholder="Entrez votre mot de passe"
              required
              autocomplete="current-password"
            >
          </div>

          <div class="error-message" *ngIf="errorMessage">
            <span class="error-icon">⚠️</span>
            {{ errorMessage }}
          </div>

          <button type="submit" class="btn-login" [disabled]="loading">
            <span *ngIf="!loading">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z"/>
              </svg>
              Se connecter
            </span>
            <span *ngIf="loading" class="loading-spinner">
              <span class="spinner"></span>
              Connexion en cours...
            </span>
          </button>

          <div class="demo-section">
            <div class="demo-header">
              <span class="demo-badge">MODE DÉMO</span>
            </div>
            <div class="demo-credentials">
              <div class="credential-item">
                <span class="credential-icon">👤</span>
                <div class="credential-info">
                  <span class="credential-label">Email</span>
                  <span class="credential-value">admin&#64;inventaire.tn</span>
                </div>
              </div>
              <div class="credential-item">
                <span class="credential-icon">🔑</span>
                <div class="credential-info">
                  <span class="credential-label">Mot de passe</span>
                  <span class="credential-value">admin123</span>
                </div>
              </div>
            </div>
          </div>
        </form>

        <div class="login-footer">
          <p>Plateforme d'Inventaire Intelligent © 2024</p>
        </div>
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
      padding: var(--spacing-lg);
      position: relative;
      overflow: hidden;
    }

    .login-background {
      position: absolute;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    .shape {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.3;
      animation: float 20s ease-in-out infinite;
    }

    .shape-1 {
      width: 400px;
      height: 400px;
      background: linear-gradient(45deg, #2196F3, #00bcd4);
      top: -10%;
      left: -5%;
      animation-delay: 0s;
    }

    .shape-2 {
      width: 500px;
      height: 500px;
      background: linear-gradient(45deg, #9c27b0, #e91e63);
      bottom: -15%;
      right: -10%;
      animation-delay: -7s;
    }

    .shape-3 {
      width: 300px;
      height: 300px;
      background: linear-gradient(45deg, #ff9800, #ff5722);
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      animation-delay: -14s;
    }

    @keyframes float {
      0%, 100% {
        transform: translate(0, 0) scale(1);
      }
      33% {
        transform: translate(30px, -30px) scale(1.1);
      }
      66% {
        transform: translate(-20px, 20px) scale(0.9);
      }
    }

    .login-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: var(--radius-2xl);
      box-shadow: var(--shadow-2xl);
      padding: var(--spacing-3xl);
      width: 100%;
      max-width: 480px;
      position: relative;
      z-index: 1;
      animation: slideUp var(--transition-slow);
    }

    .login-header {
      text-align: center;
      margin-bottom: var(--spacing-2xl);
    }

    .logo-wrapper {
      display: flex;
      justify-content: center;
      margin-bottom: var(--spacing-lg);
    }

    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      animation: logoFloat 3s ease-in-out infinite;
    }

    @keyframes logoFloat {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-10px);
      }
    }

    .login-header h1 {
      font-size: var(--font-size-3xl);
      color: var(--color-text-primary);
      margin-bottom: var(--spacing-sm);
      font-weight: var(--font-weight-bold);
    }

    .login-header p {
      color: var(--color-text-secondary);
      font-size: var(--font-size-base);
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-lg);
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .form-group label {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
      font-size: var(--font-size-sm);
    }

    .label-icon {
      font-size: var(--font-size-lg);
    }

    .form-group input {
      padding: var(--spacing-lg) var(--spacing-lg);
      border: 2px solid var(--color-border-light);
      border-radius: var(--radius-lg);
      font-size: var(--font-size-base);
      transition: all var(--transition-base);
      background: var(--color-bg-primary);
    }

    .form-group input:focus {
      outline: none;
      border-color: var(--color-primary-500);
      box-shadow: 0 0 0 4px rgba(33, 150, 243, 0.1);
      transform: translateY(-2px);
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      background: linear-gradient(135deg, #fee, #fdd);
      color: var(--color-danger-700);
      padding: var(--spacing-md) var(--spacing-lg);
      border-radius: var(--radius-lg);
      font-size: var(--font-size-sm);
      border-left: 4px solid var(--color-danger-500);
      animation: shake 0.5s ease-in-out;
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-10px); }
      75% { transform: translateX(10px); }
    }

    .error-icon {
      font-size: var(--font-size-lg);
    }

    .btn-login {
      padding: var(--spacing-lg) var(--spacing-xl);
      background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600));
      color: var(--color-text-inverse);
      border: none;
      border-radius: var(--radius-lg);
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      cursor: pointer;
      transition: all var(--transition-base);
      margin-top: var(--spacing-md);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-sm);
      box-shadow: var(--shadow-md);
    }

    .btn-login:hover:not(:disabled) {
      transform: translateY(-3px);
      box-shadow: 0 12px 30px rgba(33, 150, 243, 0.4);
      background: linear-gradient(135deg, var(--color-primary-600), var(--color-primary-700));
    }

    .btn-login:active:not(:disabled) {
      transform: translateY(-1px);
    }

    .btn-login:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
    }

    .loading-spinner {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
    }

    .spinner {
      width: 20px;
      height: 20px;
      border: 3px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    .demo-section {
      margin-top: var(--spacing-xl);
      padding-top: var(--spacing-xl);
      border-top: 2px solid var(--color-border-light);
    }

    .demo-header {
      text-align: center;
      margin-bottom: var(--spacing-md);
    }

    .demo-badge {
      display: inline-block;
      padding: var(--spacing-xs) var(--spacing-md);
      background: linear-gradient(135deg, var(--color-info-500), var(--color-info-600));
      color: white;
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      text-transform: uppercase;
      letter-spacing: 1px;
      border-radius: var(--radius-full);
      box-shadow: var(--shadow-sm);
    }

    .demo-credentials {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }

    .credential-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      padding: var(--spacing-md) var(--spacing-lg);
      background: var(--color-gray-50);
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border-light);
      transition: all var(--transition-base);
    }

    .credential-item:hover {
      background: var(--color-gray-100);
      transform: translateX(4px);
    }

    .credential-icon {
      font-size: var(--font-size-2xl);
    }

    .credential-info {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
    }

    .credential-label {
      font-size: var(--font-size-xs);
      color: var(--color-text-tertiary);
      font-weight: var(--font-weight-medium);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .credential-value {
      font-size: var(--font-size-sm);
      color: var(--color-text-primary);
      font-weight: var(--font-weight-semibold);
      font-family: var(--font-family-mono);
    }

    .login-footer {
      margin-top: var(--spacing-xl);
      padding-top: var(--spacing-lg);
      border-top: 2px solid var(--color-border-light);
      text-align: center;

      p {
        font-size: var(--font-size-xs);
        color: var(--color-text-tertiary);
        margin: 0;
      }
    }

    @media (max-width: 768px) {
      .login-card {
        padding: var(--spacing-xl);
      }

      .login-header h1 {
        font-size: var(--font-size-2xl);
      }

      .shape {
        filter: blur(60px);
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
