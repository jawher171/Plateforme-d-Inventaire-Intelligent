// User
export interface User {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  role: 'Admin' | 'Gestionnaire' | 'Operateur';
  siteId?: number;
}

// Product
export interface Product {
  id: number;
  nom: string;
  description?: string;
  codeBarres: string;
  qrCode?: string;
  quantiteStock: number;
  seuilMinimum: number;
  prixUnitaire: number;
  categorieId: number;
  categorie?: Category;
  siteId: number;
  site?: Site;
  dateCreation: Date;
}

// Category
export interface Category {
  id: number;
  nom: string;
  description?: string;
}

// Site
export interface Site {
  id: number;
  nom: string;
  adresse: string;
  telephone?: string;
}

// StockMovement
export interface StockMovement {
  id: number;
  type: 'Entree' | 'Sortie' | 'Transfert';
  quantite: number;
  motif?: string;
  produitId: number;
  produit?: Product;
  siteId: number;
  site?: Site;
  siteDestinationId?: number;
  dateMouvement: Date;
  userId: number;
}

// Alert
export interface Alert {
  id: number;
  type: 'Rupture' | 'SeuilCritique' | 'Peremption';
  message: string;
  severite: 'Critique' | 'Haute' | 'Moyenne' | 'Basse';
  estTraitee: boolean;
  produitId: number;
  produit?: Product;
  siteId: number;
  dateCreation: Date;
}

// DashboardKPIs
export interface DashboardKPIs {
  totalProduits: number;
  produitsEnStock: number;
  produitsEnRupture: number;
  produitsSeuilCritique: number;
  valeurTotaleStock: number;
  mouvementsAujourdhui: number;
  alertesActives: number;
}

// Login Request/Response
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}
