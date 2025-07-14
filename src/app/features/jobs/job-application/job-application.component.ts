import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JobService } from '../../../core/services/job.service';
import { Job, JobApplication, ApplicationStatus } from '../../../core/models/models';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-job-application',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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
        <button class="btn btn-link" (click)="goBack()">Go back</button>
      </div>
      
      <!-- Job application form -->
      <div class="card" *ngIf="job && !loading">
        <div class="card-header bg-light">
          <h2 class="card-title mb-0">Apply for Job: {{ job.title }}</h2>
          <p class="card-subtitle text-muted mt-2">
            {{ job.recruiter?.companyName || 'Company' }} - {{ job.location || 'Location not specified' }}
          </p>
        </div>
        
        <div class="card-body">
          <div class="alert alert-success" *ngIf="applicationSuccess">
            {{ applicationSuccess }}
            <button class="btn btn-link" (click)="goToJobs()">View all jobs</button>
          </div>

          <form [formGroup]="applicationForm" (ngSubmit)="submitApplication()" *ngIf="!applicationSuccess">
            <!-- Resume Upload -->
            <div class="mb-3">
              <label for="resume" class="form-label">Resume/CV</label>
              <div class="input-group">
                <input 
                  type="file" 
                  class="form-control" 
                  id="resume" 
                  (change)="onResumeSelected($event)"
                  accept=".pdf,.doc,.docx">
                <label class="input-group-text" for="resume">Upload</label>
              </div>
              <div class="form-text" *ngIf="currentResume">
                Currently using: {{ currentResume }}
              </div>
              <div class="form-text text-muted">
                Upload your resume/CV (PDF, DOC, or DOCX format). Max size: 5MB
              </div>
              <div class="form-text text-danger" *ngIf="resumeError">
                {{ resumeError }}
              </div>
            </div>
            
            <!-- Cover Letter -->
            <div class="mb-3">
              <label for="coverLetter" class="form-label">Cover Letter</label>
              <textarea 
                class="form-control" 
                id="coverLetter" 
                rows="6"
                formControlName="coverLetter"
                placeholder="Introduce yourself and explain why you're a good fit for this position..."></textarea>
              <div class="form-text text-muted">
                Optional: Include a personalized cover letter to stand out from other applicants.
              </div>
              <div class="invalid-feedback" *ngIf="applicationForm.get('coverLetter')?.invalid && applicationForm.get('coverLetter')?.touched">
                Cover letter cannot exceed 2000 characters.
              </div>
            </div>
            
            <!-- Submit button -->
            <div class="d-flex justify-content-between mt-4">
              <button type="button" class="btn btn-outline-secondary" (click)="goBack()">
                <i class="bi bi-arrow-left me-2"></i>Back
              </button>
              <button 
                type="submit" 
                class="btn btn-primary" 
                [disabled]="submitting || !applicationForm.valid">
                <span *ngIf="submitting" class="spinner-border spinner-border-sm me-2"></span>
                Submit Application
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .form-control:focus {
      border-color: #80bdff;
      box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }
  `]
})
export class JobApplicationComponent implements OnInit {
  job: Job | null = null;
  loading = true;
  error = '';
  submitting = false;
  resumeError = '';
  applicationSuccess = '';
  applicationForm: FormGroup;
  resumeFile: File | null = null;
  currentResume: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private jobService: JobService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {
    this.applicationForm = this.fb.group({
      coverLetter: ['', [Validators.maxLength(2000)]]
    });
  }

  ngOnInit(): void {
    // Check if user is authenticated and is a job seeker
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: this.router.url } 
      });
      return;
    }

    if (!this.authService.isJobSeeker()) {
      this.error = 'Only job seekers can apply for jobs.';
      this.loading = false;
      return;
    }

    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.loadJob(+id);
    } else {
      this.error = 'Job ID is required';
      this.loading = false;
    }

    // Check if user already has a resume
    const currentUser = this.authService.currentUserValue;
    // For now, just keep this as null since we need to implement a way to get user profile first
    this.currentResume = null;
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

  onResumeSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Check file type
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(file.type)) {
        this.resumeError = 'Invalid file type. Please upload a PDF, DOC, or DOCX file.';
        this.resumeFile = null;
        return;
      }
      
      // Check file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        this.resumeError = 'File is too large. Maximum size is 5MB.';
        this.resumeFile = null;
        return;
      }
      
      this.resumeFile = file;
      this.resumeError = '';
    }
  }

  submitApplication(): void {
    if (!this.job || !this.job.id) {
      this.error = 'Job information is missing';
      return;
    }
    
    this.submitting = true;
    
    // Create application data
    const application: JobApplication = {
      job: this.job,
      jobSeeker: null as any, // This will be set on the server based on authenticated user
      applicationDate: new Date(),
      coverLetter: this.applicationForm.get('coverLetter')?.value,
      status: ApplicationStatus.APPLIED
    };
    
    // Create FormData if resume was uploaded
    let formData: FormData | null = null;
    if (this.resumeFile) {
      formData = new FormData();
      formData.append('resume', this.resumeFile);
      // We'll need to adjust the service method to handle FormData if a resume is uploaded
    }
    
    this.jobService.applyForJob(this.job.id, application, formData).subscribe({
      next: (response) => {
        this.submitting = false;
        this.applicationSuccess = 'Your application has been submitted successfully!';
        
        // Show notification
        this.notificationService.showSuccess('Application submitted', 'Your job application has been sent to the recruiter.');
      },
      error: (error) => {
        console.error('Error applying for job', error);
        this.submitting = false;
        this.error = error?.error?.message || 'Failed to submit application. Please try again later.';
      }
    });
  }

  getResumeFilename(url: string): string {
    if (!url) return '';
    const parts = url.split('/');
    return parts[parts.length - 1];
  }

  goBack(): void {
    this.router.navigate(['/jobs', this.job?.id]);
  }

  goToJobs(): void {
    this.router.navigate(['/jobs']);
  }
}
