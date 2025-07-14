import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { JobService } from '../../../core/services/job.service';
import { AuthService } from '../../../core/services/auth.service';
import { Job } from '../../../core/models/models';
import { Job as OldJob } from '../../../core/models/job.model';

@Component({
  selector: 'app-job-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container py-4">
      <!-- Loading spinner -->
      <div class="text-center my-5" *ngIf="loading">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      
      <!-- Error message -->
      <div class="alert alert-danger" *ngIf="error">
        {{ error }}
        <a routerLink="/jobs" class="ms-2">Go back to job listings</a>
      </div>
      
      <!-- Job details -->
      <div class="card" *ngIf="job && !loading">
        <div class="card-header bg-light d-flex justify-content-between align-items-center">
          <div>
            <h1 class="card-title mb-0">{{ job.title }}</h1>
            <h5 class="card-subtitle text-muted mt-2">{{ getCompanyName() }}</h5>
          </div>
          <div>
            <span class="badge bg-primary me-2">{{ job.jobType ? formatJobType(job.jobType) : 'Not specified' }}</span>
            <span class="badge bg-secondary" *ngIf="isRemote()">Remote</span>
          </div>
        </div>
        
        <div class="card-body">
          <div class="mb-4">
            <div class="d-flex align-items-center mb-3">
              <i class="bi bi-geo-alt me-2"></i>
              <span>{{ job.location || 'Location not specified' }}</span>
              
              <i class="bi bi-briefcase ms-4 me-2"></i>
              <span>{{ getExperienceLevel() }}</span>
              
              <i class="bi bi-currency-dollar ms-4 me-2"></i>
              <span>{{ job.salary ? job.salary : 'Salary not disclosed' }}</span>
            </div>
            
            <div>
              <i class="bi bi-calendar me-2"></i>
              <span>Posted on {{ getPostedDate() }}</span>
              
              <i class="bi bi-person ms-4 me-2"></i>
              <span>Posted by {{ getRecruiterName() }}</span>
            </div>
          </div>
          
          <h4>Job Description</h4>
          <div class="mb-4 job-description">
            <p [innerHTML]="job.description"></p>
          </div>
          
          <h4>Skills Required</h4>
          <div class="mb-4">
            <span class="badge bg-secondary me-2 mb-2" *ngFor="let skill of getSkills()">{{ skill }}</span>
          </div>
          
          <div class="alert alert-success mt-4" *ngIf="applicationSuccess">
            {{ applicationSuccess }}
          </div>
          
          <div class="d-flex justify-content-between align-items-center mt-4">
            <a routerLink="/jobs" class="btn btn-outline-secondary">
              <i class="bi bi-arrow-left me-2"></i>Back to Job Listings
            </a>
            
            <div>
              <!-- For job seekers -->
              <button 
                *ngIf="isJobSeeker() && !isOwnJob() && !applicationSuccess" 
                class="btn btn-primary" 
                [routerLink]="['/jobs', job.id, 'apply']">
                Apply Now
              </button>
              
              <!-- For recruiters -->
              <div class="btn-group" *ngIf="isRecruiter() && isOwnJob()">
                <a [routerLink]="['/recruiter/jobs', job.id, 'edit']" class="btn btn-outline-primary">
                  <i class="bi bi-pencil me-2"></i>Edit Job
                </a>
                <a [routerLink]="['/recruiter/jobs', job.id, 'applications']" class="btn btn-outline-info ms-2">
                  <i class="bi bi-people me-2"></i>View Applications
                </a>
              </div>
              
              <!-- For non-authenticated users -->
              <a 
                *ngIf="!isAuthenticated()" 
                routerLink="/login" 
                [queryParams]="{returnUrl: currentUrl}" 
                class="btn btn-primary">
                Login to Apply
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .job-description {
      white-space: pre-line;
    }
  `]
})
export class JobDetailsComponent implements OnInit {
  job: Job | null = null;
  loading = true;
  error = '';
  applying = false;
  applicationSuccess = '';
  currentUrl = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobService: JobService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.currentUrl = this.router.url;
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.loadJob(+id);
    } else {
      this.error = 'Job ID is required';
      this.loading = false;
    }
  }

  loadJob(id: number): void {
    this.loading = true;
    this.jobService.getJobById(id).subscribe({
      next: (job) => {
        this.job = job;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching job details', error);
        this.error = 'Failed to load job details. The job may not exist or has been removed.';
        this.loading = false;
      }
    });
  }

  // We don't need this method anymore since we're using the router link to navigate to the apply page
  // applyForJob(): void {
  //   if (!this.job) return;
  //   
  //   this.applying = true;
  //   this.jobService.applyForJob(this.job.id).subscribe({
  //     next: () => {
  //       this.applying = false;
  //       this.applicationSuccess = 'Your application has been submitted successfully!';
  //     },
  //     error: (error) => {
  //       console.error('Error applying for job', error);
  //       this.applying = false;
  //       this.error = error?.error?.message || 'Failed to submit application. Please try again later.';
  //     }
  //   });
  // }

  isAuthenticated(): boolean {
    return this.authService.isLoggedIn();
  }

  isJobSeeker(): boolean {
    return this.authService.isJobSeeker();
  }

  isRecruiter(): boolean {
    return this.authService.isRecruiter();
  }

  isOwnJob(): boolean {
    if (!this.job || !this.authService.currentUserValue) {
      return false;
    }
    
    // Check if it's using the old or new model
    if ('recruiterId' in this.job) {
      // Old model
      return (this.job as any).recruiterId === this.authService.currentUserValue.id;
    } else if (this.job.recruiter) {
      // New model
      return this.job.recruiter.id === this.authService.currentUserValue.id;
    }
    
    return false;
  }

  isRemote(): boolean {
    if (!this.job) return false;
    
    if ('remote' in this.job) {
      return (this.job as any).remote;
    } else if ('remoteAllowed' in this.job) {
      return this.job.remoteAllowed;
    }
    
    return false;
  }

  getCompanyName(): string {
    if (!this.job) return 'Company';
    
    if ('company' in this.job) {
      return (this.job as any).company;
    } else if (this.job.recruiter) {
      return this.job.recruiter.companyName || 'Company';
    }
    
    return 'Company';
  }

  formatJobType(jobType: string): string {
    if (!jobType) return '';
    
    return jobType
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  formatExperience(experience: string): string {
    if (!experience) return '';
    
    const experienceMap: { [key: string]: string } = {
      'ENTRY': 'Entry Level',
      'MID': 'Mid Level',
      'SENIOR': 'Senior Level',
      'EXECUTIVE': 'Executive Level'
    };
    
    return experienceMap[experience] || experience;
  }

  getExperienceLevel(): string {
    if (!this.job) return 'Experience not specified';
    
    if ('experience' in this.job) {
      return (this.job as any).experience ? this.formatExperience((this.job as any).experience) : 'Experience not specified';
    } else if ('experienceLevel' in this.job) {
      return this.job.experienceLevel ? this.formatExperience(this.job.experienceLevel) : 'Experience not specified';
    }
    
    return 'Experience not specified';
  }

  getPostedDate(): string {
    if (!this.job) return '';
    
    if ('createdAt' in this.job) {
      return new Date((this.job as any).createdAt).toLocaleDateString();
    } else if ('postedDate' in this.job) {
      return new Date(this.job.postedDate).toLocaleDateString();
    }
    
    return '';
  }

  getRecruiterName(): string {
    if (!this.job) return 'Recruiter';
    
    if ('recruiterName' in this.job) {
      return (this.job as any).recruiterName || 'Recruiter';
    } else if (this.job.recruiter && this.job.recruiter.user) {
      return this.job.recruiter.user.firstName || 'Recruiter';
    }
    
    return 'Recruiter';
  }

  getSkills(): string[] {
    if (!this.job) return [];
    
    if ('skills' in this.job) {
      return (this.job as any).skills || [];
    } else if ('requiredSkills' in this.job) {
      return this.job.requiredSkills || [];
    }
    
    return [];
  }
}
