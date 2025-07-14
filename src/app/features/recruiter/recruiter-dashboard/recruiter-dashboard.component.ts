import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { JobService } from '../../../core/services/job.service';
import { AuthService } from '../../../core/services/auth.service';
import { Job } from '../../../core/models/models';

@Component({
  selector: 'app-recruiter-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container py-4">
      <div class="row mb-4">
        <div class="col">
          <h1>Recruiter Dashboard</h1>
          <p class="text-muted">Manage your job postings and applications</p>
        </div>
        <div class="col-auto d-flex align-items-center">
          <a routerLink="/recruiter/jobs/new" class="btn btn-primary">
            <i class="bi bi-plus-circle me-2"></i>Post New Job
          </a>
        </div>
      </div>
      
      <!-- Dashboard Stats -->
      <div class="row mb-4">
        <div class="col-md-4">
          <div class="card text-center h-100">
            <div class="card-body">
              <i class="bi bi-briefcase fs-1 text-primary mb-3"></i>
              <h5 class="card-title">Active Jobs</h5>
              <p class="card-text display-4">{{ activeJobsCount }}</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card text-center h-100">
            <div class="card-body">
              <i class="bi bi-person-check fs-1 text-success mb-3"></i>
              <h5 class="card-title">Total Applications</h5>
              <p class="card-text display-4">{{ totalApplicationsCount }}</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card text-center h-100">
            <div class="card-body">
              <i class="bi bi-eye fs-1 text-info mb-3"></i>
              <h5 class="card-title">Total Views</h5>
              <p class="card-text display-4">{{ totalViewsCount }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Loading spinner -->
      <div class="text-center my-5" *ngIf="loading">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      
      <!-- Error message -->
      <div class="alert alert-danger" *ngIf="error">
        {{ error }}
      </div>
      
      <!-- No jobs message -->
      <div class="alert alert-info" *ngIf="!loading && jobs.length === 0">
        You haven't posted any jobs yet. <a routerLink="/recruiter/jobs/new">Post your first job</a> to get started.
      </div>
      
      <!-- Jobs List -->
      <div class="card mb-4" *ngIf="!loading && jobs.length > 0">
        <div class="card-header bg-light">
          <h5 class="mb-0">Your Job Postings</h5>
        </div>
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Title</th>
                <th>Location</th>
                <th>Posted Date</th>
                <th>Applications</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let job of jobs">
                <td>
                  <a [routerLink]="['/jobs', job.id]">{{ job.title }}</a>
                </td>
                <td>{{ job.location }}</td>
                <td>{{ job.createdAt ? (job.createdAt | date:'mediumDate') : (job.postedDate | date:'mediumDate') }}</td>
                <td>
                  <a [routerLink]="['/recruiter/jobs', job.id, 'applications']" class="badge bg-primary text-decoration-none">
                    {{ this.getApplicationCount(job) }}
                  </a>
                </td>
                <td>
                  <span class="badge" [ngClass]="job.active ? 'bg-success' : 'bg-secondary'">
                    {{ job.active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <a [routerLink]="['/recruiter/jobs', job.id, 'edit']" class="btn btn-outline-primary">
                      <i class="bi bi-pencil"></i>
                    </a>
                    <button class="btn btn-outline-danger" (click)="deleteJob(job.id)">
                      <i class="bi bi-trash"></i>
                    </button>
                    <button 
                      class="btn" 
                      [ngClass]="job.active ? 'btn-outline-secondary' : 'btn-outline-success'"
                      (click)="toggleJobStatus(job)">
                      <i class="bi" [ngClass]="job.active ? 'bi-eye-slash' : 'bi-eye'"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Pagination -->
      <nav aria-label="Page navigation" class="mt-4" *ngIf="totalPages > 1">
        <ul class="pagination justify-content-center">
          <li class="page-item" [class.disabled]="currentPage === 0">
            <a class="page-link" (click)="changePage(currentPage - 1)" aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
          <li class="page-item" *ngFor="let page of getPagesArray()" [class.active]="page === currentPage + 1">
            <a class="page-link" (click)="changePage(page - 1)">{{ page }}</a>
          </li>
          <li class="page-item" [class.disabled]="currentPage === totalPages - 1">
            <a class="page-link" (click)="changePage(currentPage + 1)" aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  `,
  styles: [`
    .page-link {
      cursor: pointer;
    }
  `]
})
export class RecruiterDashboardComponent implements OnInit {
  jobs: Job[] = [];
  loading = true;
  error = '';
  
  // Stats
  activeJobsCount = 0;
  totalApplicationsCount = 0;
  totalViewsCount = 0;
  
  // Pagination
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  totalElements = 0;
  
  // Delete confirmation
  jobToDelete: number | null = null;
  
  constructor(
    private jobService: JobService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(): void {
    this.loading = true;
    this.error = '';
    
    this.jobService.getMyJobs(this.currentPage, this.pageSize).subscribe({
      next: (response: any) => {
        this.jobs = response.content;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        
        // Calculate stats
        this.activeJobsCount = this.jobs.filter(job => job.active).length;
        this.totalApplicationsCount = this.jobs.reduce((sum, job) => sum + this.getApplicationCount(job), 0);
        this.totalViewsCount = this.jobs.reduce((sum, job) => sum + this.getViewCount(job), 0);
        
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading jobs', error);
        this.error = 'Failed to load jobs. Please try again later.';
        this.loading = false;
      }
    });
  }

  deleteJob(jobId: number): void {
    if (confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      this.jobService.deleteJob(jobId).subscribe({
        next: () => {
          this.jobs = this.jobs.filter(job => job.id !== jobId);
          this.activeJobsCount = this.jobs.filter(job => job.active).length;
          
          // Recalculate stats
          this.totalApplicationsCount = this.jobs.reduce((sum, job) => sum + this.getApplicationCount(job), 0);
          this.totalViewsCount = this.jobs.reduce((sum, job) => sum + this.getViewCount(job), 0);
        },
        error: (error: any) => {
          console.error('Error deleting job', error);
          this.error = 'Failed to delete job. Please try again later.';
        }
      });
    }
  }

  toggleJobStatus(job: Job): void {
    // Create an updated job object that works with both old and new API
    const updatedJob: any = {
      title: job.title,
      description: job.description,
      active: !job.active
    };
    
    // Add properties based on which model we're using
    if ('company' in job) {
      updatedJob.company = job.company;
      updatedJob.remote = job.remote;
      updatedJob.jobType = job.jobType;
      updatedJob.experience = job.experience;
      updatedJob.skills = job.skills;
    } else {
      updatedJob.recruiter = job.recruiter;
      updatedJob.jobType = job.jobType;
      updatedJob.experienceLevel = job.experienceLevel;
      updatedJob.remoteAllowed = job.remoteAllowed;
      updatedJob.requiredSkills = job.requiredSkills;
      updatedJob.benefits = job.benefits;
    }
    
    if (job.location) updatedJob.location = job.location;
    if (job.salary) updatedJob.salary = job.salary;
    
    this.jobService.updateJob(job.id, updatedJob).subscribe({
      next: (response) => {
        // Update job in the list
        const index = this.jobs.findIndex(j => j.id === job.id);
        if (index !== -1) {
          this.jobs[index].active = response.active;
          this.activeJobsCount = this.jobs.filter(j => j.active).length;
        }
      },
      error: (error: any) => {
        console.error('Error updating job status', error);
        this.error = 'Failed to update job status. Please try again later.';
      }
    });
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

  // Helper methods to handle different Job model structures
  public getApplicationCount(job: Job): number {
    if ('applicationCount' in job && job.applicationCount !== undefined) {
      return job.applicationCount;
    } else if (job.applications) {
      return job.applications.length;
    }
    return 0;
  }

  private getViewCount(job: Job): number {
    if ('viewCount' in job && job.viewCount !== undefined) {
      return job.viewCount;
    }
    return 0;
  }
}
