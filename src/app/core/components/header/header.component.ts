import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { User } from '../../models/user.model';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <a class="navbar-brand" routerLink="/">Job Hunt</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link" routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/jobs" routerLinkActive="active">Jobs</a>
            </li>
            
            <!-- Recruiter Only Links -->
            <li class="nav-item" *ngIf="isRecruiter">
              <a class="nav-link" routerLink="/recruiter" routerLinkActive="active">Dashboard</a>
            </li>
            <li class="nav-item" *ngIf="isRecruiter">
              <a class="nav-link" routerLink="/recruiter/jobs/new" routerLinkActive="active">Post Job</a>
            </li>
            
            <!-- Job Seeker Only Links -->
            <li class="nav-item" *ngIf="isJobSeeker">
              <a class="nav-link" routerLink="/job-seeker" routerLinkActive="active">Dashboard</a>
            </li>
          </ul>
          
          <ul class="navbar-nav ms-auto">
            <!-- Logged Out Links -->
            <li class="nav-item" *ngIf="!isLoggedIn">
              <a class="nav-link" routerLink="/login" routerLinkActive="active">Login</a>
            </li>
            <li class="nav-item" *ngIf="!isLoggedIn">
              <a class="nav-link" routerLink="/register" routerLinkActive="active">Register</a>
            </li>
            
            <!-- Logged In Links -->
            <li class="nav-item" *ngIf="isLoggedIn">
              <a class="nav-link position-relative" routerLink="/notifications" routerLinkActive="active">
                <i class="bi bi-bell"></i>
                <span class="notification-badge" *ngIf="unreadCount > 0">{{ unreadCount }}</span>
              </a>
            </li>
            <li class="nav-item" *ngIf="isLoggedIn">
              <a class="nav-link" routerLink="/profile" routerLinkActive="active">Profile</a>
            </li>
            <li class="nav-item" *ngIf="isLoggedIn">
              <a class="nav-link" (click)="logout()" style="cursor: pointer;">Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .notification-badge {
      position: absolute;
      top: -5px;
      right: -5px;
      background-color: #dc3545;
      color: white;
      border-radius: 50%;
      padding: 0.25em 0.6em;
      font-size: 0.75em;
    }
  `]
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  isRecruiter = false;
  isJobSeeker = false;
  unreadCount = 0;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe((user: User | null) => {
      this.isLoggedIn = !!user;
      this.isRecruiter = this.authService.isRecruiter();
      this.isJobSeeker = this.authService.isJobSeeker();
      
      if (this.isLoggedIn) {
        this.loadUnreadCount();
      }
    });
  }

  loadUnreadCount(): void {
    this.notificationService.getUnreadCount().subscribe(count => {
      this.unreadCount = count;
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
