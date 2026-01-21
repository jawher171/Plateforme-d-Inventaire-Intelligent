import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type BadgeVariant = 'primary' | 'success' | 'danger' | 'warning' | 'info' | 'secondary';
type BadgeSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-animated-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span 
      class="animated-badge"
      [class]="'badge-' + variant + ' badge-' + size"
      [class.pulse-animation]="pulse"
      [class.gradient]="gradient"
    >
      <ng-content></ng-content>
    </span>
  `,
  styles: [`
    .animated-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-xs) var(--spacing-md);
      border-radius: var(--radius-full);
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      transition: all var(--transition-base);
      white-space: nowrap;
    }

    /* Sizes */
    .badge-sm {
      font-size: var(--font-size-xs);
      padding: 2px var(--spacing-sm);
    }

    .badge-md {
      font-size: var(--font-size-xs);
      padding: var(--spacing-xs) var(--spacing-md);
    }

    .badge-lg {
      font-size: var(--font-size-sm);
      padding: var(--spacing-sm) var(--spacing-lg);
    }

    /* Variants - Solid */
    .badge-primary {
      background-color: var(--color-primary-50);
      color: var(--color-primary-700);
      border: 1px solid var(--color-primary-200);
    }

    .badge-primary.gradient {
      background: var(--gradient-primary);
      color: white;
      border: none;
      box-shadow: var(--shadow-blue);
    }

    .badge-success {
      background-color: var(--color-success-50);
      color: var(--color-success-700);
      border: 1px solid var(--color-success-200);
    }

    .badge-success.gradient {
      background: var(--gradient-success);
      color: white;
      border: none;
      box-shadow: var(--shadow-green);
    }

    .badge-danger {
      background-color: var(--color-danger-50);
      color: var(--color-danger-700);
      border: 1px solid var(--color-danger-200);
    }

    .badge-danger.gradient {
      background: var(--gradient-danger);
      color: white;
      border: none;
      box-shadow: var(--shadow-red);
    }

    .badge-warning {
      background-color: var(--color-warning-50);
      color: var(--color-warning-700);
      border: 1px solid var(--color-warning-200);
    }

    .badge-warning.gradient {
      background: var(--gradient-warning);
      color: white;
      border: none;
      box-shadow: var(--shadow-orange);
    }

    .badge-info {
      background-color: var(--color-info-50);
      color: var(--color-info-700);
      border: 1px solid var(--color-info-200);
    }

    .badge-secondary {
      background-color: var(--color-gray-100);
      color: var(--color-gray-700);
      border: 1px solid var(--color-gray-300);
    }

    /* Pulse Animation */
    .pulse-animation {
      animation: badge-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    @keyframes badge-pulse {
      0%, 100% {
        transform: scale(1);
        opacity: 1;
      }
      50% {
        transform: scale(1.05);
        opacity: 0.9;
      }
    }

    /* Hover Effects */
    .animated-badge:hover {
      transform: translateY(-1px);
      box-shadow: var(--shadow-md);
    }

    .animated-badge.gradient:hover {
      filter: brightness(1.1);
    }
  `]
})
export class AnimatedBadgeComponent {
  @Input() variant: BadgeVariant = 'primary';
  @Input() size: BadgeSize = 'md';
  @Input() pulse = false;
  @Input() gradient = false;
}
