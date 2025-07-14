import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationDropdownComponent } from '../notification-dropdown/notification-dropdown.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, NotificationDropdownComponent],
  template: `
    <header>
      <nav class="navbar navbar-expand-lg navbar-light bg-white shadow">
        <div class="container">
          <a class="navbar-brand d-flex align-items-center" routerLink="/">
            <i class="bi bi-briefcase-fill text-primary me-2" style="font-size: 1.5rem;"></i>
            <span class="fw-bold" style="font-size: 1.5rem; background: linear-gradient(135deg, var(--primary-color), var(--secondary-color)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">JobHunt</span>
          </a>
          
          <button 
            class="navbar-toggler border-0" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarContent" 
            aria-controls="navbarContent" 
            aria-expanded="false" 
            aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          
          <div class="collapse navbar-collapse" id="navbarContent">
            <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <a 
                  class="nav-link px-3 py-2 mx-1 position-relative" 
                  routerLink="/" 
                  routerLinkActive="active" 
                  [routerLinkActiveOptions]="{exact: true}">
                  <i class="bi bi-house me-1"></i> Home
                  <span class="position-absolute bottom-0 start-50 translate-middle-x" style="height: 3px; width: 0; background: var(--primary-color); transition: width 0.3s;"></span>
                </a>
              </li>
              <li class="nav-item">
                <a 
                  class="nav-link px-3 py-2 mx-1 position-relative" 
                  routerLink="/jobs" 
                  routerLinkActive="active" 
                  [routerLinkActiveOptions]="{exact: true}">
                  <i class="bi bi-briefcase me-1"></i> Jobs
                  <span class="position-absolute bottom-0 start-50 translate-middle-x" style="height: 3px; width: 0; background: var(--primary-color); transition: width 0.3s;"></span>
                </a>
              </li>
              <li class="nav-item" *ngIf="isRecruiter()">
                <a 
                  class="nav-link px-3 py-2 mx-1 position-relative" 
                  routerLink="/recruiter" 
                  routerLinkActive="active" 
                  [routerLinkActiveOptions]="{exact: true}">
                  <i class="bi bi-building me-1"></i> Dashboard
                  <span class="position-absolute bottom-0 start-50 translate-middle-x" style="height: 3px; width: 0; background: var(--primary-color); transition: width 0.3s;"></span>
                </a>
              </li>
            </ul>
            
            <!-- Not logged in -->
            <div class="d-flex" *ngIf="!isLoggedIn()">
              <a routerLink="/login" class="btn btn-outline-primary me-2">
                <i class="bi bi-box-arrow-in-right me-1"></i> Login
              </a>
              <a routerLink="/register" class="btn btn-primary">
                <i class="bi bi-person-plus me-1"></i> Register
              </a>
            </div>
            
            <!-- Logged in -->
            <div class="d-flex align-items-center" *ngIf="isLoggedIn()">
              <!-- Notifications -->
              <app-notification-dropdown class="me-3"></app-notification-dropdown>
              
              <!-- User dropdown -->
              <div class="dropdown">
                <a 
                  class="dropdown-toggle d-flex align-items-center text-decoration-none" 
                  href="#" 
                  role="button" 
                  id="userDropdown" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false">
                  <div class="avatar-circle me-2" style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, var(--primary-color), var(--secondary-color)); color: white; display: flex; align-items: center; justify-content: center; font-weight: 600;">
                    {{ getInitials() }}
                  </div>
                  <span class="d-none d-md-inline fw-medium">{{ getUserName() }}</span>
                </a>
                
                <ul class="dropdown-menu dropdown-menu-end shadow border-0 rounded-3 mt-2" aria-labelledby="userDropdown" style="min-width: 200px;">
                  <li><h6 class="dropdown-header text-primary">User Menu</h6></li>
                  <li><a class="dropdown-item py-2" routerLink="/profile"><i class="bi bi-person me-2"></i> My Profile</a></li>
                  <li *ngIf="isJobSeeker()"><a class="dropdown-item py-2" routerLink="/job-seeker/applications"><i class="bi bi-file-earmark-text me-2"></i> My Applications</a></li>
                  <li *ngIf="isRecruiter()"><a class="dropdown-item py-2" routerLink="/recruiter"><i class="bi bi-building me-2"></i> Recruiter Dashboard</a></li>
                  <li><hr class="dropdown-divider"></li>
                  <li><a class="dropdown-item py-2 text-danger" href="#" (click)="logout($event)"><i class="bi bi-box-arrow-right me-2"></i> Logout</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  `,
  styles: [`
    .avatar-circle {
      width: 36px;
      height: 36px;
      background-color: #007bff;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 500;
    }
    
    .navbar-nav .nav-link.active {
      color: #007bff;
      font-weight: 500;
    }
  `]
})
export class HeaderComponent implements OnInit {
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  isJobSeeker(): boolean {
    return this.authService.isJobSeeker();
  }

  isRecruiter(): boolean {
    return this.authService.isRecruiter();
  }

  getUserName(): string {
    const user = this.authService.currentUserValue;
    if (!user) return '';
    
    return `${user.firstName} ${user.lastName}`;
  }

  getInitials(): string {
    const user = this.authService.currentUserValue;
    if (!user) return '';
    
    return (
      (user.firstName?.charAt(0) || '') + 
      (user.lastName?.charAt(0) || '')
    ).toUpperCase();
  }

  logout(event: Event): void {
    event.preventDefault();
    this.authService.logout();
  }
}
