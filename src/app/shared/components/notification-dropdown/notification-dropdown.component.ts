import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NotificationService } from '../../../core/services/notification.service';
import { Notification } from '../../../core/models/notification.model';

@Component({
  selector: 'app-notification-dropdown',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dropdown">
      <button 
        class="btn btn-link position-relative"
        (click)="toggleDropdown($event)">
        <i class="bi bi-bell fs-5"></i>
        <span 
          *ngIf="unreadCount > 0" 
          class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
          {{ unreadCount > 9 ? '9+' : unreadCount }}
          <span class="visually-hidden">unread notifications</span>
        </span>
      </button>
      
      <div 
        class="dropdown-menu dropdown-menu-end notification-dropdown" 
        [class.show]="isOpen">
        <div class="d-flex justify-content-between align-items-center px-3 py-2 border-bottom">
          <h6 class="mb-0">Notifications</h6>
          <button 
            class="btn btn-sm btn-link text-decoration-none" 
            (click)="markAllAsRead()"
            *ngIf="unreadCount > 0">
            Mark all as read
          </button>
        </div>
        
        <div class="notification-list" *ngIf="notifications.length > 0">
          <a 
            *ngFor="let notification of notifications" 
            class="dropdown-item notification-item" 
            [class.unread]="!notification.read"
            [routerLink]="notification.link ? [notification.link] : []"
            (click)="handleNotificationClick(notification, $event)">
            <div class="d-flex">
              <div class="notification-icon me-3">
                <i class="bi" [ngClass]="getIconClass(notification.type)"></i>
              </div>
              <div class="notification-content flex-grow-1">
                <p class="mb-1">{{ notification.message }}</p>
                <small class="text-muted">{{ notification.createdAt | date:'short' }}</small>
              </div>
            </div>
          </a>
        </div>
        
        <div class="text-center p-3" *ngIf="notifications.length === 0">
          <p class="text-muted mb-0">No notifications</p>
        </div>
        
        <div class="border-top p-2 text-center">
          <a routerLink="/notifications" class="btn btn-sm btn-link text-decoration-none">
            View all notifications
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .notification-dropdown {
      width: 320px;
      max-height: 400px;
      overflow-y: auto;
    }
    
    .notification-item {
      padding: 0.75rem 1rem;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    }
    
    .notification-item:last-child {
      border-bottom: none;
    }
    
    .notification-item.unread {
      background-color: rgba(13, 110, 253, 0.05);
    }
    
    .notification-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background-color: rgba(13, 110, 253, 0.1);
      color: #0d6efd;
    }
    
    .notification-icon i {
      font-size: 1.2rem;
    }
  `]
})
export class NotificationDropdownComponent implements OnInit {
  notifications: Notification[] = [];
  unreadCount = 0;
  isOpen = false;
  
  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.notificationService.notifications.subscribe((notifications: Notification[]) => {
      this.notifications = notifications.slice(0, 5); // Show only the 5 most recent
    });
    
    this.notificationService.unreadCount.subscribe((count: number) => {
      this.unreadCount = count;
    });
  }

  toggleDropdown(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.isOpen = !this.isOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    // Close the dropdown when clicking outside
    if (!(event.target as HTMLElement).closest('.dropdown')) {
      this.isOpen = false;
    }
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe(() => {
      this.notificationService.loadNotifications();
    });
  }

  handleNotificationClick(notification: Notification, event: Event): void {
    if (!notification.read) {
      // Mark as read when clicked
      this.notificationService.markAsRead(notification.id).subscribe(() => {
        notification.read = true;
        this.notificationService.loadNotifications();
      });
    }
    
    // If no link, prevent navigation
    if (!notification.link) {
      event.preventDefault();
    }
  }

  getIconClass(type: string): string {
    switch (type) {
      case 'INFO':
        return 'bi-info-circle text-primary';
      case 'SUCCESS':
        return 'bi-check-circle text-success';
      case 'WARNING':
        return 'bi-exclamation-triangle text-warning';
      case 'ERROR':
        return 'bi-x-circle text-danger';
      default:
        return 'bi-bell text-primary';
    }
  }
}
