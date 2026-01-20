import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);

  currentUser = signal<User | null>(null);
  isAuthenticated = signal<boolean>(false);

  // Mock users pour le développement
  private mockUsers = [
    {
      id: 1,
      email: 'admin@inventaire.tn',
      password: 'admin123',
      nom: 'Ben Ali',
      prenom: 'Jawher',
      role: 'Admin' as const,
      siteId: 1
    },
    {
      id: 2,
      email: 'gestionnaire@inventaire.tn',
      password: 'gest123',
      nom: 'Trabelsi',
      prenom: 'Mohamed',
      role: 'Gestionnaire' as const,
      siteId: 1
    },
    {
      id: 3,
      email: 'operateur@inventaire.tn',
      password: 'oper123',
      nom: 'Bouazizi',
      prenom: 'Ahmed',
      role: 'Operateur' as const,
      siteId: 2
    }
  ];

  constructor() {
    this.loadUser();
  }

  private loadUser(): void {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      this.currentUser.set(JSON.parse(user));
      this.isAuthenticated.set(true);
    }
  }

  login(email: string, password: string): void {
    // Mode Mock - Simulation d'authentification
    const user = this.mockUsers.find(
      u => u.email === email && u.password === password
    );

    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      const mockToken = 'mock-jwt-token-' + Date.now();
      
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      this.currentUser.set(userWithoutPassword);
      this.isAuthenticated.set(true);
      this.router.navigate(['/dashboard']);
    } else {
      alert('❌ Email ou mot de passe incorrect');
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  hasRole(roles: string[]): boolean {
    const user = this.currentUser();
    return user ? roles.includes(user.role) : false;
  }
}
