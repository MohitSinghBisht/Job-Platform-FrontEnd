import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { JobService } from '../../core/services/job.service';
import { Job } from '../../core/models/models';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container-fluid px-0">
      <!-- Hero Section -->
      <div class="hero-section position-relative animate-fade-in" style="background: linear-gradient(135deg, rgba(67, 97, 238, 0.9), rgba(114, 9, 183, 0.9)), url('https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&q=80') center/cover no-repeat; height: 600px; padding: 0;">
        <div class="container h-100 d-flex flex-column justify-content-center align-items-start text-white">
          <div class="col-lg-6 col-md-8 py-5">
            <h1 class="display-4 fw-bold mb-4" style="line-height: 1.2;">Discover Your <span style="color: #4cc9f0;">Perfect Career</span> Match</h1>
            <p class="lead mb-4 pe-md-5">Connect with top employers and discover opportunities that align with your skills, experience, and career aspirations.</p>
            
            <div class="search-box bg-white p-3 rounded-pill shadow-lg mt-4 d-flex align-items-center">
              <div class="input-group border-0">
                <span class="input-group-text bg-transparent border-0">
                  <i class="bi bi-search text-primary"></i>
                </span>
                <input type="text" class="form-control border-0 shadow-none" placeholder="Job title, skills, or company...">
                <button class="btn btn-primary rounded-pill px-4">Search Jobs</button>
              </div>
            </div>
            
            <div class="d-flex gap-3 mt-4">
              <a *ngIf="!isLoggedIn" class="btn btn-light btn-lg rounded-pill px-4 shadow-sm" routerLink="/register">
                <i class="bi bi-person-plus me-2"></i> Create Account
              </a>
              <a class="btn btn-outline-light btn-lg rounded-pill px-4" routerLink="/jobs">
                <i class="bi bi-briefcase me-2"></i> Browse Jobs
              </a>
            </div>
          </div>
        </div>
        
        <!-- Wave SVG at bottom -->
        <div class="position-absolute bottom-0 left-0 w-100" style="overflow: hidden; line-height: 0;">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" style="position: relative; display: block; width: calc(100% + 1.3px); height: 60px; transform: rotateY(180deg)">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" style="fill: #ffffff;"></path>
          </svg>
        </div>
      </div>

      <div class="container py-5">
        <!-- Stats Counter -->
        <div class="row py-5 text-center justify-content-center">
          <div class="col-lg-3 col-md-6 mb-4">
            <div class="stat-card p-4 rounded-4 shadow-sm h-100">
              <div class="stat-icon mb-3">
                <i class="bi bi-briefcase-fill fs-1 text-primary"></i>
              </div>
              <h2 class="fw-bold mb-0">2,500+</h2>
              <p class="text-muted mb-0">Active Job Listings</p>
            </div>
          </div>
          <div class="col-lg-3 col-md-6 mb-4">
            <div class="stat-card p-4 rounded-4 shadow-sm h-100">
              <div class="stat-icon mb-3">
                <i class="bi bi-building-fill fs-1 text-primary"></i>
              </div>
              <h2 class="fw-bold mb-0">500+</h2>
              <p class="text-muted mb-0">Companies Hiring</p>
            </div>
          </div>
          <div class="col-lg-3 col-md-6 mb-4">
            <div class="stat-card p-4 rounded-4 shadow-sm h-100">
              <div class="stat-icon mb-3">
                <i class="bi bi-people-fill fs-1 text-primary"></i>
              </div>
              <h2 class="fw-bold mb-0">15,000+</h2>
              <p class="text-muted mb-0">Registered Job Seekers</p>
            </div>
          </div>
          <div class="col-lg-3 col-md-6 mb-4">
            <div class="stat-card p-4 rounded-4 shadow-sm h-100">
              <div class="stat-icon mb-3">
                <i class="bi bi-check-circle-fill fs-1 text-primary"></i>
              </div>
              <h2 class="fw-bold mb-0">8,000+</h2>
              <p class="text-muted mb-0">Successful Placements</p>
            </div>
          </div>
        </div>

        <!-- Featured Jobs -->
        <div class="row mb-4 align-items-center">
          <div class="col-md-6">
            <h2 class="fw-bold fs-1 mb-0">Featured Opportunities</h2>
          </div>
          <div class="col-md-6 text-md-end">
            <a routerLink="/jobs" class="text-decoration-none text-primary">View all jobs <i class="bi bi-arrow-right"></i></a>
          </div>
        </div>
      
        <div class="row g-4">
          <div class="col-lg-4 col-md-6" *ngFor="let job of featuredJobs">
            <div class="card job-card h-100 border-0 animate-fade-in">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <div class="company-logo rounded-3 d-flex align-items-center justify-content-center" style="width: 60px; height: 60px; background-color: rgba(67, 97, 238, 0.1);">
                    <span class="text-primary fw-bold">{{ job.recruiter?.companyName?.charAt(0) || 'C' }}</span>
                  </div>
                  <span *ngIf="job.remoteAllowed" class="badge bg-success-subtle text-success px-3 py-2 rounded-pill">
                    <i class="bi bi-laptop me-1"></i> Remote
                  </span>
                </div>
                <h5 class="card-title fw-bold mb-1">{{ job.title }}</h5>
                <h6 class="card-subtitle mb-3 text-muted">{{ job.recruiter?.companyName || 'Company' }}</h6>
                
                <div class="job-details mb-4">
                  <div class="d-flex align-items-center mb-2">
                    <i class="bi bi-geo-alt text-primary me-2"></i> 
                    <span>{{ job.location || 'Remote' }}</span>
                  </div>
                  <div class="d-flex align-items-center mb-2">
                    <i class="bi bi-briefcase text-primary me-2"></i>
                    <span>{{ job.jobType }}</span>
                  </div>
                  <div class="d-flex align-items-center">
                    <i class="bi bi-calendar-event text-primary me-2"></i>
                    <span>Posted: {{ job.postedDate | date }}</span>
                  </div>
                </div>
                
                <div class="d-flex flex-wrap gap-2 mb-3">
                  <span *ngFor="let skill of job.requiredSkills.slice(0, 3)" class="badge badge-skill">{{ skill }}</span>
                  <span *ngIf="job.requiredSkills.length > 3" class="badge badge-skill">+{{ job.requiredSkills.length - 3 }}</span>
                </div>
                
                <a [routerLink]="['/jobs', job.id]" class="btn btn-outline-primary w-100 mt-3">View Details</a>
              </div>
            </div>
          </div>
        </div>
      
        <!-- How It Works -->
        <div class="how-it-works py-5 mt-5">
          <div class="text-center mb-5">
            <h2 class="fw-bold fs-1 mb-3">How JobHunt Works</h2>
            <p class="text-muted mx-auto" style="max-width: 600px;">Join thousands of professionals who have already found their perfect career match with our simple process.</p>
          </div>
          
          <div class="row g-4">
            <div class="col-md-4 mb-4">
              <div class="card border-0 h-100 text-center px-3 py-4">
                <div class="step-icon mx-auto mb-4 d-flex align-items-center justify-content-center rounded-circle" style="width: 80px; height: 80px; background: linear-gradient(135deg, rgba(67, 97, 238, 0.1), rgba(114, 9, 183, 0.1));">
                  <i class="bi bi-search fs-1 text-primary"></i>
                </div>
                <h4 class="fw-bold mb-3">1. Discover</h4>
                <p class="text-muted px-lg-3">Browse thousands of job listings to find the perfect match for your skills and experience.</p>
              </div>
            </div>
            <div class="col-md-4 mb-4">
              <div class="card border-0 h-100 text-center px-3 py-4">
                <div class="step-icon mx-auto mb-4 d-flex align-items-center justify-content-center rounded-circle" style="width: 80px; height: 80px; background: linear-gradient(135deg, rgba(67, 97, 238, 0.1), rgba(114, 9, 183, 0.1));">
                  <i class="bi bi-person-badge fs-1 text-primary"></i>
                </div>
                <h4 class="fw-bold mb-3">2. Apply</h4>
                <p class="text-muted px-lg-3">Create a comprehensive profile and apply to positions that match your career goals with just a few clicks.</p>
              </div>
            </div>
            <div class="col-md-4 mb-4">
              <div class="card border-0 h-100 text-center px-3 py-4">
                <div class="step-icon mx-auto mb-4 d-flex align-items-center justify-content-center rounded-circle" style="width: 80px; height: 80px; background: linear-gradient(135deg, rgba(67, 97, 238, 0.1), rgba(114, 9, 183, 0.1));">
                  <i class="bi bi-check2-circle fs-1 text-primary"></i>
                </div>
                <h4 class="fw-bold mb-3">3. Connect</h4>
                <p class="text-muted px-lg-3">Interview with top employers and receive real-time updates on your application status.</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- CTA Section -->
        <div class="cta-section my-5 p-5 rounded-4 text-center" style="background: linear-gradient(135deg, rgba(67, 97, 238, 0.9), rgba(114, 9, 183, 0.9));">
          <div class="row justify-content-center">
            <div class="col-lg-8">
              <h2 class="text-white fw-bold mb-4">Ready to Take the Next Step in Your Career?</h2>
              <p class="text-white-50 mb-4">Join thousands of professionals who have found their dream job with JobHunt.</p>
              <div class="d-flex justify-content-center gap-3">
                <a *ngIf="!isLoggedIn" class="btn btn-light btn-lg px-4 rounded-pill" routerLink="/register">
                  <i class="bi bi-person-plus me-2"></i> Sign Up Now
                </a>
                <a class="btn btn-outline-light btn-lg px-4 rounded-pill" routerLink="/jobs">
                  <i class="bi bi-briefcase me-2"></i> Browse Jobs
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class HomeComponent implements OnInit {
  featuredJobs: Job[] = [];
  isLoggedIn = false;

  constructor(
    private jobService: JobService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.loadFeaturedJobs();
  }

  loadFeaturedJobs(): void {
    this.jobService.getAllJobs().subscribe(
      (jobs) => {
        // Take the first 6 jobs as featured
        this.featuredJobs = jobs.slice(0, 6);
      },
      (error) => {
        console.error('Error loading featured jobs', error);
        // Initialize with empty array if error
        this.featuredJobs = [];
      }
    );
  }
}
