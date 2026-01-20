import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../core/services/mock-data.service';
import { StockMovement, Product, Site } from '../../shared/models';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="page-header">
        <h1>Mouvements de Stock</h1>
        <div class="action-buttons">
          <button class="btn btn-success" (click)="openModal('Entree')">
            <span>+ Entrée</span>
          </button>
          <button class="btn btn-danger" (click)="openModal('Sortie')">
            <span>- Sortie</span>
          </button>
          <button class="btn btn-primary" (click)="openModal('Transfert')">
            <span>↔ Transfert</span>
          </button>
        </div>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Produit</th>
              <th>Quantité</th>
              <th>Motif</th>
              <th>Site</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let movement of movements()">
              <td>{{ movement.dateMouvement | date:'short' }}</td>
              <td>
                <span class="badge" [ngClass]="getTypeClass(movement.type)">
                  {{ movement.type }}
                </span>
              </td>
              <td>{{ movement.produit?.nom || '-' }}</td>
              <td [ngClass]="getQuantityClass(movement.type)">
                {{ getQuantityDisplay(movement) }}
              </td>
              <td>{{ movement.motif || '-' }}</td>
              <td>{{ movement.site?.nom || '-' }}</td>
            </tr>
          </tbody>
        </table>

        <div *ngIf="movements().length === 0" class="no-data">
          <p>Aucun mouvement de stock</p>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div class="modal-overlay" *ngIf="showModal" (click)="closeModal()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>{{ currentMovement.type }}</h2>
          <button class="close-btn" (click)="closeModal()">×</button>
        </div>

        <form (ngSubmit)="saveMovement()">
          <div class="form-group">
            <label>Produit *</label>
            <select [(ngModel)]="currentMovement.produitId" name="produitId" required (change)="onProductChange()">
              <option value="">Sélectionner un produit...</option>
              <option *ngFor="let product of products()" [value]="product.id">
                {{ product.nom }} (Stock actuel: {{ product.quantiteStock }})
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Quantité *</label>
            <input type="number" [(ngModel)]="currentMovement.quantite" name="quantite" required min="1">
          </div>

          <div class="form-group">
            <label>Motif</label>
            <input type="text" [(ngModel)]="currentMovement.motif" name="motif" placeholder="Raison du mouvement">
          </div>

          <div class="form-group">
            <label>Site *</label>
            <select [(ngModel)]="currentMovement.siteId" name="siteId" required>
              <option value="">Sélectionner un site...</option>
              <option *ngFor="let site of sites()" [value]="site.id">{{ site.nom }}</option>
            </select>
          </div>

          <div class="form-group" *ngIf="currentMovement.type === 'Transfert'">
            <label>Site de destination *</label>
            <select [(ngModel)]="currentMovement.siteDestinationId" name="siteDestinationId">
              <option value="">Sélectionner un site...</option>
              <option *ngFor="let site of sites()" [value]="site.id">{{ site.nom }}</option>
            </select>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" (click)="closeModal()">Annuler</button>
            <button type="submit" class="btn btn-primary">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 30px;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }

    .page-header h1 {
      margin: 0;
      color: #333;
      font-size: 32px;
      font-weight: 600;
    }

    .action-buttons {
      display: flex;
      gap: 10px;
    }

    .table-container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th {
      background-color: #f8f9fa;
      padding: 15px;
      text-align: left;
      font-weight: 600;
      color: #555;
      font-size: 14px;
    }

    td {
      padding: 15px;
      border-bottom: 1px solid #eee;
    }

    tr:hover {
      background-color: #f8f9fa;
    }

    .badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }

    .badge-success {
      background-color: #4CAF50;
      color: white;
    }

    .badge-danger {
      background-color: #e74c3c;
      color: white;
    }

    .badge-info {
      background-color: #2196F3;
      color: white;
    }

    .quantity-positive {
      color: #4CAF50;
      font-weight: 600;
    }

    .quantity-negative {
      color: #e74c3c;
      font-weight: 600;
    }

    .no-data {
      text-align: center;
      padding: 60px 20px;
      color: #999;
    }

    .modal-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
      margin-top: 25px;
    }

    @media (max-width: 768px) {
      .container {
        padding: 15px;
      }

      .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
      }

      .action-buttons {
        width: 100%;
        flex-direction: column;
      }

      .table-container {
        overflow-x: auto;
      }
    }
  `]
})
export class StockComponent implements OnInit {
  movements = signal<StockMovement[]>([]);
  products = signal<Product[]>([]);
  sites = signal<Site[]>([]);

  showModal = false;
  currentMovement: Partial<StockMovement> = this.getEmptyMovement();

  constructor(private mockDataService: MockDataService) {}

  ngOnInit() {
    this.loadMovements();
    this.loadProducts();
    this.loadSites();
  }

  loadMovements() {
    const movementsData = this.mockDataService.getMovements();
    this.movements.set(movementsData);
  }

  loadProducts() {
    const productsData = this.mockDataService.getProducts();
    this.products.set(productsData);
  }

  loadSites() {
    const sitesData = this.mockDataService.getSites();
    this.sites.set(sitesData);
  }

  openModal(type: 'Entree' | 'Sortie' | 'Transfert') {
    this.showModal = true;
    this.currentMovement = this.getEmptyMovement();
    this.currentMovement.type = type;
  }

  closeModal() {
    this.showModal = false;
    this.currentMovement = this.getEmptyMovement();
  }

  onProductChange() {
    // Could add validation here for stock availability
  }

  saveMovement() {
    this.mockDataService.addMovement(this.currentMovement);
    this.loadMovements();
    this.loadProducts(); // Refresh to get updated stock quantities
    this.closeModal();
  }

  getTypeClass(type: string): string {
    if (type === 'Entree') return 'badge-success';
    if (type === 'Sortie') return 'badge-danger';
    return 'badge-info';
  }

  getQuantityClass(type: string): string {
    if (type === 'Entree') return 'quantity-positive';
    if (type === 'Sortie') return 'quantity-negative';
    return '';
  }

  getQuantityDisplay(movement: StockMovement): string {
    if (movement.type === 'Entree') {
      return `+${movement.quantite}`;
    } else if (movement.type === 'Sortie') {
      return `-${movement.quantite}`;
    }
    return `${movement.quantite}`;
  }

  private getEmptyMovement(): Partial<StockMovement> {
    return {
      type: 'Entree',
      quantite: 0,
      motif: '',
      produitId: 0,
      siteId: 0,
      siteDestinationId: undefined
    };
  }
}
