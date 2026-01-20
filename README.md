# Plateforme d'Inventaire Intelligent 📦

Application de gestion d'inventaire intelligente avec Angular et .NET

## 🚀 Technologies

### Frontend
- **Angular 17+** avec Standalone Components
- **TypeScript** pour le typage statique
- **SCSS** pour les styles
- **Signals Angular** pour la réactivité
- **HTTP Client** pour les appels API

### Backend (à venir)
- **.NET** avec architecture CQRS
- **Entity Framework Core**
- **SQL Server**

### Dashboards
- **Power BI** (à venir)

## 📋 Fonctionnalités

### ✅ Implémenté

#### 🔐 Authentification
- Connexion sécurisée avec JWT
- Gestion des rôles (Admin, Gestionnaire, Opérateur)
- Protection des routes avec AuthGuard
- Intercepteur HTTP pour injection automatique du token

#### 📊 Tableau de bord
- 6 KPIs en temps réel :
  - Total produits
  - Produits en stock
  - Produits en rupture
  - Produits en seuil critique
  - Valeur totale du stock
  - Mouvements du jour
- Liste des alertes récentes avec indicateurs visuels

#### 📦 Gestion des Produits (CRUD)
- Liste complète des produits avec filtres
- Recherche par nom, code-barres ou description
- Filtrage par statut (En stock, Critique, Rupture)
- Ajout, modification et suppression de produits
- Gestion des catégories et sites

#### 🔄 Mouvements de Stock
- Enregistrement des entrées
- Enregistrement des sorties
- Transferts entre sites
- Historique complet des mouvements
- Affichage visuel des quantités (+/-)

#### 📱 Scanner QR/Code-barres
- Interface de scan visuelle
- Saisie manuelle de code
- Affichage détaillé du produit scanné
- Actions rapides (Entrée/Sortie directe)
- Indication visuelle du niveau de stock

#### ⚠️ Gestion des Alertes
- Dashboard avec compteurs par sévérité
- Types d'alertes : Rupture, Seuil Critique, Péremption
- Système de traitement des alertes
- Indicateurs visuels de sévérité

#### 🏢 Gestion Multi-Sites (Admin)
- CRUD complet des sites/magasins
- Informations : Nom, Adresse, Téléphone
- Accès restreint aux administrateurs

## 📁 Structure du Projet

```
src/app/
├── core/
│   ├── services/
│   │   ├── api.service.ts          # Service HTTP générique
│   │   └── auth.service.ts         # Authentification et JWT
│   ├── guards/
│   │   └── auth.guard.ts           # Protection des routes
│   └── interceptors/
│       └── auth.interceptor.ts     # Injection token JWT
│
├── shared/
│   ├── components/
│   │   ├── navbar/                 # Barre de navigation
│   │   └── sidebar/                # Menu latéral
│   └── models/
│       └── index.ts                # Interfaces TypeScript
│
├── features/
│   ├── auth/
│   │   └── login.component.ts      # Page de connexion
│   ├── dashboard/
│   │   └── dashboard.component.ts  # Tableau de bord
│   ├── products/
│   │   └── products.component.ts   # Gestion produits
│   ├── stock/
│   │   └── stock.component.ts      # Mouvements stock
│   ├── scanner/
│   │   └── scanner.component.ts    # Scanner QR/Barcode
│   ├── alerts/
│   │   └── alerts.component.ts     # Gestion alertes
│   └── sites/
│       └── sites.component.ts      # Gestion sites
│
├── app.component.ts                # Layout principal
├── app.routes.ts                   # Configuration routes
└── app.config.ts                   # Configuration Angular
```

## 🛠️ Installation et Configuration

### Prérequis
- Node.js 18+ et npm
- Angular CLI 17+

### Installation

```bash
# Cloner le repository
git clone https://github.com/jawher171/Plateforme-d-Inventaire-Intelligent.git
cd Plateforme-d-Inventaire-Intelligent

# Installer les dépendances
npm install

# Installer Angular CLI globalement (si nécessaire)
npm install -g @angular/cli
```

### Configuration

Modifier le fichier `src/environments/environment.ts` pour pointer vers votre API :

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000' // URL de votre backend
};
```

### Démarrage

```bash
# Mode développement
npm start
# ou
ng serve

# L'application sera disponible sur http://localhost:4200
```

### Build

```bash
# Build de production
npm run build
# ou
ng build --configuration production

# Les fichiers seront générés dans dist/
```

## 🎨 Design

### Palette de couleurs
- **Sidebar** : #1a1a2e, #16213e
- **Success** : #4CAF50
- **Danger** : #e74c3c
- **Warning** : #f39c12
- **Info/Primary** : #2196F3
- **Secondary** : #9e9e9e

### Composants visuels
- Border-radius : 8px (inputs/boutons), 12-15px (cards)
- Box-shadow : 0 2px 8px rgba(0,0,0,0.1)
- Design responsive avec grid auto-fit

## 🔒 Sécurité

- Authentification JWT
- Protection des routes sensibles
- Gestion des rôles et permissions
- Stockage sécurisé du token
- Intercepteur HTTP automatique

## 📱 Responsive Design

L'application est entièrement responsive et s'adapte aux différentes tailles d'écran :
- Desktop (> 768px) : Layout complet avec sidebar
- Mobile (< 768px) : Sidebar condensée, layout adapté

## 🚧 Développement à venir

### Backend .NET
- API REST avec CQRS
- Entity Framework Core
- Base de données SQL Server
- Système d'alertes automatiques
- Génération de rapports

### Fonctionnalités additionnelles
- Intégration Power BI
- Rapports et statistiques avancés
- Export de données (Excel, PDF)
- Système de notifications temps réel
- Gestion des permissions granulaires
- Historique complet des actions

## 📄 License

Ce projet est sous license MIT.

## 👥 Contributeurs

- Jawher - Développeur principal

## 📞 Contact

Pour toute question ou suggestion, n'hésitez pas à ouvrir une issue sur GitHub.
