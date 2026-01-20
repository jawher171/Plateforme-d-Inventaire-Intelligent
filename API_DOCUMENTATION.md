# API Endpoints Documentation

This document lists all the API endpoints that the backend .NET application needs to implement for the Angular frontend to work correctly.

## Base URL
```
http://localhost:5000
```

## Authentication

### POST /api/auth/login
Login endpoint
- **Body**: `{ email: string, password: string }`
- **Response**: `{ token: string, user: User }`

## Dashboard

### GET /api/dashboard/kpis
Get dashboard KPIs
- **Response**: `DashboardKPIs`

## Products

### GET /api/products
Get all products
- **Response**: `Product[]`

### GET /api/products/:id
Get product by ID
- **Response**: `Product`

### GET /api/products/barcode/:code
Get product by barcode
- **Response**: `Product`

### POST /api/products
Create new product
- **Body**: `Product`
- **Response**: `Product`

### PUT /api/products/:id
Update product
- **Body**: `Product`
- **Response**: `Product`

### DELETE /api/products/:id
Delete product
- **Response**: `void`

## Categories

### GET /api/categories
Get all categories
- **Response**: `Category[]`

### POST /api/categories
Create new category
- **Body**: `Category`
- **Response**: `Category`

### PUT /api/categories/:id
Update category
- **Body**: `Category`
- **Response**: `Category`

### DELETE /api/categories/:id
Delete category
- **Response**: `void`

## Sites

### GET /api/sites
Get all sites
- **Response**: `Site[]`

### POST /api/sites
Create new site
- **Body**: `Site`
- **Response**: `Site`

### PUT /api/sites/:id
Update site
- **Body**: `Site`
- **Response**: `Site`

### DELETE /api/sites/:id
Delete site
- **Response**: `void`

## Stock Movements

### GET /api/stock-movements
Get all stock movements
- **Response**: `StockMovement[]`

### POST /api/stock-movements
Create new stock movement
- **Body**: `StockMovement`
- **Response**: `StockMovement`

## Alerts

### GET /api/alerts
Get all alerts
- **Query params**: `{ limit?: number }`
- **Response**: `Alert[]`

### PUT /api/alerts/:id/handle
Mark alert as handled
- **Response**: `Alert`

## Data Models

### User
```typescript
{
  id: number;
  email: string;
  nom: string;
  prenom: string;
  role: 'Admin' | 'Gestionnaire' | 'Operateur';
  siteId?: number;
}
```

### Product
```typescript
{
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
```

### Category
```typescript
{
  id: number;
  nom: string;
  description?: string;
}
```

### Site
```typescript
{
  id: number;
  nom: string;
  adresse: string;
  telephone?: string;
}
```

### StockMovement
```typescript
{
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
```

### Alert
```typescript
{
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
```

### DashboardKPIs
```typescript
{
  totalProduits: number;
  produitsEnStock: number;
  produitsEnRupture: number;
  produitsSeuilCritique: number;
  valeurTotaleStock: number;
  mouvementsAujourdhui: number;
  alertesActives: number;
}
```

## Authentication

All API requests (except `/api/auth/login`) should include a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

The frontend includes an HTTP interceptor that automatically adds this header to all requests.

## CORS Configuration

The backend should allow CORS requests from the Angular development server:

```
http://localhost:4200
```

## Error Handling

All endpoints should return appropriate HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

Error responses should include a message:
```json
{
  "message": "Error description",
  "error": "Detailed error information"
}
```
