import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { slideDown } from '../../animations/animations';

interface Store {
  id: string;
  name: string;
  location: string;
  icon: string;
}

@Component({
  selector: 'app-store-selector',
  standalone: true,
  imports: [CommonModule],
  animations: [slideDown],
  template: `
    <div class="store-selector">
      <button class="selector-button" (click)="toggleDropdown()" [class.active]="isOpen()">
        <div class="store-icon">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 3L3 9l7 6 7-6-7-6zm0 2.83L14.17 9 10 12.17 5.83 9 10 5.83zM3 11l7 6 7-6v7l-7 6-7-6v-7z"/>
          </svg>
        </div>
        <div class="store-info">
          <div class="store-name">{{ selectedStore().name }}</div>
          <div class="store-location">{{ selectedStore().location }}</div>
        </div>
        <div class="dropdown-icon" [class.rotate]="isOpen()">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4 6l4 4 4-4H4z"/>
          </svg>
        </div>
      </button>

      <div class="dropdown-menu" *ngIf="isOpen()" @slideDown>
        <div 
          class="dropdown-item" 
          *ngFor="let store of stores" 
          (click)="selectStore(store)"
          [class.selected]="selectedStore().id === store.id"
        >
          <div class="store-icon-small">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 2L2 7l6 5 6-5-6-5zm0 2.27L11.73 7 8 9.73 4.27 7 8 4.27zM2 9l6 5 6-5v6l-6 5-6-5V9z"/>
            </svg>
          </div>
          <div class="store-details">
            <div class="store-name-item">{{ store.name }}</div>
            <div class="store-location-item">{{ store.location }}</div>
          </div>
          <div class="checkmark" *ngIf="selectedStore().id === store.id">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M13.485 3.929a1 1 0 0 1 .086 1.414l-6 7a1 1 0 0 1-1.5 0l-3-3.5a1 1 0 1 1 1.5-1.286L6 9.793l5.071-5.95a1 1 0 0 1 1.414-.086z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div class="backdrop" *ngIf="isOpen()" (click)="toggleDropdown()"></div>
  `,
  styles: [`
    .store-selector {
      position: relative;
    }

    .selector-button {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      padding: var(--spacing-sm) var(--spacing-lg);
      background: var(--color-bg-secondary);
      border: 2px solid var(--color-border-light);
      border-radius: var(--radius-lg);
      cursor: pointer;
      transition: all var(--transition-base);
      font-family: var(--font-family-primary);
      min-width: 240px;
    }

    .selector-button:hover {
      background: var(--color-bg-primary);
      border-color: var(--color-primary-400);
      box-shadow: var(--shadow-md);
    }

    .selector-button.active {
      border-color: var(--color-primary-500);
      box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
    }

    .store-icon {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600));
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      flex-shrink: 0;
      box-shadow: var(--shadow-sm);
    }

    .store-info {
      flex: 1;
      text-align: left;
      min-width: 0;
    }

    .store-name {
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-sm);
      color: var(--color-text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .store-location {
      font-size: var(--font-size-xs);
      color: var(--color-text-tertiary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .dropdown-icon {
      color: var(--color-text-tertiary);
      transition: transform var(--transition-base);
      flex-shrink: 0;
    }

    .dropdown-icon.rotate {
      transform: rotate(180deg);
    }

    .dropdown-menu {
      position: absolute;
      top: calc(100% + 8px);
      left: 0;
      right: 0;
      background: var(--color-bg-primary);
      border: 1px solid var(--color-border-light);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-xl);
      overflow: hidden;
      z-index: var(--z-index-dropdown);
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      padding: var(--spacing-md) var(--spacing-lg);
      cursor: pointer;
      transition: all var(--transition-base);
      border-bottom: 1px solid var(--color-border-light);
    }

    .dropdown-item:last-child {
      border-bottom: none;
    }

    .dropdown-item:hover {
      background: var(--color-gray-50);
    }

    .dropdown-item.selected {
      background: linear-gradient(90deg, rgba(33, 150, 243, 0.05), transparent);
    }

    .store-icon-small {
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, var(--color-primary-400), var(--color-primary-500));
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      flex-shrink: 0;
    }

    .store-details {
      flex: 1;
      min-width: 0;
    }

    .store-name-item {
      font-weight: var(--font-weight-medium);
      font-size: var(--font-size-sm);
      color: var(--color-text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .store-location-item {
      font-size: var(--font-size-xs);
      color: var(--color-text-tertiary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .checkmark {
      color: var(--color-success-600);
      flex-shrink: 0;
    }

    .backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: calc(var(--z-index-dropdown) - 1);
    }

    @media (max-width: 768px) {
      .selector-button {
        min-width: 180px;
      }
    }
  `]
})
export class StoreSelectorComponent {
  isOpen = signal(false);
  
  stores: Store[] = [
    { id: '1', name: 'Magasin Principal', location: 'Paris', icon: '🏪' },
    { id: '2', name: 'Entrepôt Lyon', location: 'Lyon', icon: '🏭' },
    { id: '3', name: 'Point de Vente', location: 'Marseille', icon: '🏬' },
    { id: '4', name: 'Centre de Distribution', location: 'Bordeaux', icon: '📦' }
  ];

  selectedStore = signal<Store>(this.stores[0]);

  toggleDropdown() {
    this.isOpen.update(v => !v);
  }

  selectStore(store: Store) {
    this.selectedStore.set(store);
    this.isOpen.set(false);
  }
}
