import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../core/services/mock-data.service';
import { Product, Category, Site } from '../../shared/models';
import { AnimatedBadgeComponent } from '../../shared/components/animated-badge/animated-badge.component';
import { fadeIn, slideUp, scaleIn, listAnimation } from '../../shared/animations/animations';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, AnimatedBadgeComponent],
  animations: [fadeIn, slideUp, scaleIn, listAnimation],
  template: `
    <div class="container">
      <!-- Page Header -->
      <div class="page-header" @fadeIn>
        <div class="header-content">
          <h1 class="gradient-text">Gestion des Produits</h1>
          <p class="subtitle">Gérez votre inventaire de produits en temps réel</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-gradient" (click)="openModal()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            <span>Nouveau Produit</span>
          </button>
          <button class="btn btn-gradient-outline" (click)="exportProducts()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            <span>Exporter</span>
          </button>
        </div>
      </div>

      <!-- Filters Section -->
      <div class="filters-section" @slideUp>
        <div class="search-wrapper">
          <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            [(ngModel)]="searchText"
            (ngModelChange)="filterProducts()"
            placeholder="Rechercher un produit..."
            class="search-input glass-input"
          >
        </div>
        
        <select [(ngModel)]="statusFilter" (ngModelChange)="filterProducts()" class="filter-select glass-select">
          <option value="">Tous les statuts</option>
          <option value="stock">En stock</option>
          <option value="critique">Stock faible</option>
          <option value="rupture">Rupture</option>
        </select>

        <select [(ngModel)]="categoryFilter" (ngModelChange)="filterProducts()" class="filter-select glass-select">
          <option value="">Toutes les catégories</option>
          <option *ngFor="let cat of categories()" [value]="cat.id">{{ cat.nom }}</option>
        </select>

        <button 
          *ngIf="hasActiveFilters()" 
          class="btn-clear-filters"
          (click)="clearFilters()"
          title="Effacer les filtres"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
          Effacer
        </button>
      </div>

      <!-- Modern Table -->
      <div class="table-container glass-card" [@listAnimation]="filteredProducts().length">
        <div class="table-wrapper">
          <table>
            <thead>
              <tr class="gradient-header">
                <th (click)="sortBy('codeBarres')">
                  <div class="th-content">
                    <span>Code</span>
                    <svg class="sort-icon" [class.active]="sortColumn === 'codeBarres'" 
                         [class.desc]="sortColumn === 'codeBarres' && sortDirection === 'desc'"
                         width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 5v14M19 12l-7 7-7-7"/>
                    </svg>
                  </div>
                </th>
                <th (click)="sortBy('nom')">
                  <div class="th-content">
                    <span>Nom</span>
                    <svg class="sort-icon" [class.active]="sortColumn === 'nom'" 
                         [class.desc]="sortColumn === 'nom' && sortDirection === 'desc'"
                         width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 5v14M19 12l-7 7-7-7"/>
                    </svg>
                  </div>
                </th>
                <th (click)="sortBy('categorie')">
                  <div class="th-content">
                    <span>Catégorie</span>
                    <svg class="sort-icon" [class.active]="sortColumn === 'categorie'" 
                         [class.desc]="sortColumn === 'categorie' && sortDirection === 'desc'"
                         width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 5v14M19 12l-7 7-7-7"/>
                    </svg>
                  </div>
                </th>
                <th (click)="sortBy('quantiteStock')">
                  <div class="th-content">
                    <span>Stock</span>
                    <svg class="sort-icon" [class.active]="sortColumn === 'quantiteStock'" 
                         [class.desc]="sortColumn === 'quantiteStock' && sortDirection === 'desc'"
                         width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 5v14M19 12l-7 7-7-7"/>
                    </svg>
                  </div>
                </th>
                <th (click)="sortBy('seuilMinimum')">
                  <div class="th-content">
                    <span>Seuil</span>
                    <svg class="sort-icon" [class.active]="sortColumn === 'seuilMinimum'" 
                         [class.desc]="sortColumn === 'seuilMinimum' && sortDirection === 'desc'"
                         width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 5v14M19 12l-7 7-7-7"/>
                    </svg>
                  </div>
                </th>
                <th (click)="sortBy('prixUnitaire')">
                  <div class="th-content">
                    <span>Prix</span>
                    <svg class="sort-icon" [class.active]="sortColumn === 'prixUnitaire'" 
                         [class.desc]="sortColumn === 'prixUnitaire' && sortDirection === 'desc'"
                         width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 5v14M19 12l-7 7-7-7"/>
                    </svg>
                  </div>
                </th>
                <th>Statut</th>
                <th class="actions-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let product of filteredProducts(); trackBy: trackByProductId" class="table-row">
                <td><span class="code-badge">{{ product.codeBarres }}</span></td>
                <td><strong>{{ product.nom }}</strong></td>
                <td>
                  <span class="category-tag">
                    {{ product.categorie?.nom || '-' }}
                  </span>
                </td>
                <td>
                  <span class="stock-value" [class.low-stock]="product.quantiteStock <= product.seuilMinimum">
                    {{ product.quantiteStock }}
                  </span>
                </td>
                <td>{{ product.seuilMinimum }}</td>
                <td><strong class="price">{{ product.prixUnitaire | number:'1.2-2' }} €</strong></td>
                <td>
                  <app-animated-badge 
                    [variant]="getStatusVariant(product)" 
                    [gradient]="true"
                    size="sm"
                  >
                    {{ getStatus(product) }}
                  </app-animated-badge>
                </td>
                <td class="actions">
                  <button class="btn-action btn-edit" (click)="editProduct(product)" title="Modifier">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button class="btn-action btn-delete" (click)="deleteProduct(product)" title="Supprimer">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <div *ngIf="filteredProducts().length === 0" class="no-data">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <h3>Aucun produit trouvé</h3>
            <p>Essayez de modifier vos critères de recherche</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modern Modal -->
    <div class="modal-overlay glass-backdrop" *ngIf="showModal" (click)="closeModal()" @fadeIn>
      <div class="modal-content glass-modal" (click)="$event.stopPropagation()" @scaleIn>
        <div class="modal-header">
          <div>
            <h2 class="gradient-text">{{ isEditing ? 'Modifier le produit' : 'Nouveau produit' }}</h2>
            <p class="modal-subtitle">{{ isEditing ? 'Mettez à jour les informations du produit' : 'Ajoutez un nouveau produit à votre inventaire' }}</p>
          </div>
          <button class="close-btn" (click)="closeModal()">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <form (ngSubmit)="saveProduct()" class="modern-form">
          <div class="form-group">
            <label>Nom du produit <span class="required">*</span></label>
            <input type="text" [(ngModel)]="currentProduct.nom" name="nom" required class="modern-input">
          </div>

          <div class="form-group">
            <label>Code-barres <span class="required">*</span></label>
            <input type="text" [(ngModel)]="currentProduct.codeBarres" name="codeBarres" required class="modern-input">
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea [(ngModel)]="currentProduct.description" name="description" rows="3" class="modern-input"></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Quantité en stock <span class="required">*</span></label>
              <input type="number" [(ngModel)]="currentProduct.quantiteStock" name="quantiteStock" required min="0" class="modern-input">
            </div>

            <div class="form-group">
              <label>Seuil minimum <span class="required">*</span></label>
              <input type="number" [(ngModel)]="currentProduct.seuilMinimum" name="seuilMinimum" required min="0" class="modern-input">
            </div>
          </div>

          <div class="form-group">
            <label>Prix unitaire (€) <span class="required">*</span></label>
            <input type="number" [(ngModel)]="currentProduct.prixUnitaire" name="prixUnitaire" required min="0" step="0.01" class="modern-input">
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Catégorie <span class="required">*</span></label>
              <select [(ngModel)]="currentProduct.categorieId" name="categorieId" required class="modern-select">
                <option value="">Sélectionner une catégorie...</option>
                <option *ngFor="let cat of categories()" [value]="cat.id">{{ cat.nom }}</option>
              </select>
            </div>

            <div class="form-group">
              <label>Site <span class="required">*</span></label>
              <select [(ngModel)]="currentProduct.siteId" name="siteId" required class="modern-select">
                <option value="">Sélectionner un site...</option>
                <option *ngFor="let site of sites()" [value]="site.id">{{ site.nom }}</option>
              </select>
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" (click)="closeModal()">Annuler</button>
            <button type="submit" class="btn btn-gradient">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
              </svg>
              {{ isEditing ? 'Enregistrer' : 'Créer le produit' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: var(--spacing-2xl);
      max-width: 1400px;
      margin: 0 auto;
    }

    /* Page Header */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--spacing-2xl);
      gap: var(--spacing-xl);
    }

    .header-content h1 {
      margin: 0 0 var(--spacing-xs) 0;
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
    }

    .gradient-text {
      background: var(--gradient-primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .subtitle {
      margin: 0;
      color: var(--color-gray-600);
      font-size: var(--font-size-base);
    }

    .modal-subtitle {
      margin: var(--spacing-xs) 0 0 0;
      color: var(--color-gray-600);
      font-size: var(--font-size-sm);
      font-weight: normal;
    }

    .header-actions {
      display: flex;
      gap: var(--spacing-md);
    }

    /* Buttons */
    .btn {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-md) var(--spacing-xl);
      border: none;
      border-radius: var(--radius-lg);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      cursor: pointer;
      transition: all var(--transition-base);
      white-space: nowrap;
    }

    .btn-gradient {
      background: var(--gradient-primary);
      color: white;
      box-shadow: var(--shadow-blue);
    }

    .btn-gradient:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 24px -10px rgba(59, 130, 246, 0.5);
    }

    .btn-gradient-outline {
      background: var(--glass-bg);
      backdrop-filter: var(--glass-blur);
      border: 2px solid transparent;
      background-clip: padding-box;
      color: var(--color-primary-600);
      position: relative;
    }

    .btn-gradient-outline::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: var(--radius-lg);
      padding: 2px;
      background: var(--gradient-primary);
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      pointer-events: none;
    }

    .btn-gradient-outline:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .btn-secondary {
      background: var(--color-gray-100);
      color: var(--color-gray-700);
    }

    .btn-secondary:hover {
      background: var(--color-gray-200);
    }

    /* Filters Section */
    .filters-section {
      display: flex;
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-xl);
      flex-wrap: wrap;
    }

    .search-wrapper {
      position: relative;
      flex: 1;
      min-width: 300px;
    }

    .search-icon {
      position: absolute;
      left: var(--spacing-md);
      top: 50%;
      transform: translateY(-50%);
      color: var(--color-gray-400);
      pointer-events: none;
    }

    .search-input {
      width: 100%;
      padding: var(--spacing-md) var(--spacing-md) var(--spacing-md) var(--spacing-3xl);
      font-size: var(--font-size-sm);
    }

    .glass-input, .glass-select {
      background: var(--glass-bg);
      backdrop-filter: var(--glass-blur);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-lg);
      transition: all var(--transition-base);
    }

    .glass-input:focus, .glass-select:focus {
      outline: none;
      border-color: var(--color-primary-400);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      transform: translateY(-1px);
    }

    .filter-select {
      min-width: 200px;
      padding: var(--spacing-md);
      font-size: var(--font-size-sm);
      cursor: pointer;
    }

    .btn-clear-filters {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-xs);
      padding: var(--spacing-md) var(--spacing-lg);
      background: var(--glass-bg);
      backdrop-filter: var(--glass-blur);
      border: 1px solid var(--color-danger-200);
      border-radius: var(--radius-lg);
      color: var(--color-danger-600);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .btn-clear-filters:hover {
      background: var(--color-danger-50);
      border-color: var(--color-danger-400);
      transform: translateY(-1px);
    }

    /* Table Container */
    .table-container {
      overflow: hidden;
    }

    .glass-card {
      background: var(--glass-bg);
      backdrop-filter: var(--glass-blur);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-lg);
    }

    .table-wrapper {
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    thead tr.gradient-header {
      background: linear-gradient(135deg, 
        rgba(59, 130, 246, 0.1) 0%, 
        rgba(147, 51, 234, 0.1) 100%);
    }

    th {
      padding: var(--spacing-lg) var(--spacing-md);
      text-align: left;
      font-weight: var(--font-weight-semibold);
      color: var(--color-gray-700);
      font-size: var(--font-size-sm);
      cursor: pointer;
      user-select: none;
      white-space: nowrap;
    }

    .th-content {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
    }

    .sort-icon {
      opacity: 0.3;
      transition: all var(--transition-base);
    }

    .sort-icon.active {
      opacity: 1;
      color: var(--color-primary-600);
    }

    .sort-icon.desc {
      transform: rotate(180deg);
    }

    th:hover .sort-icon {
      opacity: 0.6;
    }

    .actions-header {
      cursor: default !important;
    }

    td {
      padding: var(--spacing-lg) var(--spacing-md);
      border-bottom: 1px solid var(--glass-border);
      font-size: var(--font-size-sm);
      color: var(--color-gray-700);
    }

    tbody tr.table-row {
      transition: all var(--transition-base);
    }

    tbody tr.table-row:hover {
      background: rgba(59, 130, 246, 0.03);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    tbody tr.table-row:last-child td {
      border-bottom: none;
    }

    /* Table Cell Styles */
    .code-badge {
      display: inline-block;
      padding: var(--spacing-xs) var(--spacing-md);
      background: var(--color-gray-100);
      border-radius: var(--radius-md);
      font-family: 'Courier New', monospace;
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
      color: var(--color-gray-700);
    }

    .category-tag {
      display: inline-block;
      padding: var(--spacing-xs) var(--spacing-md);
      background: var(--color-primary-50);
      color: var(--color-primary-700);
      border-radius: var(--radius-md);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
    }

    .stock-value {
      font-weight: var(--font-weight-semibold);
      color: var(--color-success-600);
    }

    .stock-value.low-stock {
      color: var(--color-danger-600);
    }

    .price {
      color: var(--color-gray-900);
      font-size: var(--font-size-base);
    }

    /* Action Buttons */
    .actions {
      display: flex;
      gap: var(--spacing-sm);
    }

    .btn-action {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      padding: 0;
      border: none;
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition-base);
      background: var(--glass-bg);
      backdrop-filter: var(--glass-blur);
      border: 1px solid var(--glass-border);
    }

    .btn-edit {
      color: var(--color-primary-600);
    }

    .btn-edit:hover {
      background: var(--color-primary-50);
      border-color: var(--color-primary-200);
      transform: translateY(-2px);
      box-shadow: var(--shadow-sm);
    }

    .btn-delete {
      color: var(--color-danger-600);
    }

    .btn-delete:hover {
      background: var(--color-danger-50);
      border-color: var(--color-danger-200);
      transform: translateY(-2px);
      box-shadow: var(--shadow-sm);
    }

    /* No Data State */
    .no-data {
      text-align: center;
      padding: var(--spacing-4xl) var(--spacing-xl);
    }

    .no-data svg {
      color: var(--color-gray-300);
      margin-bottom: var(--spacing-lg);
    }

    .no-data h3 {
      margin: 0 0 var(--spacing-sm) 0;
      color: var(--color-gray-700);
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
    }

    .no-data p {
      margin: 0;
      color: var(--color-gray-500);
      font-size: var(--font-size-sm);
    }

    /* Modal */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: var(--spacing-xl);
    }

    .glass-backdrop {
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(8px);
    }

    .modal-content {
      width: 100%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
    }

    .glass-modal {
      background: white;
      backdrop-filter: var(--glass-blur);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-2xl);
      box-shadow: var(--shadow-2xl);
      padding: var(--spacing-2xl);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--spacing-2xl);
      gap: var(--spacing-lg);
    }

    .modal-header h2 {
      margin: 0;
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
    }

    .close-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      padding: 0;
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-lg);
      color: var(--color-gray-600);
      cursor: pointer;
      transition: all var(--transition-base);
      flex-shrink: 0;
    }

    .close-btn:hover {
      background: var(--color-gray-100);
      color: var(--color-gray-900);
      transform: rotate(90deg);
    }

    /* Modern Form */
    .modern-form {
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
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-gray-700);
    }

    .required {
      color: var(--color-danger-500);
    }

    .modern-input, .modern-select {
      padding: var(--spacing-md);
      border: 1px solid var(--color-gray-300);
      border-radius: var(--radius-lg);
      font-size: var(--font-size-sm);
      transition: all var(--transition-base);
      background: white;
    }

    .modern-input:focus, .modern-select:focus {
      outline: none;
      border-color: var(--color-primary-400);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      transform: translateY(-1px);
    }

    textarea.modern-input {
      resize: vertical;
      min-height: 80px;
      font-family: inherit;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-lg);
    }

    .modal-actions {
      display: flex;
      gap: var(--spacing-md);
      justify-content: flex-end;
      margin-top: var(--spacing-xl);
      padding-top: var(--spacing-xl);
      border-top: 1px solid var(--glass-border);
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .container {
        padding: var(--spacing-xl);
      }

      .table-container {
        overflow-x: auto;
      }
    }

    @media (max-width: 768px) {
      .container {
        padding: var(--spacing-lg);
      }

      .page-header {
        flex-direction: column;
        align-items: stretch;
      }

      .header-actions {
        flex-direction: column;
      }

      .filters-section {
        flex-direction: column;
      }

      .search-wrapper {
        min-width: 100%;
      }

      .filter-select {
        min-width: 100%;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .modal-overlay {
        padding: var(--spacing-md);
      }

      .glass-modal {
        padding: var(--spacing-xl);
      }

      th, td {
        padding: var(--spacing-md) var(--spacing-sm);
        font-size: var(--font-size-xs);
      }

      .btn {
        padding: var(--spacing-sm) var(--spacing-md);
        font-size: var(--font-size-xs);
      }
    }

    @media (max-width: 480px) {
      .header-content h1 {
        font-size: var(--font-size-2xl);
      }

      .table-wrapper {
        overflow-x: scroll;
      }

      table {
        min-width: 800px;
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
  categoryFilter: number | '' = '';
  showModal = false;
  isEditing = false;
  
  sortColumn: keyof Product | 'categorie' = 'nom';
  sortDirection: 'asc' | 'desc' = 'asc';

  currentProduct: Partial<Product> = this.getEmptyProduct();

  constructor(private mockDataService: MockDataService) {}

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
    this.loadSites();
  }

  loadProducts() {
    const productsData = this.mockDataService.getProducts();
    this.products.set(productsData);
    this.filterProducts();
  }

  loadCategories() {
    const categoriesData = this.mockDataService.getCategories();
    this.categories.set(categoriesData);
  }

  loadSites() {
    const sitesData = this.mockDataService.getSites();
    this.sites.set(sitesData);
  }

  filterProducts() {
    let filtered = this.products();

    if (this.searchText) {
      const search = this.searchText.toLowerCase();
      filtered = filtered.filter(p =>
        p.nom.toLowerCase().includes(search) ||
        p.codeBarres.toLowerCase().includes(search) ||
        p.description?.toLowerCase().includes(search)
      );
    }

    if (this.statusFilter) {
      filtered = filtered.filter(p => {
        const status = this.getStatus(p).toLowerCase();
        return status.includes(this.statusFilter);
      });
    }

    if (this.categoryFilter) {
      filtered = filtered.filter(p => p.categorieId === Number(this.categoryFilter));
    }

    filtered = this.sortProducts(filtered);
    this.filteredProducts.set(filtered);
  }

  sortProducts(products: Product[]): Product[] {
    return [...products].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      if (this.sortColumn === 'categorie') {
        aValue = a.categorie?.nom || '';
        bValue = b.categorie?.nom || '';
      } else {
        aValue = a[this.sortColumn as keyof Product];
        bValue = b[this.sortColumn as keyof Product];
      }

      if (aValue === bValue) return 0;
      
      const comparison = aValue < bValue ? -1 : 1;
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  sortBy(column: keyof Product | 'categorie') {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.filterProducts();
  }

  getStatus(product: Product): string {
    if (product.quantiteStock === 0) return 'Rupture';
    if (product.quantiteStock <= product.seuilMinimum) return 'Stock faible';
    return 'En stock';
  }

  getStatusVariant(product: Product): 'success' | 'warning' | 'danger' {
    const status = this.getStatus(product);
    if (status === 'Rupture') return 'danger';
    if (status === 'Stock faible') return 'warning';
    return 'success';
  }

  hasActiveFilters(): boolean {
    return !!(this.searchText || this.statusFilter || this.categoryFilter);
  }

  clearFilters() {
    this.searchText = '';
    this.statusFilter = '';
    this.categoryFilter = '';
    this.filterProducts();
  }

  exportProducts() {
    const data = this.filteredProducts();
    const csv = this.convertToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `produits-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  private convertToCSV(data: Product[]): string {
    const headers = ['Code', 'Nom', 'Catégorie', 'Stock', 'Seuil', 'Prix', 'Statut'];
    const rows = data.map(p => [
      p.codeBarres,
      p.nom,
      p.categorie?.nom || '',
      p.quantiteStock,
      p.seuilMinimum,
      p.prixUnitaire,
      this.getStatus(p)
    ]);
    return [headers, ...rows].map(row => row.join(',')).join('\n');
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
      this.mockDataService.deleteProduct(product.id);
      this.loadProducts();
    }
  }

  saveProduct() {
    if (this.isEditing && this.currentProduct.id) {
      this.mockDataService.updateProduct(this.currentProduct.id, this.currentProduct);
      this.loadProducts();
      this.closeModal();
    } else {
      this.mockDataService.addProduct(this.currentProduct);
      this.loadProducts();
      this.closeModal();
    }
  }

  trackByProductId(index: number, product: Product): number {
    return product.id;
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
