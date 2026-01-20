import { Injectable } from '@angular/core';
import { Product, StockMovement, Alert, Site, Category, DashboardKPIs } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class MockDataService {

  private sites: Site[] = [
    { id: 1, nom: 'Magasin Tunis Centre', adresse: 'Avenue Habib Bourguiba, Tunis', telephone: '71 123 456' },
    { id: 2, nom: 'Magasin Sfax', adresse: 'Route de Gabes, Sfax', telephone: '74 234 567' },
    { id: 3, nom: 'Entrepôt Sousse', adresse: 'Zone Industrielle, Sousse', telephone: '73 345 678' }
  ];

  private categories: Category[] = [
    { id: 1, nom: 'Électronique', description: 'Appareils électroniques' },
    { id: 2, nom: 'Alimentaire', description: 'Produits alimentaires' },
    { id: 3, nom: 'Textile', description: 'Vêtements et tissus' },
    { id: 4, nom: 'Mobilier', description: 'Meubles et décoration' }
  ];

  private products: Product[] = [
    { id: 1, nom: 'Laptop HP ProBook', description: 'Ordinateur portable 15.6"', codeBarres: 'LP001', quantiteStock: 25, seuilMinimum: 10, prixUnitaire: 2500, categorieId: 1, categorie: this.categories[0], siteId: 1, site: this.sites[0], dateCreation: new Date('2024-01-15') },
    { id: 2, nom: 'Smartphone Samsung A54', description: 'Téléphone Android', codeBarres: 'SM002', quantiteStock: 8, seuilMinimum: 15, prixUnitaire: 1200, categorieId: 1, categorie: this.categories[0], siteId: 1, site: this.sites[0], dateCreation: new Date('2024-02-20') },
    { id: 3, nom: 'Huile Olive Extra Vierge 1L', description: 'Huile olive tunisienne', codeBarres: 'HO003', quantiteStock: 0, seuilMinimum: 20, prixUnitaire: 35, categorieId: 2, categorie: this.categories[1], siteId: 2, site: this.sites[1], dateCreation: new Date('2024-03-10') },
    { id: 4, nom: 'T-Shirt Coton Bio', description: 'T-shirt 100% coton', codeBarres: 'TS004', quantiteStock: 150, seuilMinimum: 30, prixUnitaire: 45, categorieId: 3, categorie: this.categories[2], siteId: 1, site: this.sites[0], dateCreation: new Date('2024-04-05') },
    { id: 5, nom: 'Chaise Bureau Ergonomique', description: 'Chaise ajustable', codeBarres: 'CB005', quantiteStock: 12, seuilMinimum: 5, prixUnitaire: 450, categorieId: 4, categorie: this.categories[3], siteId: 3, site: this.sites[2], dateCreation: new Date('2024-05-18') },
    { id: 6, nom: 'Câble HDMI 2m', description: 'Câble haute définition', codeBarres: 'CH006', quantiteStock: 3, seuilMinimum: 10, prixUnitaire: 25, categorieId: 1, categorie: this.categories[0], siteId: 1, site: this.sites[0], dateCreation: new Date('2024-06-22') },
    { id: 7, nom: 'Café Moulu 500g', description: 'Café arabica', codeBarres: 'CM007', quantiteStock: 45, seuilMinimum: 25, prixUnitaire: 18, categorieId: 2, categorie: this.categories[1], siteId: 2, site: this.sites[1], dateCreation: new Date('2024-07-30') },
    { id: 8, nom: 'Bureau Bois Massif', description: 'Bureau 140x70cm', codeBarres: 'BB008', quantiteStock: 0, seuilMinimum: 3, prixUnitaire: 890, categorieId: 4, categorie: this.categories[3], siteId: 3, site: this.sites[2], dateCreation: new Date('2024-08-14') }
  ];

  private movements: StockMovement[] = [
    { id: 1, type: 'Entree', quantite: 50, motif: 'Réception fournisseur', produitId: 1, produit: this.products[0], siteId: 1, site: this.sites[0], dateMouvement: new Date('2024-12-01'), userId: 1 },
    { id: 2, type: 'Sortie', quantite: 5, motif: 'Vente client', produitId: 2, produit: this.products[1], siteId: 1, site: this.sites[0], dateMouvement: new Date('2024-12-05'), userId: 2 },
    { id: 3, type: 'Transfert', quantite: 20, motif: 'Transfert inter-magasin', produitId: 4, produit: this.products[3], siteId: 1, site: this.sites[0], siteDestinationId: 2, dateMouvement: new Date('2024-12-10'), userId: 1 },
    { id: 4, type: 'Entree', quantite: 100, motif: 'Nouvelle livraison', produitId: 7, produit: this.products[6], siteId: 2, site: this.sites[1], dateMouvement: new Date('2024-12-15'), userId: 2 },
    { id: 5, type: 'Sortie', quantite: 2, motif: 'Commande en ligne', produitId: 5, produit: this.products[4], siteId: 3, site: this.sites[2], dateMouvement: new Date('2024-12-18'), userId: 3 },
    { id: 6, type: 'Sortie', quantite: 10, motif: 'Vente magasin', produitId: 1, produit: this.products[0], siteId: 1, site: this.sites[0], dateMouvement: new Date(), userId: 2 },
    { id: 7, type: 'Entree', quantite: 25, motif: 'Réapprovisionnement', produitId: 6, produit: this.products[5], siteId: 1, site: this.sites[0], dateMouvement: new Date(), userId: 1 }
  ];

  private alerts: Alert[] = [
    { id: 1, type: 'Rupture', message: 'Stock épuisé - Réapprovisionnement urgent', severite: 'Critique', estTraitee: false, produitId: 3, produit: this.products[2], siteId: 2, dateCreation: new Date('2024-12-19') },
    { id: 2, type: 'Rupture', message: 'Stock épuisé', severite: 'Critique', estTraitee: false, produitId: 8, produit: this.products[7], siteId: 3, dateCreation: new Date('2024-12-18') },
    { id: 3, type: 'SeuilCritique', message: 'Stock en dessous du seuil minimum', severite: 'Haute', estTraitee: false, produitId: 2, produit: this.products[1], siteId: 1, dateCreation: new Date('2024-12-17') },
    { id: 4, type: 'SeuilCritique', message: 'Niveau de stock critique', severite: 'Haute', estTraitee: false, produitId: 6, produit: this.products[5], siteId: 1, dateCreation: new Date('2024-12-16') },
    { id: 5, type: 'SeuilCritique', message: 'Attention: seuil minimum atteint', severite: 'Moyenne', estTraitee: false, produitId: 7, produit: this.products[6], siteId: 2, dateCreation: new Date('2024-12-15') }
  ];

  // Getters
  getSites(): Site[] { return [...this.sites]; }
  getCategories(): Category[] { return [...this.categories]; }
  getProducts(): Product[] { return [...this.products]; }
  getMovements(): StockMovement[] { return [...this.movements].sort((a, b) => new Date(b.dateMouvement).getTime() - new Date(a.dateMouvement).getTime()); }
  getAlerts(): Alert[] { return [...this.alerts].filter(a => !a.estTraitee); }

  getProductByBarcode(code: string): Product | undefined {
    return this.products.find(p => p.codeBarres === code);
  }

  getDashboardKPIs(): DashboardKPIs {
    const today = new Date().toDateString();
    return {
      totalProduits: this.products.length,
      produitsEnStock: this.products.filter(p => p.quantiteStock > p.seuilMinimum).length,
      produitsEnRupture: this.products.filter(p => p.quantiteStock === 0).length,
      produitsSeuilCritique: this.products.filter(p => p.quantiteStock > 0 && p.quantiteStock <= p.seuilMinimum).length,
      valeurTotaleStock: this.products.reduce((sum, p) => sum + (p.quantiteStock * p.prixUnitaire), 0),
      mouvementsAujourdhui: this.movements.filter(m => new Date(m.dateMouvement).toDateString() === today).length,
      alertesActives: this.alerts.filter(a => !a.estTraitee).length
    };
  }

  // Actions
  addProduct(product: Partial<Product>): Product {
    const newProduct: Product = {
      ...product as Product,
      id: Math.max(...this.products.map(p => p.id)) + 1,
      dateCreation: new Date()
    };
    this.products.push(newProduct);
    return newProduct;
  }

  updateProduct(id: number, data: Partial<Product>): void {
    const index = this.products.findIndex(p => p.id === id);
    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...data };
    }
  }

  deleteProduct(id: number): void {
    const index = this.products.findIndex(p => p.id === id);
    if (index !== -1) {
      this.products.splice(index, 1);
    }
  }

  addMovement(movement: Partial<StockMovement>): void {
    const product = this.products.find(p => p.id === movement.produitId);
    if (product) {
      // Update stock
      if (movement.type === 'Entree') {
        product.quantiteStock += movement.quantite || 0;
      } else if (movement.type === 'Sortie') {
        product.quantiteStock -= movement.quantite || 0;
      }
      
      // Add movement record
      const newMovement: StockMovement = {
        ...movement as StockMovement,
        id: Math.max(...this.movements.map(m => m.id)) + 1,
        produit: product,
        dateMouvement: new Date()
      };
      this.movements.unshift(newMovement);
    }
  }

  treatAlert(id: number): void {
    const alert = this.alerts.find(a => a.id === id);
    if (alert) {
      alert.estTraitee = true;
    }
  }
}
