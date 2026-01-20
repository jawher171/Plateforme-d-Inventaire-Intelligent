import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { Product, Category, Site } from '../../shared/models';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="page-header">
        <h1>Gestion des Produits</h1>
        <button class="btn btn-primary" (click)="openModal()">
          <span>+ Nouveau produit</span>
        </button>
      </div>

      <div class="filters">
        <input
          type="text"
          [(ngModel)]="searchText"
          (ngModelChange)="filterProducts()"
          placeholder="🔍 Rechercher un produit..."
          class="search-input"
        >
        <select [(ngModel)]="statusFilter" (ngModelChange)="filterProducts()" class="filter-select">
          <option value="">Tous les statuts</option>
          <option value="stock">En stock</option>
          <option value="critique">Seuil critique</option>
          <option value="rupture">Rupture</option>
        </select>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Nom</th>
              <th>Catégorie</th>
              <th>Stock</th>
              <th>Seuil</th>
              <th>Prix</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let product of filteredProducts()">
              <td>{{ product.codeBarres }}</td>
              <td>{{ product.nom }}</td>
              <td>{{ product.categorie?.nom || '-' }}</td>
              <td>{{ product.quantiteStock }}</td>
              <td>{{ product.seuilMinimum }}</td>
              <td>{{ product.prixUnitaire }} €</td>
              <td>
                <span class="badge" [ngClass]="getStatusClass(product)">
                  {{ getStatus(product) }}
                </span>
              </td>
              <td class="actions">
                <button class="btn-icon" (click)="editProduct(product)" title="Modifier">✏️</button>
                <button class="btn-icon danger" (click)="deleteProduct(product)" title="Supprimer">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>

        <div *ngIf="filteredProducts().length === 0" class="no-data">
          <p>Aucun produit trouvé</p>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div class="modal-overlay" *ngIf="showModal" (click)="closeModal()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>{{ isEditing ? 'Modifier' : 'Nouveau' }} produit</h2>
          <button class="close-btn" (click)="closeModal()">×</button>
        </div>

        <form (ngSubmit)="saveProduct()">
          <div class="form-group">
            <label>Nom *</label>
            <input type="text" [(ngModel)]="currentProduct.nom" name="nom" required>
          </div>

          <div class="form-group">
            <label>Code-barres *</label>
            <input type="text" [(ngModel)]="currentProduct.codeBarres" name="codeBarres" required>
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea [(ngModel)]="currentProduct.description" name="description"></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Quantité en stock *</label>
              <input type="number" [(ngModel)]="currentProduct.quantiteStock" name="quantiteStock" required min="0">
            </div>

            <div class="form-group">
              <label>Seuil minimum *</label>
              <input type="number" [(ngModel)]="currentProduct.seuilMinimum" name="seuilMinimum" required min="0">
            </div>
          </div>

          <div class="form-group">
            <label>Prix unitaire *</label>
            <input type="number" [(ngModel)]="currentProduct.prixUnitaire" name="prixUnitaire" required min="0" step="0.01">
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Catégorie *</label>
              <select [(ngModel)]="currentProduct.categorieId" name="categorieId" required>
                <option value="">Sélectionner...</option>
                <option *ngFor="let cat of categories()" [value]="cat.id">{{ cat.nom }}</option>
              </select>
            </div>

            <div class="form-group">
              <label>Site *</label>
              <select [(ngModel)]="currentProduct.siteId" name="siteId" required>
                <option value="">Sélectionner...</option>
                <option *ngFor="let site of sites()" [value]="site.id">{{ site.nom }}</option>
              </select>
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" (click)="closeModal()">Annuler</button>
            <button type="submit" class="btn btn-primary">{{ isEditing ? 'Modifier' : 'Créer' }}</button>
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

    .filters {
      display: flex;
      gap: 15px;
      margin-bottom: 20px;
    }

    .search-input {
      flex: 1;
      padding: 12px 16px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 14px;
    }

    .filter-select {
      min-width: 200px;
      padding: 12px 16px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 14px;
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

    .actions {
      display: flex;
      gap: 8px;
    }

    .btn-icon {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 18px;
      padding: 5px;
      border-radius: 4px;
      transition: background-color 0.3s;
    }

    .btn-icon:hover {
      background-color: #f0f0f0;
    }

    .btn-icon.danger:hover {
      background-color: #fee;
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

    .badge-warning {
      background-color: #f39c12;
      color: white;
    }

    .badge-danger {
      background-color: #e74c3c;
      color: white;
    }

    .no-data {
      text-align: center;
      padding: 60px 20px;
      color: #999;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
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

      .filters {
        flex-direction: column;
      }

      .table-container {
        overflow-x: auto;
      }

      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProductsComponent implements OnInit {
  products = signal<Product[]>([]);
  filteredProducts = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  sites = signal<Site[]>([]);

  searchText = '';
  statusFilter = '';
  showModal = false;
  isEditing = false;

  currentProduct: Partial<Product> = this.getEmptyProduct();

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
    this.loadSites();
  }

  loadProducts() {
    this.apiService.get<Product[]>('api/products').subscribe({
      next: (data) => {
        this.products.set(data);
        this.filterProducts();
      },
      error: (err) => console.error('Error loading products', err)
    });
  }

  loadCategories() {
    this.apiService.get<Category[]>('api/categories').subscribe({
      next: (data) => this.categories.set(data),
      error: (err) => console.error('Error loading categories', err)
    });
  }

  loadSites() {
    this.apiService.get<Site[]>('api/sites').subscribe({
      next: (data) => this.sites.set(data),
      error: (err) => console.error('Error loading sites', err)
    });
  }

  filterProducts() {
    let filtered = this.products();

    // Filter by search text
    if (this.searchText) {
      const search = this.searchText.toLowerCase();
      filtered = filtered.filter(p =>
        p.nom.toLowerCase().includes(search) ||
        p.codeBarres.toLowerCase().includes(search) ||
        p.description?.toLowerCase().includes(search)
      );
    }

    // Filter by status
    if (this.statusFilter) {
      filtered = filtered.filter(p => {
        const status = this.getStatus(p).toLowerCase();
        return status.includes(this.statusFilter);
      });
    }

    this.filteredProducts.set(filtered);
  }

  getStatus(product: Product): string {
    if (product.quantiteStock === 0) return 'Rupture';
    if (product.quantiteStock <= product.seuilMinimum) return 'Critique';
    return 'En stock';
  }

  getStatusClass(product: Product): string {
    const status = this.getStatus(product);
    if (status === 'Rupture') return 'badge-danger';
    if (status === 'Critique') return 'badge-warning';
    return 'badge-success';
  }

  openModal(product?: Product) {
    this.showModal = true;
    if (product) {
      this.isEditing = true;
      this.currentProduct = { ...product };
    } else {
      this.isEditing = false;
      this.currentProduct = this.getEmptyProduct();
    }
  }

  closeModal() {
    this.showModal = false;
    this.currentProduct = this.getEmptyProduct();
  }

  editProduct(product: Product) {
    this.openModal(product);
  }

  deleteProduct(product: Product) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${product.nom}" ?`)) {
      this.apiService.delete(`api/products/${product.id}`).subscribe({
        next: () => this.loadProducts(),
        error: (err) => console.error('Error deleting product', err)
      });
    }
  }

  saveProduct() {
    if (this.isEditing && this.currentProduct.id) {
      this.apiService.put<Product>(`api/products/${this.currentProduct.id}`, this.currentProduct).subscribe({
        next: () => {
          this.loadProducts();
          this.closeModal();
        },
        error: (err) => console.error('Error updating product', err)
      });
    } else {
      this.apiService.post<Product>('api/products', this.currentProduct).subscribe({
        next: () => {
          this.loadProducts();
          this.closeModal();
        },
        error: (err) => console.error('Error creating product', err)
      });
    }
  }

  private getEmptyProduct(): Partial<Product> {
    return {
      nom: '',
      codeBarres: '',
      description: '',
      quantiteStock: 0,
      seuilMinimum: 0,
      prixUnitaire: 0,
      categorieId: 0,
      siteId: 0
    };
  }
}
