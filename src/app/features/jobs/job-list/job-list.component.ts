import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { JobService } from '../../../core/services/job.service';
import { Job } from '../../../core/models/models';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="container py-5">
      <div class="row align-items-center mb-5">
        <div class="col-lg-6">
          <h1 class="fw-bold display-5 mb-3">Find Your Dream Job</h1>
          <p class="text-muted lead">Browse through thousands of opportunities from top employers</p>
        </div>
        <div class="col-lg-6 text-lg-end">
          <span class="badge rounded-pill bg-light text-primary p-2 px-3 me-2">{{ jobs.length }} Jobs</span>
          <div class="dropdown d-inline-block">
            <button class="btn btn-outline-primary dropdown-toggle rounded-pill" type="button" id="sortDropdown" data-bs-toggle="dropdown" aria-expanded="false">
              <i class="bi bi-sort-down me-2"></i> Sort by: Newest
            </button>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="sortDropdown">
              <li><a class="dropdown-item" href="#">Newest</a></li>
              <li><a class="dropdown-item" href="#">Oldest</a></li>
              <li><a class="dropdown-item" href="#">Salary (High to Low)</a></li>
              <li><a class="dropdown-item" href="#">Salary (Low to High)</a></li>
            </ul>
          </div>
        </div>
      </div>
      
      <!-- Search and Filter -->
      <div class="card border-0 rounded-4 shadow-sm mb-5 overflow-hidden">
        <div class="card-body p-4">
          <div class="row g-4">
            <div class="col-lg-4 col-md-6">
              <div class="form-floating">
                <input 
                  type="text" 
                  class="form-control border-0 bg-light" 
                  id="searchKeyword" 
                  placeholder="Job title, company, skills..."
                  [(ngModel)]="searchKeyword"
                  (keyup.enter)="searchJobs()">
                <label for="searchKeyword"><i class="bi bi-search me-2 text-primary"></i>What are you looking for?</label>
              </div>
            </div>
            
            <div class="col-lg-3 col-md-6">
              <div class="form-floating">
                <input 
                  type="text" 
                  class="form-control border-0 bg-light" 
                  id="location" 
                  placeholder="City, state, remote..."
                  [(ngModel)]="location"
                  (keyup.enter)="searchJobs()">
                <label for="location"><i class="bi bi-geo-alt me-2 text-primary"></i>Location</label>
              </div>
            </div>
            
            <div class="col-lg-3 col-md-6">
              <div class="form-floating">
                <select 
                  class="form-select border-0 bg-light" 
                  id="jobType"
                  [(ngModel)]="jobType"
                  (change)="searchJobs()">
                  <option value="">All Types</option>
                  <option value="FULL_TIME">Full Time</option>
                  <option value="PART_TIME">Part Time</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="FREELANCE">Freelance</option>
                  <option value="INTERNSHIP">Internship</option>
                </select>
                <label for="jobType"><i class="bi bi-briefcase me-2 text-primary"></i>Job Type</label>
              </div>
            </div>
            
            <div class="col-lg-2 col-md-6 d-flex align-items-center">
              <button 
                class="btn btn-primary w-100 py-3 rounded-pill" 
                (click)="searchJobs()">
                <i class="bi bi-search me-2"></i> Search Jobs
              </button>
            </div>
          </div>
          
          <div class="row mt-3">
            <div class="col-12">
              <div class="d-flex flex-wrap gap-2 mt-2">
                <span class="filter-pill py-1 px-3 rounded-pill bg-light text-dark d-inline-flex align-items-center">
                  Remote Only
                  <button class="btn btn-sm rounded-circle ms-2 p-0 lh-1" style="width: 18px; height: 18px; font-size: 10px;">×</button>
                </span>
                <span class="filter-pill py-1 px-3 rounded-pill bg-light text-dark d-inline-flex align-items-center">
                  Posted this week
                  <button class="btn btn-sm rounded-circle ms-2 p-0 lh-1" style="width: 18px; height: 18px; font-size: 10px;">×</button>
                </span>
                <a href="#" class="text-decoration-none ms-2 small">Clear all filters</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Loading spinner -->
      <div class="text-center my-5" *ngIf="loading">
        <div class="spinner" style="width: 50px; height: 50px; border: 3px solid rgba(67, 97, 238, 0.2); border-radius: 50%; border-top-color: var(--primary-color); animation: spin 1s linear infinite; margin: 0 auto;"></div>
        <p class="mt-3 text-muted">Searching for the perfect match...</p>
      </div>
      
      <!-- No jobs found message -->
      <div class="alert alert-info rounded-4 border-0 shadow-sm p-4 d-flex align-items-center" *ngIf="!loading && jobs.length === 0">
        <i class="bi bi-info-circle fs-1 me-3 text-primary"></i>
        <div>
          <h5>No matching jobs found</h5>
          <p class="mb-0">Try adjusting your search criteria or browse our <a href="#" class="text-decoration-none">featured jobs</a>.</p>
        </div>
      </div>
      
      <!-- Job listings -->
      <div class="row g-4" *ngIf="!loading && jobs.length > 0">
        <div class="col-12" *ngFor="let job of jobs">
          <div class="card border-0 shadow-sm rounded-4 job-card h-100 overflow-hidden animate-fade-in">
            <div class="card-body p-4">
              <div class="row">
                <div class="col-lg-8">
                  <div class="d-flex">
                    <div class="company-logo me-3 rounded-3 d-flex align-items-center justify-content-center" style="min-width: 70px; height: 70px; background-color: rgba(67, 97, 238, 0.1);">
                      <span class="fw-bold fs-4 text-primary">{{ job.company?.charAt(0) || 'C' }}</span>
                    </div>
                    <div>
                      <div class="d-flex align-items-center">
                        <h4 class="card-title fw-bold mb-1">{{ job.title }}</h4>
                        <span class="badge rounded-pill ms-3" [ngClass]="job.jobType === 'FULL_TIME' ? 'bg-success-subtle text-success' : job.jobType === 'PART_TIME' ? 'bg-warning-subtle text-warning' : 'bg-info-subtle text-info'">
                          {{ formatJobType(job.jobType) }}
                        </span>
                      </div>
                      <h6 class="card-subtitle mb-2 text-muted">{{ job.company }}</h6>
                      
                      <div class="d-flex flex-wrap mt-3 gap-3">
                        <div class="d-flex align-items-center text-muted">
                          <i class="bi bi-geo-alt me-2 text-primary"></i>
                          <span>{{ job.location }}</span>
                        </div>
                        <div class="d-flex align-items-center text-muted" *ngIf="job.remote">
                          <i class="bi bi-laptop me-2 text-primary"></i>
                          <span>Remote</span>
                        </div>
                        <div class="d-flex align-items-center text-muted">
                          <i class="bi bi-calendar-event me-2 text-primary"></i>
                          <span>Posted {{ job.createdAt | date:'mediumDate' }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="mt-4">
                    <p class="card-text text-muted">{{ job.description | slice:0:200 }}{{ job.description.length > 200 ? '...' : '' }}</p>
                  </div>
                  
                  <div class="d-flex flex-wrap gap-2 mt-3">
                    <span class="badge badge-skill" *ngFor="let skill of job.skills">{{ skill }}</span>
                  </div>
                </div>
                
                <div class="col-lg-4 mt-4 mt-lg-0 d-flex flex-column align-items-lg-end justify-content-between">
                  <div class="salary-range text-end mb-3">
                    <span class="d-block fw-bold fs-5 text-primary">$70K - $90K</span>
                    <small class="text-muted">Per year</small>
                  </div>
                  
                  <div class="d-flex gap-2 mt-auto">
                    <button class="btn btn-outline-secondary rounded-pill" type="button">
                      <i class="bi bi-bookmark"></i>
                    </button>
                    <a [routerLink]="['/jobs', job.id]" class="btn btn-primary rounded-pill px-4">
                      View Details
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Pagination -->
      <nav aria-label="Page navigation" class="mt-5" *ngIf="totalPages > 1">
        <ul class="pagination justify-content-center">
          <li class="page-item" [class.disabled]="currentPage === 0">
            <a class="page-link rounded-circle mx-1 border-0 shadow-sm" (click)="changePage(currentPage - 1)" aria-label="Previous">
              <i class="bi bi-chevron-left"></i>
            </a>
          </li>
          <li class="page-item" *ngFor="let page of getPagesArray()" [class.active]="page === currentPage">
            <a class="page-link rounded-circle mx-1 border-0 shadow-sm" (click)="changePage(page)">{{ page + 1 }}</a>
          </li>
          <li class="page-item" [class.disabled]="currentPage === totalPages - 1">
            <a class="page-link rounded-circle mx-1 border-0 shadow-sm" (click)="changePage(currentPage + 1)" aria-label="Next">
              <i class="bi bi-chevron-right"></i>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  `,
  styles: [`
    .job-card {
      transition: transform 0.2s, box-shadow 0.2s;
    }
    
    .job-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    .page-link {
      cursor: pointer;
    }
  `]
})
export class JobListComponent implements OnInit {
  jobs: Job[] = [];
  loading = false;
  error = '';
  
  // Search parameters
  searchKeyword = '';
  location = '';
  jobType = '';
  
  // Pagination
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  totalElements = 0;

  constructor(private jobService: JobService) { }

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(): void {
    this.loading = true;
    this.jobService.getJobs(
      this.currentPage, 
      this.pageSize, 
      this.searchKeyword, 
      this.location, 
      this.jobType
    ).subscribe({
      next: (response) => {
        this.jobs = response.content;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching jobs', error);
        this.error = 'Failed to load jobs. Please try again later.';
        this.loading = false;
      }
    });
  }

  searchJobs(): void {
    this.currentPage = 0; // Reset to first page on new search
    this.loadJobs();
  }

  changePage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadJobs();
    }
  }

  getPagesArray(): number[] {
    const pagesArray: number[] = [];
    const maxPagesToShow = 5;
    
    if (this.totalPages <= maxPagesToShow) {
      // Show all pages if there are few
      for (let i = 1; i <= this.totalPages; i++) {
        pagesArray.push(i);
      }
    } else {
      // Show limited pages with current page in middle
      let startPage = Math.max(1, this.currentPage + 1 - Math.floor(maxPagesToShow / 2));
      let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);
      
      // Adjust if end is maxed out
      if (endPage === this.totalPages) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pagesArray.push(i);
      }
    }
    
    return pagesArray;
  }

  formatJobType(jobType: string): string {
    if (!jobType) return '';
    
    return jobType
      .replace('_', ' ')
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }
}
