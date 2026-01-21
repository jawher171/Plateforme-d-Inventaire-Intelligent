import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-live-status',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="live-status">
      <div class="status-indicator">
        <div class="pulse-ring"></div>
        <div class="pulse-dot"></div>
      </div>
      <div class="status-info">
        <div class="status-text">Système en Ligne</div>
        <div class="sync-time">Dernière sync: {{ lastSync() }}</div>
      </div>
    </div>
  `,
  styles: [`
    .live-status {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      padding: var(--spacing-md);
      background: rgba(16, 185, 129, 0.1);
      border-radius: var(--radius-lg);
      border: 1px solid rgba(16, 185, 129, 0.2);
    }

    .status-indicator {
      position: relative;
      width: 24px;
      height: 24px;
      flex-shrink: 0;
    }

    .pulse-ring {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: rgba(16, 185, 129, 0.3);
      animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    @keyframes pulse-ring {
      0%, 100% {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
      }
      50% {
        transform: translate(-50%, -50%) scale(1.5);
        opacity: 0;
      }
    }

    .pulse-dot {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--color-success-500);
      box-shadow: 0 0 8px rgba(16, 185, 129, 0.6);
      animation: pulse-dot 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    @keyframes pulse-dot {
      0%, 100% {
        transform: translate(-50%, -50%) scale(1);
      }
      50% {
        transform: translate(-50%, -50%) scale(1.1);
      }
    }

    .status-info {
      flex: 1;
      min-width: 0;
    }

    .status-text {
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-sm);
      color: var(--color-success-700);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .sync-time {
      font-size: var(--font-size-xs);
      color: var(--color-success-600);
      opacity: 0.8;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `]
})
export class LiveStatusComponent implements OnInit, OnDestroy {
  lastSync = signal('maintenant');
  private intervalId?: any;

  ngOnInit() {
    // Update the sync time every 10 seconds
    this.intervalId = setInterval(() => {
      this.updateSyncTime();
    }, 10000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private updateSyncTime() {
    const now = new Date();
    const seconds = now.getSeconds();
    
    if (seconds < 10) {
      this.lastSync.set('maintenant');
    } else if (seconds < 30) {
      this.lastSync.set('il y a quelques secondes');
    } else {
      this.lastSync.set('il y a ' + Math.floor(seconds / 10) * 10 + 's');
    }
  }
}
