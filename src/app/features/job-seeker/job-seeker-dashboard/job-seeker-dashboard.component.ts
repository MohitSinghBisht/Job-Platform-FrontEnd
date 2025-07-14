import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { JobService } from '../../../core/services/job.service';
import { AuthService } from '../../../core/services/auth.service';
import { ProfileService } from '../../../core/services/profile.service';
import { Job, JobApplication, User, ApplicationStatus } from '../../../core/models/models';

@Component({
  selector: 'app-job-seeker-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './job-seeker-dashboard.component.html',
  styleUrls: ['./job-seeker-dashboard.component.scss']
})
export class JobSeekerDashboardComponent implements OnInit {
  applications: JobApplication[] = [];
  savedJobs: Job[] = [];
  user: User | null = null;
  loading = false;
  error = '';
  ApplicationStatus = ApplicationStatus; // Make enum available to template

  constructor(
    private jobService: JobService,
    private authService: AuthService,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.getUserProfile();
    this.getMyApplications();
    this.getSavedJobs();
  }

  getUserProfile(): void {
    this.profileService.getJobSeekerProfile().subscribe({
      next: (user) => {
        this.user = user.user;
      },
      error: (err) => {
        this.error = 'Failed to load user profile. Please try again.';
        console.error('Error fetching user profile:', err);
      }
    });
  }

  getMyApplications(): void {
    this.jobService.getMyApplications().subscribe({
      next: (applications) => {
        this.applications = applications;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load your applications. Please try again.';
        this.loading = false;
        console.error('Error fetching applications:', err);
      }
    });
  }

  getSavedJobs(): void {
    this.jobService.getSavedJobs().subscribe({
      next: (jobs) => {
        this.savedJobs = jobs;
      },
      error: (err) => {
        console.error('Error fetching saved jobs:', err);
      }
    });
  }

  withdrawApplication(applicationId: number): void {
    if (confirm('Are you sure you want to withdraw this application?')) {
      this.jobService.withdrawApplication(applicationId).subscribe({
        next: () => {
          this.applications = this.applications.filter(app => app.id !== applicationId);
        },
        error: (err) => {
          this.error = 'Failed to withdraw application. Please try again.';
          console.error('Error withdrawing application:', err);
        }
      });
    }
  }

  unsaveJob(jobId: number): void {
    this.jobService.unsaveJob(jobId).subscribe({
      next: () => {
        this.savedJobs = this.savedJobs.filter(job => job.id !== jobId);
      },
      error: (err) => {
        this.error = 'Failed to unsave job. Please try again.';
        console.error('Error unsaving job:', err);
      }
    });
  }
}
