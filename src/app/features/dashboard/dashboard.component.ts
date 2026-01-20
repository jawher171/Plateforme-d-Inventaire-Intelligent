import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { DashboardKPIs, Alert } from '../../shared/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Tableau de bord</h1>

      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-icon">📦</div>
          <div class="kpi-content">
            <div class="kpi-value">{{ kpis().totalProduits }}</div>
            <div class="kpi-label">Total produits</div>
          </div>
        </div>

        <div class="kpi-card success">
          <div class="kpi-icon">✅</div>
          <div class="kpi-content">
            <div class="kpi-value">{{ kpis().produitsEnStock }}</div>
            <div class="kpi-label">En stock</div>
          </div>
        </div>

        <div class="kpi-card danger">
          <div class="kpi-icon">❌</div>
          <div class="kpi-content">
            <div class="kpi-value">{{ kpis().produitsEnRupture }}</div>
            <div class="kpi-label">Rupture</div>
          </div>
        </div>

        <div class="kpi-card warning">
          <div class="kpi-icon">⚠️</div>
          <div class="kpi-content">
            <div class="kpi-value">{{ kpis().produitsSeuilCritique }}</div>
            <div class="kpi-label">Seuil critique</div>
          </div>
        </div>

        <div class="kpi-card primary">
          <div class="kpi-icon">💰</div>
          <div class="kpi-content">
            <div class="kpi-value">{{ kpis().valeurTotaleStock | number:'1.0-0' }} €</div>
            <div class="kpi-label">Valeur stock</div>
          </div>
        </div>

        <div class="kpi-card info">
          <div class="kpi-icon">🔄</div>
          <div class="kpi-content">
            <div class="kpi-value">{{ kpis().mouvementsAujourdhui }}</div>
            <div class="kpi-label">Mouvements aujourd'hui</div>
          </div>
        </div>
      </div>

      <div class="alerts-section">
        <h2>Alertes récentes</h2>
        <div class="alerts-list">
          <div *ngFor="let alert of recentAlerts()" class="alert-card" [ngClass]="getAlertClass(alert)">
            <div class="alert-header">
              <span class="severity-icon">{{ getSeverityIcon(alert.severite) }}</span>
              <span class="alert-type badge badge-secondary">{{ alert.type }}</span>
              <span class="alert-date">{{ alert.dateCreation | date:'short' }}</span>
            </div>
            <div class="alert-body">
              <div class="alert-product">{{ alert.produit?.nom }}</div>
              <div class="alert-message">{{ alert.message }}</div>
            </div>
          </div>

          <div *ngIf="recentAlerts().length === 0" class="no-alerts">
            <span class="icon">✓</span>
            <p>Aucune alerte active</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 30px;
    }

    h1 {
      margin-bottom: 30px;
      color: #333;
      font-size: 32px;
      font-weight: 600;
    }

    h2 {
      margin-bottom: 20px;
      color: #333;
      font-size: 24px;
      font-weight: 600;
    }

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }

    .kpi-card {
      background: white;
      border-radius: 15px;
      padding: 25px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 15px;
      border-left: 4px solid #9e9e9e;
      transition: transform 0.3s ease;
    }

    .kpi-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    }

    .kpi-card.success {
      border-left-color: #4CAF50;
    }

    .kpi-card.danger {
      border-left-color: #e74c3c;
    }

    .kpi-card.warning {
      border-left-color: #f39c12;
    }

    .kpi-card.primary {
      border-left-color: #2196F3;
    }

    .kpi-card.info {
      border-left-color: #00bcd4;
    }

    .kpi-icon {
      font-size: 40px;
    }

    .kpi-content {
      flex: 1;
    }

    .kpi-value {
      font-size: 28px;
      font-weight: 700;
      color: #333;
      line-height: 1;
      margin-bottom: 5px;
    }

    .kpi-label {
      font-size: 13px;
      color: #999;
      font-weight: 500;
    }

    .alerts-section {
      margin-top: 40px;
    }

    .alerts-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .alert-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      border-left: 4px solid #9e9e9e;
    }

    .alert-card.critical {
      border-left-color: #e74c3c;
      background-color: #fff5f5;
    }

    .alert-card.high {
      border-left-color: #f39c12;
      background-color: #fffbf5;
    }

    .alert-card.medium {
      border-left-color: #f1c40f;
      background-color: #fffef5;
    }

    .alert-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 10px;
    }

    .severity-icon {
      font-size: 20px;
    }

    .alert-type {
      margin-left: auto;
    }

    .alert-date {
      font-size: 12px;
      color: #999;
    }

    .alert-body {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .alert-product {
      font-weight: 600;
      color: #333;
    }

    .alert-message {
      color: #666;
      font-size: 14px;
    }

    .no-alerts {
      text-align: center;
      padding: 60px 20px;
      color: #999;
    }

    .no-alerts .icon {
      font-size: 64px;
      display: block;
      margin-bottom: 15px;
      color: #4CAF50;
    }

    .no-alerts p {
      font-size: 18px;
      margin: 0;
    }

    @media (max-width: 768px) {
      .container {
        padding: 15px;
      }

      h1 {
        font-size: 24px;
      }

      .kpi-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  kpis = signal<DashboardKPIs>({
    totalProduits: 0,
    produitsEnStock: 0,
    produitsEnRupture: 0,
    produitsSeuilCritique: 0,
    valeurTotaleStock: 0,
    mouvementsAujourdhui: 0,
    alertesActives: 0
  });

  recentAlerts = signal<Alert[]>([]);

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadKPIs();
    this.loadRecentAlerts();
  }

  loadKPIs() {
    this.apiService.get<DashboardKPIs>('api/dashboard/kpis').subscribe({
      next: (data) => this.kpis.set(data),
      error: (err) => console.error('Error loading KPIs', err)
    });
  }

  loadRecentAlerts() {
    this.apiService.get<Alert[]>('api/alerts', { limit: 5 }).subscribe({
      next: (data) => this.recentAlerts.set(data),
      error: (err) => console.error('Error loading alerts', err)
    });
  }

  getSeverityIcon(severite: string): string {
    const icons: { [key: string]: string } = {
      'Critique': '🔴',
      'Haute': '🟠',
      'Moyenne': '🟡',
      'Basse': '🟢'
    };
    return icons[severite] || '⚪';
  }

  getAlertClass(alert: Alert): string {
    const classes: { [key: string]: string } = {
      'Critique': 'critical',
      'Haute': 'high',
      'Moyenne': 'medium'
    };
    return classes[alert.severite] || '';
  }
}
