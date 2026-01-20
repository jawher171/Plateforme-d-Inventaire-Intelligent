import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService } from '../../core/services/mock-data.service';
import { Alert } from '../../shared/models';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Gestion des Alertes</h1>

      <div class="stats-header">
        <div class="stat-card critical">
          <div class="stat-value">{{ getCounts().critiques }}</div>
          <div class="stat-label">Alertes Critiques</div>
        </div>
        <div class="stat-card high">
          <div class="stat-value">{{ getCounts().hautes }}</div>
          <div class="stat-label">Alertes Hautes</div>
        </div>
        <div class="stat-card medium">
          <div class="stat-value">{{ getCounts().moyennes }}</div>
          <div class="stat-label">Alertes Moyennes</div>
        </div>
      </div>

      <div class="alerts-container">
        <div *ngFor="let alert of alerts()" class="alert-card" [ngClass]="getAlertClass(alert)">
          <div class="alert-header">
            <div class="alert-left">
              <span class="severity-icon">{{ getSeverityIcon(alert.severite) }}</span>
              <div class="alert-info">
                <div class="alert-product">{{ alert.produit?.nom }}</div>
                <div class="alert-date">{{ alert.dateCreation | date:'medium' }}</div>
              </div>
            </div>
            <span class="alert-type-badge" [ngClass]="getTypeBadgeClass(alert.type)">
              {{ alert.type }}
            </span>
          </div>

          <div class="alert-message">
            {{ alert.message }}
          </div>

          <div class="alert-actions" *ngIf="!alert.estTraitee">
            <button class="btn btn-success btn-sm" (click)="markAsHandled(alert)">
              ✅ Traiter
            </button>
          </div>

          <div class="alert-handled" *ngIf="alert.estTraitee">
            <span class="handled-badge">✓ Traitée</span>
          </div>
        </div>

        <div *ngIf="alerts().length === 0" class="no-alerts">
          <span class="icon">✓</span>
          <p>Aucune alerte à afficher</p>
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

    .stats-header {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 25px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      text-align: center;
      border-top: 4px solid #9e9e9e;
    }

    .stat-card.critical {
      border-top-color: #e74c3c;
    }

    .stat-card.high {
      border-top-color: #f39c12;
    }

    .stat-card.medium {
      border-top-color: #f1c40f;
    }

    .stat-value {
      font-size: 42px;
      font-weight: 700;
      color: #333;
      margin-bottom: 8px;
    }

    .stat-label {
      font-size: 14px;
      color: #999;
      font-weight: 500;
    }

    .alerts-container {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .alert-card {
      background: white;
      border-radius: 12px;
      padding: 25px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      border-left: 6px solid #9e9e9e;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .alert-card:hover {
      transform: translateX(5px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
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

    .alert-card.low {
      border-left-color: #95a5a6;
      background-color: #f8f9fa;
    }

    .alert-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 15px;
    }

    .alert-left {
      display: flex;
      gap: 15px;
      align-items: flex-start;
    }

    .severity-icon {
      font-size: 32px;
      line-height: 1;
    }

    .alert-info {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .alert-product {
      font-weight: 600;
      font-size: 18px;
      color: #333;
    }

    .alert-date {
      font-size: 13px;
      color: #999;
    }

    .alert-type-badge {
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
      white-space: nowrap;
    }

    .badge-rupture {
      background-color: #e74c3c;
      color: white;
    }

    .badge-seuil {
      background-color: #f39c12;
      color: white;
    }

    .badge-peremption {
      background-color: #9b59b6;
      color: white;
    }

    .alert-message {
      color: #555;
      font-size: 15px;
      line-height: 1.6;
      margin-bottom: 15px;
    }

    .alert-actions {
      display: flex;
      gap: 10px;
      padding-top: 15px;
      border-top: 1px solid #eee;
    }

    .btn-sm {
      padding: 8px 16px;
      font-size: 13px;
    }

    .alert-handled {
      padding-top: 15px;
      border-top: 1px solid #eee;
    }

    .handled-badge {
      display: inline-block;
      padding: 6px 14px;
      background-color: #4CAF50;
      color: white;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
    }

    .no-alerts {
      text-align: center;
      padding: 80px 20px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .no-alerts .icon {
      font-size: 72px;
      display: block;
      margin-bottom: 20px;
      color: #4CAF50;
    }

    .no-alerts p {
      font-size: 18px;
      color: #999;
      margin: 0;
    }

    @media (max-width: 768px) {
      .container {
        padding: 15px;
      }

      h1 {
        font-size: 24px;
      }

      .stats-header {
        grid-template-columns: 1fr;
      }

      .alert-header {
        flex-direction: column;
        gap: 10px;
      }

      .alert-type-badge {
        align-self: flex-start;
      }
    }
  `]
})
export class AlertsComponent implements OnInit {
  alerts = signal<Alert[]>([]);

  counts = computed(() => {
    const allAlerts = this.alerts();
    return {
      critiques: allAlerts.filter(a => a.severite === 'Critique' && !a.estTraitee).length,
      hautes: allAlerts.filter(a => a.severite === 'Haute' && !a.estTraitee).length,
      moyennes: allAlerts.filter(a => a.severite === 'Moyenne' && !a.estTraitee).length
    };
  });

  constructor(private mockDataService: MockDataService) {}

  ngOnInit() {
    this.loadAlerts();
  }

  loadAlerts() {
    const alertsData = this.mockDataService.getAlerts();
    this.alerts.set(alertsData);
  }

  getCounts() {
    return this.counts();
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
    if (alert.estTraitee) return '';
    
    const classes: { [key: string]: string } = {
      'Critique': 'critical',
      'Haute': 'high',
      'Moyenne': 'medium',
      'Basse': 'low'
    };
    return classes[alert.severite] || '';
  }

  getTypeBadgeClass(type: string): string {
    const classes: { [key: string]: string } = {
      'Rupture': 'badge-rupture',
      'SeuilCritique': 'badge-seuil',
      'Peremption': 'badge-peremption'
    };
    return classes[type] || 'badge-rupture';
  }

  markAsHandled(alert: Alert) {
    this.mockDataService.treatAlert(alert.id);
    this.loadAlerts();
  }
}
