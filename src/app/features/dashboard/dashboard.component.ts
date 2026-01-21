import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService } from '../../core/services/mock-data.service';
import { DashboardKPIs, Alert, StockMovement } from '../../shared/models';
import { AnimatedBadgeComponent } from '../../shared/components/animated-badge/animated-badge.component';
import { slideUp, fadeIn } from '../../shared/animations/animations';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, AnimatedBadgeComponent],
  animations: [slideUp, fadeIn],
  template: `
    <div class="container" @fadeIn>
      <div class="page-header">
        <div>
          <h1 class="gradient-text">Tableau de bord</h1>
          <p class="subtitle">Vue d'ensemble de votre inventaire</p>
        </div>
        <button class="btn btn-gradient" (click)="refreshDashboard()">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 8A6 6 0 1 1 2 8a6 6 0 0 1 12 0z"/>
            <path d="M8 4v4l2 2"/>
          </svg>
          Rafraîchir
        </button>
      </div>

      <div class="kpi-grid">
        <!-- Total Articles - Blue Gradient -->
        <div class="kpi-card glass hover-lift shadow-blue" @slideUp>
          <div class="kpi-header">
            <div class="kpi-icon-wrapper gradient-blue">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
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
            <div class="kpi-label">Total Articles</div>
          </div>
        </div>

        <!-- Valeur Totale - Green Gradient -->
        <div class="kpi-card glass hover-lift shadow-green" @slideUp>
          <div class="kpi-header">
            <div class="kpi-icon-wrapper gradient-green">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
            <div class="trend positive">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 2l6 6H9v6H7V8H2l6-6z"/>
              </svg>
              +8.5%
            </div>
          </div>
          <div class="kpi-content">
            <div class="kpi-value">{{ formatCurrency(kpis().valeurTotaleStock) }}</div>
            <div class="kpi-label">Valeur Totale</div>
          </div>
        </div>

        <!-- Alertes Actives - Orange-Red Gradient -->
        <div class="kpi-card glass hover-lift shadow-red" @slideUp>
          <div class="kpi-header">
            <div class="kpi-icon-wrapper gradient-red">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <app-animated-badge variant="danger" size="sm" [pulse]="kpis().alertesActives > 0">
              {{ kpis().alertesActives }}
            </app-animated-badge>
          </div>
          <div class="kpi-content">
            <div class="kpi-value">{{ kpis().alertesActives }}</div>
            <div class="kpi-label">Alertes Actives</div>
          </div>
        </div>

        <!-- Mouvements 7j - Purple Gradient -->
        <div class="kpi-card glass hover-lift shadow-purple" @slideUp>
          <div class="kpi-header">
            <div class="kpi-icon-wrapper gradient-purple">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                <polyline points="17 6 23 6 23 12"/>
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
            <div class="kpi-value">{{ movements7days() }}</div>
            <div class="kpi-label">Mouvements 7j</div>
          </div>
        </div>
      </div>

      <div class="alerts-section">
        <div class="section-header">
          <h2>Alertes récentes</h2>
          <a href="/alerts" class="view-all">Voir tout →</a>
        </div>
        
        <div class="alerts-grid">
          <div *ngFor="let alert of recentAlerts()" class="alert-card" [ngClass]="getAlertClass(alert)" @slideUp>
            <div class="alert-icon">
              {{ getSeverityIcon(alert.severite) }}
            </div>
            <div class="alert-content">
              <div class="alert-header">
                <span class="alert-product">{{ alert.produit?.nom }}</span>
                <app-animated-badge 
                  [variant]="getAlertBadgeVariant(alert.severite)" 
                  size="sm">
                  {{ alert.type }}
                </app-animated-badge>
              </div>
              <p class="alert-message">{{ alert.message }}</p>
              <span class="alert-date">{{ alert.dateCreation | date:'short' }}</span>
            </div>
          </div>

          <div *ngIf="recentAlerts().length === 0" class="no-alerts" @fadeIn>
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

    .gradient-text {
      margin: 0 0 var(--spacing-sm) 0;
      font-size: var(--font-size-4xl);
      font-weight: var(--font-weight-bold);
      background: linear-gradient(135deg, var(--color-primary-600), var(--color-primary-700));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-fill-color: transparent;
    }

    .subtitle {
      font-size: var(--font-size-lg);
      color: var(--color-text-secondary);
      margin: 0;
      font-weight: var(--font-weight-medium);
    }

    .btn-gradient {
      background: linear-gradient(135deg, var(--color-primary-600), var(--color-primary-700));
      color: white;
      border: none;
      padding: var(--spacing-sm) var(--spacing-lg);
      border-radius: var(--radius-lg);
      font-weight: var(--font-weight-semibold);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      transition: all var(--transition-base);
      box-shadow: var(--shadow-blue);
    }

    .btn-gradient:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
      filter: brightness(1.1);
    }

    .btn-gradient:active {
      transform: translateY(0);
    }

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: var(--spacing-xl);
      margin-bottom: var(--spacing-3xl);
    }

    .kpi-card {
      position: relative;
      overflow: hidden;
      border-radius: var(--radius-2xl);
      padding: var(--spacing-xl);
      transition: all var(--transition-base);
    }

    .glass {
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      box-shadow: var(--shadow-lg);
    }

    .hover-lift:hover {
      transform: translateY(-8px);
    }

    .shadow-blue {
      box-shadow: 0 4px 14px rgba(59, 130, 246, 0.15);
    }

    .shadow-blue:hover {
      box-shadow: 0 12px 24px rgba(59, 130, 246, 0.25);
    }

    .shadow-green {
      box-shadow: 0 4px 14px rgba(34, 197, 94, 0.15);
    }

    .shadow-green:hover {
      box-shadow: 0 12px 24px rgba(34, 197, 94, 0.25);
    }

    .shadow-red {
      box-shadow: 0 4px 14px rgba(239, 68, 68, 0.15);
    }

    .shadow-red:hover {
      box-shadow: 0 12px 24px rgba(239, 68, 68, 0.25);
    }

    .shadow-purple {
      box-shadow: 0 4px 14px rgba(168, 85, 247, 0.15);
    }

    .shadow-purple:hover {
      box-shadow: 0 12px 24px rgba(168, 85, 247, 0.25);
    }

    .kpi-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--spacing-lg);
    }

    .kpi-icon-wrapper {
      width: 56px;
      height: 56px;
      border-radius: var(--radius-xl);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all var(--transition-base);
    }

    .kpi-card:hover .kpi-icon-wrapper {
      transform: scale(1.1) rotate(-5deg);
    }

    .gradient-blue {
      background: linear-gradient(135deg, #3b82f6, #2563eb);
      color: white;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }

    .gradient-green {
      background: linear-gradient(135deg, #22c55e, #16a34a);
      color: white;
      box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
    }

    .gradient-red {
      background: linear-gradient(135deg, #f97316, #ef4444);
      color: white;
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
    }

    .gradient-purple {
      background: linear-gradient(135deg, #a855f7, #9333ea);
      color: white;
      box-shadow: 0 4px 12px rgba(168, 85, 247, 0.3);
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
      font-size: var(--font-size-4xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-primary);
      line-height: 1;
    }

    .kpi-label {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
      letter-spacing: 0.5px;
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
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
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
      box-shadow: var(--shadow-lg);
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
      width: 48px;
      height: 48px;
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
        align-items: stretch;
      }

      .gradient-text {
        font-size: var(--font-size-3xl);
      }

      .btn-gradient {
        width: 100%;
        justify-content: center;
      }

      .kpi-grid {
        grid-template-columns: 1fr;
        gap: var(--spacing-md);
      }

      .alert-content {
        overflow: hidden;
      }

      .kpi-value {
        font-size: var(--font-size-3xl);
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
  allMovements = signal<StockMovement[]>([]);

  // Computed signal for movements in last 7 days
  movements7days = computed(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return this.allMovements().filter(m => 
      new Date(m.dateMouvement) >= sevenDaysAgo
    ).length;
  });

  constructor(private mockDataService: MockDataService) {}

  ngOnInit() {
    this.loadKPIs();
    this.loadRecentAlerts();
    this.loadMovements();
  }

  loadKPIs() {
    const kpisData = this.mockDataService.getDashboardKPIs();
    this.kpis.set(kpisData);
  }

  loadRecentAlerts() {
    const alertsData = this.mockDataService.getAlerts().slice(0, 5);
    this.recentAlerts.set(alertsData);
  }

  loadMovements() {
    const movements = this.mockDataService.getMovements();
    this.allMovements.set(movements);
  }

  refreshDashboard() {
    this.loadKPIs();
    this.loadRecentAlerts();
    this.loadMovements();
  }

  formatCurrency(value: number): string {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)}M €`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K €`;
    }
    return `${value.toFixed(0)} €`;
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

  getAlertBadgeVariant(severite: string): 'primary' | 'success' | 'danger' | 'warning' | 'info' | 'secondary' {
    const variants: { [key: string]: 'primary' | 'success' | 'danger' | 'warning' | 'info' | 'secondary' } = {
      'Critique': 'danger',
      'Haute': 'warning',
      'Moyenne': 'info',
      'Basse': 'success'
    };
    return variants[severite] || 'secondary';
  }
}
