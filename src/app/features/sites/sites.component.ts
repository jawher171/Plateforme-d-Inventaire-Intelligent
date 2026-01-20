import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../core/services/mock-data.service';
import { Site } from '../../shared/models';

@Component({
  selector: 'app-sites',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="page-header">
        <h1>Gestion des Sites</h1>
        <button class="btn btn-primary" (click)="openModal()">
          <span>+ Nouveau site</span>
        </button>
      </div>

      <div class="sites-grid">
        <div *ngFor="let site of sites()" class="site-card">
          <div class="site-icon">🏢</div>
          <div class="site-info">
            <h3>{{ site.nom }}</h3>
            <div class="site-details">
              <div class="detail">
                <span class="icon">📍</span>
                <span>{{ site.adresse }}</span>
              </div>
              <div class="detail" *ngIf="site.telephone">
                <span class="icon">📞</span>
                <span>{{ site.telephone }}</span>
              </div>
            </div>
          </div>
          <div class="site-actions">
            <button class="btn-icon" (click)="editSite(site)" title="Modifier">✏️</button>
            <button class="btn-icon danger" (click)="deleteSite(site)" title="Supprimer">🗑️</button>
          </div>
        </div>

        <div *ngIf="sites().length === 0" class="no-sites">
          <span class="icon">🏢</span>
          <p>Aucun site créé</p>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div class="modal-overlay" *ngIf="showModal" (click)="closeModal()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>{{ isEditing ? 'Modifier' : 'Nouveau' }} site</h2>
          <button class="close-btn" (click)="closeModal()">×</button>
        </div>

        <form (ngSubmit)="saveSite()">
          <div class="form-group">
            <label>Nom du site *</label>
            <input type="text" [(ngModel)]="currentSite.nom" name="nom" required>
          </div>

          <div class="form-group">
            <label>Adresse *</label>
            <input type="text" [(ngModel)]="currentSite.adresse" name="adresse" required>
          </div>

          <div class="form-group">
            <label>Téléphone</label>
            <input type="tel" [(ngModel)]="currentSite.telephone" name="telephone">
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

    .sites-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
    }

    .site-card {
      background: white;
      border-radius: 15px;
      padding: 25px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      display: flex;
      gap: 20px;
      align-items: flex-start;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .site-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    }

    .site-icon {
      font-size: 48px;
      line-height: 1;
    }

    .site-info {
      flex: 1;
    }

    .site-info h3 {
      margin: 0 0 15px 0;
      color: #333;
      font-size: 20px;
      font-weight: 600;
    }

    .site-details {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .detail {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #666;
      font-size: 14px;
    }

    .detail .icon {
      font-size: 16px;
    }

    .site-actions {
      display: flex;
      gap: 5px;
    }

    .btn-icon {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 18px;
      padding: 8px;
      border-radius: 6px;
      transition: background-color 0.3s;
    }

    .btn-icon:hover {
      background-color: #f0f0f0;
    }

    .btn-icon.danger:hover {
      background-color: #fee;
    }

    .no-sites {
      grid-column: 1 / -1;
      text-align: center;
      padding: 80px 20px;
      background: white;
      border-radius: 15px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .no-sites .icon {
      font-size: 72px;
      display: block;
      margin-bottom: 20px;
      opacity: 0.3;
    }

    .no-sites p {
      font-size: 18px;
      color: #999;
      margin: 0;
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

      .sites-grid {
        grid-template-columns: 1fr;
      }

      .site-card {
        flex-direction: column;
        align-items: flex-start;
      }

      .site-actions {
        width: 100%;
        justify-content: flex-end;
      }
    }
  `]
})
export class SitesComponent implements OnInit {
  sites = signal<Site[]>([]);
  showModal = false;
  isEditing = false;
  currentSite: Partial<Site> = this.getEmptySite();

  constructor(private mockDataService: MockDataService) {}

  ngOnInit() {
    this.loadSites();
  }

  loadSites() {
    const sitesData = this.mockDataService.getSites();
    this.sites.set(sitesData);
  }

  openModal(site?: Site) {
    this.showModal = true;
    if (site) {
      this.isEditing = true;
      this.currentSite = { ...site };
    } else {
      this.isEditing = false;
      this.currentSite = this.getEmptySite();
    }
  }

  closeModal() {
    this.showModal = false;
    this.currentSite = this.getEmptySite();
  }

  editSite(site: Site) {
    this.openModal(site);
  }

  deleteSite(site: Site) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le site "${site.nom}" ?`)) {
      alert('La suppression des sites n\'est pas encore disponible en mode mock');
    }
  }

  saveSite() {
    if (this.isEditing && this.currentSite.id) {
      alert('La modification des sites n\'est pas encore disponible en mode mock');
      this.closeModal();
    } else {
      alert('La création de nouveaux sites n\'est pas encore disponible en mode mock');
      this.closeModal();
    }
  }

  private getEmptySite(): Partial<Site> {
    return {
      nom: '',
      adresse: '',
      telephone: ''
    };
  }
}
