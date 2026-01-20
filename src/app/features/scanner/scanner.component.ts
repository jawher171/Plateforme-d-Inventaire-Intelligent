import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../core/services/mock-data.service';
import { Product } from '../../shared/models';

@Component({
  selector: 'app-scanner',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h1>Scanner QR / Code-barres</h1>

      <div class="scanner-section">
        <div class="scan-area">
          <div class="scan-frame">
            <div class="corner corner-tl"></div>
            <div class="corner corner-tr"></div>
            <div class="corner corner-bl"></div>
            <div class="corner corner-br"></div>
            <div class="scan-line"></div>
            <p class="scan-text">Scannez un code-barres ou QR code</p>
          </div>
        </div>

        <div class="manual-input">
          <input
            type="text"
            [(ngModel)]="codeInput"
            placeholder="Ou entrez le code manuellement..."
            class="code-input"
            (keyup.enter)="searchProduct()"
          >
          <button class="btn btn-primary" (click)="searchProduct()">
            🔍 Rechercher
          </button>
        </div>
      </div>

      <div class="product-result" *ngIf="scannedProduct()">
        <div class="product-card">
          <div class="product-header">
            <h2>{{ scannedProduct()!.nom }}</h2>
            <span class="badge" [ngClass]="getStockClass()">
              {{ getStockStatus() }}
            </span>
          </div>

          <div class="product-details">
            <div class="detail-item">
              <span class="label">Code-barres:</span>
              <span class="value">{{ scannedProduct()!.codeBarres }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Stock actuel:</span>
              <span class="value" [ngClass]="getStockClass()">
                {{ scannedProduct()!.quantiteStock }} unités
              </span>
            </div>
            <div class="detail-item">
              <span class="label">Seuil minimum:</span>
              <span class="value">{{ scannedProduct()!.seuilMinimum }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Prix unitaire:</span>
              <span class="value">{{ scannedProduct()!.prixUnitaire }} €</span>
            </div>
            <div class="detail-item" *ngIf="scannedProduct()!.description">
              <span class="label">Description:</span>
              <span class="value">{{ scannedProduct()!.description }}</span>
            </div>
          </div>

          <div class="quick-actions">
            <button class="btn btn-success" (click)="quickMovement('Entree')">
              + Entrée
            </button>
            <button class="btn btn-danger" (click)="quickMovement('Sortie')">
              - Sortie
            </button>
          </div>
        </div>
      </div>

      <div class="error-message" *ngIf="errorMessage">
        <span class="icon">❌</span>
        <p>{{ errorMessage }}</p>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 30px;
      max-width: 800px;
      margin: 0 auto;
    }

    h1 {
      text-align: center;
      margin-bottom: 40px;
      color: #333;
      font-size: 32px;
      font-weight: 600;
    }

    .scanner-section {
      background: white;
      border-radius: 15px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      padding: 40px;
      margin-bottom: 30px;
    }

    .scan-area {
      display: flex;
      justify-content: center;
      margin-bottom: 30px;
    }

    .scan-frame {
      width: 300px;
      height: 300px;
      border: 2px dashed #ddd;
      border-radius: 15px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #fafafa;
    }

    .corner {
      position: absolute;
      width: 40px;
      height: 40px;
      border: 4px solid #4CAF50;
    }

    .corner-tl {
      top: 10px;
      left: 10px;
      border-right: none;
      border-bottom: none;
      border-radius: 8px 0 0 0;
    }

    .corner-tr {
      top: 10px;
      right: 10px;
      border-left: none;
      border-bottom: none;
      border-radius: 0 8px 0 0;
    }

    .corner-bl {
      bottom: 10px;
      left: 10px;
      border-right: none;
      border-top: none;
      border-radius: 0 0 0 8px;
    }

    .corner-br {
      bottom: 10px;
      right: 10px;
      border-left: none;
      border-top: none;
      border-radius: 0 0 8px 0;
    }

    .scan-line {
      position: absolute;
      width: 80%;
      height: 3px;
      background: linear-gradient(90deg, transparent, #4CAF50, transparent);
      animation: scan 2s ease-in-out infinite;
    }

    @keyframes scan {
      0%, 100% {
        top: 20%;
        opacity: 0;
      }
      50% {
        top: 50%;
        opacity: 1;
      }
    }

    .scan-text {
      color: #999;
      font-size: 14px;
      text-align: center;
      position: relative;
      z-index: 1;
    }

    .manual-input {
      display: flex;
      gap: 10px;
    }

    .code-input {
      flex: 1;
      padding: 14px 16px;
      border: 2px solid #ddd;
      border-radius: 10px;
      font-size: 15px;
      transition: border-color 0.3s;
    }

    .code-input:focus {
      outline: none;
      border-color: #2196F3;
    }

    .product-result {
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .product-card {
      background: white;
      border-radius: 15px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      padding: 30px;
    }

    .product-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 25px;
      padding-bottom: 20px;
      border-bottom: 2px solid #f0f0f0;
    }

    .product-header h2 {
      margin: 0;
      color: #333;
      font-size: 24px;
    }

    .product-details {
      display: flex;
      flex-direction: column;
      gap: 15px;
      margin-bottom: 25px;
    }

    .detail-item {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
    }

    .detail-item .label {
      font-weight: 500;
      color: #666;
    }

    .detail-item .value {
      color: #333;
      font-weight: 500;
    }

    .stock-critical {
      color: #e74c3c;
      font-weight: 700;
    }

    .stock-low {
      color: #f39c12;
      font-weight: 700;
    }

    .stock-ok {
      color: #4CAF50;
      font-weight: 700;
    }

    .quick-actions {
      display: flex;
      gap: 15px;
      padding-top: 20px;
      border-top: 2px solid #f0f0f0;
    }

    .quick-actions .btn {
      flex: 1;
      padding: 14px;
      font-size: 16px;
    }

    .error-message {
      background: white;
      border-radius: 15px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      padding: 40px;
      text-align: center;
      color: #e74c3c;
    }

    .error-message .icon {
      font-size: 64px;
      display: block;
      margin-bottom: 15px;
    }

    .error-message p {
      font-size: 18px;
      margin: 0;
    }

    .badge {
      padding: 6px 16px;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 500;
    }

    .badge-danger {
      background-color: #e74c3c;
      color: white;
    }

    .badge-warning {
      background-color: #f39c12;
      color: white;
    }

    .badge-success {
      background-color: #4CAF50;
      color: white;
    }

    @media (max-width: 768px) {
      .container {
        padding: 15px;
      }

      .scanner-section {
        padding: 20px;
      }

      .scan-frame {
        width: 250px;
        height: 250px;
      }

      .quick-actions {
        flex-direction: column;
      }
    }
  `]
})
export class ScannerComponent {
  scannedProduct = signal<Product | null>(null);
  codeInput = '';
  errorMessage = '';

  constructor(private mockDataService: MockDataService) {}

  searchProduct() {
    if (!this.codeInput.trim()) {
      return;
    }

    this.errorMessage = '';
    this.scannedProduct.set(null);

    const product = this.mockDataService.getProductByBarcode(this.codeInput);
    if (product) {
      this.scannedProduct.set(product);
      this.codeInput = '';
    } else {
      this.errorMessage = 'Produit non trouvé pour ce code';
    }
  }

  quickMovement(type: 'Entree' | 'Sortie') {
    const product = this.scannedProduct();
    if (!product) return;

    const quantity = prompt(`Quantité pour ${type.toLowerCase()} :`);
    if (!quantity || isNaN(Number(quantity))) {
      return;
    }

    const movement = {
      type,
      quantite: Number(quantity),
      produitId: product.id,
      siteId: product.siteId,
      motif: `${type} rapide via scanner`,
      userId: 1
    };

    this.mockDataService.addMovement(movement);
    alert(`${type} enregistrée avec succès!`);
    
    // Refresh product data
    const updatedProduct = this.mockDataService.getProductByBarcode(product.codeBarres);
    if (updatedProduct) {
      this.scannedProduct.set(updatedProduct);
    }
  }

  getStockStatus(): string {
    const product = this.scannedProduct();
    if (!product) return '';

    if (product.quantiteStock === 0) return 'Rupture de stock';
    if (product.quantiteStock <= product.seuilMinimum) return 'Stock critique';
    return 'En stock';
  }

  getStockClass(): string {
    const product = this.scannedProduct();
    if (!product) return '';

    if (product.quantiteStock === 0) return 'stock-critical badge-danger';
    if (product.quantiteStock <= product.seuilMinimum) return 'stock-low badge-warning';
    return 'stock-ok badge-success';
  }
}
