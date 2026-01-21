import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService } from '../../core/services/mock-data.service';
import { DashboardKPIs, Alert } from '../../shared/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="page-header">
        <div>
          <h1>Tableau de bord</h1>
          <p class="subtitle">Vue d'ensemble de votre inventaire</p>
        </div>
        <button class="btn btn-primary">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 2a6 6 0 100 12A6 6 0 008 2zm1 8.5H7v-5h2v5z"/>
          </svg>
          Rafraîchir
        </button>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card total">
          <div class="kpi-header">
            <div class="kpi-icon-wrapper primary">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 6h16l2 4v10H2V10l2-4zm0 2l-1 2h18l-1-2H4zm-2 4v8h20v-8H2z"/>
              </svg>
            </div>
            <div class="trend positive">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 2l6 6H9v6H7V8H2l6-6z"/>
              </svg>
              +12%
            </div>
          </div>
          <div class="kpi-content">
            <div class="kpi-value">{{ kpis().totalProduits }}</div>
            <div class="kpi-label">Total produits</div>
          </div>
        </div>

        <div class="kpi-card success">
          <div class="kpi-header">
            <div class="kpi-icon-wrapper success">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <div class="trend positive">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 2l6 6H9v6H7V8H2l6-6z"/>
              </svg>
              +8%
            </div>
          </div>
          <div class="kpi-content">
            <div class="kpi-value">{{ kpis().produitsEnStock }}</div>
            <div class="kpi-label">En stock</div>
          </div>
        </div>

        <div class="kpi-card danger">
          <div class="kpi-header">
            <div class="kpi-icon-wrapper danger">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
            </div>
            <div class="trend negative">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 14l-6-6h5V2h2v6h5l-6 6z"/>
              </svg>
              -5%
            </div>
          </div>
          <div class="kpi-content">
            <div class="kpi-value">{{ kpis().produitsEnRupture }}</div>
            <div class="kpi-label">Rupture de stock</div>
          </div>
        </div>

        <div class="kpi-card warning">
          <div class="kpi-header">
            <div class="kpi-icon-wrapper warning">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
              </svg>
            </div>
          </div>
          <div class="kpi-content">
            <div class="kpi-value">{{ kpis().produitsSeuilCritique }}</div>
            <div class="kpi-label">Seuil critique</div>
          </div>
        </div>

        <div class="kpi-card primary">
          <div class="kpi-header">
            <div class="kpi-icon-wrapper primary">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
              </svg>
            </div>
            <div class="trend positive">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 2l6 6H9v6H7V8H2l6-6z"/>
              </svg>
              +15%
            </div>
          </div>
          <div class="kpi-content">
            <div class="kpi-value">{{ (kpis().valeurTotaleStock / 1000).toFixed(1) }}K €</div>
            <div class="kpi-label">Valeur du stock</div>
          </div>
        </div>

        <div class="kpi-card info">
          <div class="kpi-header">
            <div class="kpi-icon-wrapper info">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
          </div>
          <div class="kpi-content">
            <div class="kpi-value">{{ kpis().mouvementsAujourdhui }}</div>
            <div class="kpi-label">Mouvements aujourd'hui</div>
          </div>
        </div>
      </div>

      <div class="alerts-section">
        <div class="section-header">
          <h2>Alertes récentes</h2>
          <a href="/alerts" class="view-all">Voir tout →</a>
        </div>
        
        <div class="alerts-grid">
          <div *ngFor="let alert of recentAlerts()" class="alert-card" [ngClass]="getAlertClass(alert)">
            <div class="alert-icon">
              {{ getSeverityIcon(alert.severite) }}
            </div>
            <div class="alert-content">
              <div class="alert-header">
                <span class="alert-product">{{ alert.produit?.nom }}</span>
                <span class="alert-badge">{{ alert.type }}</span>
              </div>
              <p class="alert-message">{{ alert.message }}</p>
              <span class="alert-date">{{ alert.dateCreation | date:'short' }}</span>
            </div>
          </div>

          <div *ngIf="recentAlerts().length === 0" class="no-alerts">
            <div class="no-alerts-icon">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="currentColor">
                <path d="M32 8C18.75 8 8 18.75 8 32s10.75 24 24 24 24-10.75 24-24S45.25 8 32 8zm-4 36l-12-12 3.4-3.4L28 37.2l16.6-16.6L48 24 28 44z"/>
              </svg>
            </div>
            <p>Aucune alerte active</p>
            <span>Tout est en ordre</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: var(--spacing-xl);
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--spacing-2xl);
      padding-bottom: 0;
      border-bottom: none;
    }

    .page-header h1 {
      margin: 0 0 var(--spacing-sm) 0;
      font-size: var(--font-size-4xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-primary);
      background: linear-gradient(135deg, var(--color-primary-600), var(--color-primary-700));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .subtitle {
      font-size: var(--font-size-base);
      color: var(--color-text-secondary);
      margin: 0;
    }

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: var(--spacing-lg);
      margin-bottom: var(--spacing-3xl);
    }

    .kpi-card {
      background: var(--color-bg-primary);
      border-radius: var(--radius-2xl);
      padding: var(--spacing-xl);
      box-shadow: var(--shadow-md);
      border: 1px solid var(--color-border-light);
      transition: all var(--transition-base);
      position: relative;
      overflow: hidden;
    }

    .kpi-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background: linear-gradient(90deg, var(--color-gray-300), var(--color-gray-200));
    }

    .kpi-card.total::before {
      background: linear-gradient(90deg, var(--color-primary-500), var(--color-primary-600));
    }

    .kpi-card.success::before {
      background: linear-gradient(90deg, var(--color-success-500), var(--color-success-600));
    }

    .kpi-card.danger::before {
      background: linear-gradient(90deg, var(--color-danger-500), var(--color-danger-600));
    }

    .kpi-card.warning::before {
      background: linear-gradient(90deg, var(--color-warning-500), var(--color-warning-600));
    }

    .kpi-card.primary::before {
      background: linear-gradient(90deg, var(--color-primary-500), var(--color-primary-700));
    }

    .kpi-card.info::before {
      background: linear-gradient(90deg, var(--color-info-500), var(--color-info-600));
    }

    .kpi-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-xl);
      border-color: var(--color-border-medium);
    }

    .kpi-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--spacing-lg);
    }

    .kpi-icon-wrapper {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform var(--transition-base);
    }

    .kpi-card:hover .kpi-icon-wrapper {
      transform: scale(1.1) rotate(5deg);
    }

    .kpi-icon-wrapper.primary {
      background: linear-gradient(135deg, var(--color-primary-100), var(--color-primary-200));
      color: var(--color-primary-600);
    }

    .kpi-icon-wrapper.success {
      background: linear-gradient(135deg, var(--color-success-100), var(--color-success-200));
      color: var(--color-success-600);
    }

    .kpi-icon-wrapper.danger {
      background: linear-gradient(135deg, var(--color-danger-100), var(--color-danger-200));
      color: var(--color-danger-600);
    }

    .kpi-icon-wrapper.warning {
      background: linear-gradient(135deg, var(--color-warning-100), var(--color-warning-200));
      color: var(--color-warning-600);
    }

    .kpi-icon-wrapper.info {
      background: linear-gradient(135deg, var(--color-info-100), var(--color-info-200));
      color: var(--color-info-600);
    }

    .trend {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      padding: var(--spacing-xs) var(--spacing-sm);
      border-radius: var(--radius-full);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
    }

    .trend.positive {
      background: var(--color-success-50);
      color: var(--color-success-700);
    }

    .trend.negative {
      background: var(--color-danger-50);
      color: var(--color-danger-700);
    }

    .kpi-content {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
    }

    .kpi-value {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-primary);
      line-height: 1;
    }

    .kpi-label {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
      font-weight: var(--font-weight-medium);
    }

    .alerts-section {
      margin-top: var(--spacing-3xl);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-xl);
    }

    .section-header h2 {
      margin: 0;
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-primary);
    }

    .view-all {
      color: var(--color-primary-600);
      text-decoration: none;
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-sm);
      transition: all var(--transition-base);
    }

    .view-all:hover {
      color: var(--color-primary-700);
      transform: translateX(4px);
    }

    .alerts-grid {
      display: grid;
      gap: var(--spacing-md);
    }

    .alert-card {
      background: var(--color-bg-primary);
      border-radius: var(--radius-xl);
      padding: var(--spacing-lg);
      box-shadow: var(--shadow-sm);
      border-left: 4px solid var(--color-gray-300);
      display: flex;
      gap: var(--spacing-md);
      transition: all var(--transition-base);
    }

    .alert-card:hover {
      box-shadow: var(--shadow-md);
      transform: translateX(4px);
    }

    .alert-card.critical {
      border-left-color: var(--color-danger-500);
      background: linear-gradient(90deg, var(--color-danger-50) 0%, var(--color-bg-primary) 15%);
    }

    .alert-card.high {
      border-left-color: var(--color-warning-500);
      background: linear-gradient(90deg, var(--color-warning-50) 0%, var(--color-bg-primary) 15%);
    }

    .alert-card.medium {
      border-left-color: var(--color-info-500);
      background: linear-gradient(90deg, var(--color-info-50) 0%, var(--color-bg-primary) 15%);
    }

    .alert-icon {
      font-size: var(--font-size-2xl);
      flex-shrink: 0;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-lg);
      background: var(--color-gray-100);
    }

    .alert-content {
      flex: 1;
      min-width: 0;
    }

    .alert-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-sm);
    }

    .alert-product {
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
      font-size: var(--font-size-base);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .alert-badge {
      padding: var(--spacing-xs) var(--spacing-sm);
      background: var(--color-gray-100);
      color: var(--color-text-secondary);
      border-radius: var(--radius-full);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      white-space: nowrap;
    }

    .alert-message {
      color: var(--color-text-secondary);
      font-size: var(--font-size-sm);
      margin: 0 0 var(--spacing-xs) 0;
      line-height: var(--line-height-relaxed);
    }

    .alert-date {
      font-size: var(--font-size-xs);
      color: var(--color-text-tertiary);
    }

    .no-alerts {
      text-align: center;
      padding: var(--spacing-4xl) var(--spacing-lg);
      background: var(--color-bg-primary);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-sm);
    }

    .no-alerts-icon {
      color: var(--color-success-500);
      margin-bottom: var(--spacing-lg);
      display: flex;
      justify-content: center;
    }

    .no-alerts p {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
      margin: 0 0 var(--spacing-sm) 0;
    }

    .no-alerts span {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
    }

    @media (max-width: 768px) {
      .container {
        padding: var(--spacing-md);
      }

      .page-header {
        flex-direction: column;
        gap: var(--spacing-md);
      }

      .page-header h1 {
        font-size: var(--font-size-3xl);
      }

      .kpi-grid {
        grid-template-columns: 1fr;
      }

      .alert-content {
        overflow: hidden;
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

  constructor(private mockDataService: MockDataService) {}

  ngOnInit() {
    this.loadKPIs();
    this.loadRecentAlerts();
  }

  loadKPIs() {
    const kpisData = this.mockDataService.getDashboardKPIs();
    this.kpis.set(kpisData);
  }

  loadRecentAlerts() {
    const alertsData = this.mockDataService.getAlerts().slice(0, 5);
    this.recentAlerts.set(alertsData);
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
