import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Notification } from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = `${environment.apiUrl}/api/notifications`;
  
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications = this.notificationsSubject.asObservable();
  
  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount = this.unreadCountSubject.asObservable();
  
  constructor(private http: HttpClient) {
    this.loadNotifications();
  }
  
  loadNotifications(): void {
    this.getNotifications().subscribe({
      next: (notifications: Notification[]) => {
        this.notificationsSubject.next(notifications);
        this.updateUnreadCount(notifications);
      },
      error: (error: any) => {
        console.error('Error loading notifications', error);
      }
    });
  }
  
  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.apiUrl);
  }
  
  getUnreadNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/unread`);
  }
  
  getUnreadCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }
  
  markAsRead(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/read`, {});
  }
  
  markAllAsRead(): Observable<any> {
    return this.http.put(`${this.apiUrl}/read-all`, {});
  }
  
  deleteNotification(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  
  clearAllNotifications(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clear-all`);
  }
  
  private updateUnreadCount(notifications: Notification[]): void {
    const unreadCount = notifications.filter(n => !n.read).length;
    this.unreadCountSubject.next(unreadCount);
  }
  
  // Method to show success toast notification
  showSuccess(title: string, message: string): void {
    // For now, this is a placeholder that logs to console
    // In a real implementation, this would use a toast component
    console.log(`SUCCESS: ${title} - ${message}`);
    // TODO: Implement actual toast notification
  }
  
  // Method to show error toast notification
  showError(title: string, message: string): void {
    // For now, this is a placeholder that logs to console
    console.log(`ERROR: ${title} - ${message}`);
    // TODO: Implement actual toast notification
  }
  
  // This method would be called when a WebSocket message is received
  addNotification(notification: Notification): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = [notification, ...currentNotifications];
    this.notificationsSubject.next(updatedNotifications);
    this.updateUnreadCount(updatedNotifications);
  }
}
