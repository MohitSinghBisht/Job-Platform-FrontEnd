import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfileService } from '../../../core/services/profile.service';
import { AuthService } from '../../../core/services/auth.service';
import { JobService } from '../../../core/services/job.service';
import { User } from '../../../core/models/user.model';
import { JobSeekerProfile } from 'src/app/core/models/models';

@Component({
  selector: 'app-profile-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="container py-4">
      <div class="row">
        <!-- Sidebar -->
        <div class="col-md-3">
          <div class="card mb-4">
            <div class="card-body">
              <div class="text-center mb-3">
                <div class="avatar-placeholder mb-3">
                  {{ getInitials() }}
                </div>
                <h5 class="mb-0">{{ user?.firstName }} {{ user?.lastName }}</h5>
                <p class="text-muted">{{ user?.email }}</p>
              </div>
              <hr>
              <ul class="nav flex-column nav-pills">
                <li class="nav-item">
                  <a 
                    class="nav-link" 
                    [class.active]="activeTab === 'profile'" 
                    (click)="setActiveTab('profile')">
                    <i class="bi bi-person me-2"></i>Profile
                  </a>
                </li>
                <li class="nav-item" *ngIf="isJobSeeker()">
                  <a 
                    class="nav-link" 
                    [class.active]="activeTab === 'resume'" 
                    (click)="setActiveTab('resume')">
                    <i class="bi bi-file-earmark-text me-2"></i>Resume
                  </a>
                </li>
                <li class="nav-item" *ngIf="isJobSeeker()">
                  <a 
                    class="nav-link" 
                    [class.active]="activeTab === 'applications'" 
                    (click)="setActiveTab('applications')">
                    <i class="bi bi-briefcase me-2"></i>Applications
                  </a>
                </li>
                <li class="nav-item" *ngIf="isRecruiter()">
                  <a 
                    class="nav-link" 
                    [routerLink]="['/recruiter']">
                    <i class="bi bi-building me-2"></i>Recruiter Dashboard
                  </a>
                </li>
                <li class="nav-item">
                  <a 
                    class="nav-link" 
                    [class.active]="activeTab === 'security'" 
                    (click)="setActiveTab('security')">
                    <i class="bi bi-shield-lock me-2"></i>Security
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <!-- Main content -->
        <div class="col-md-9">
          <!-- Profile Information Tab -->
          <div *ngIf="activeTab === 'profile'">
            <div class="card mb-4">
              <div class="card-header bg-light">
                <h5 class="mb-0">Profile Information</h5>
              </div>
              <div class="card-body">
                <div class="alert alert-success" *ngIf="profileUpdateSuccess">
                  {{ profileUpdateSuccess }}
                </div>
                <div class="alert alert-danger" *ngIf="profileUpdateError">
                  {{ profileUpdateError }}
                </div>
                
                <form [formGroup]="profileForm" (ngSubmit)="updateProfile()">
                  <div class="row mb-3">
                    <div class="col-md-6">
                      <label for="firstName" class="form-label">First Name</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        id="firstName" 
                        formControlName="firstName">
                      <div *ngIf="submitted && pf['firstName'].errors" class="text-danger small">
                        <div *ngIf="pf['firstName'].errors['required']">First name is required</div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <label for="lastName" class="form-label">Last Name</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        id="lastName" 
                        formControlName="lastName">
                      <div *ngIf="submitted && pf['lastName'].errors" class="text-danger small">
                        <div *ngIf="pf['lastName'].errors['required']">Last name is required</div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input 
                      type="email" 
                      class="form-control" 
                      id="email" 
                      formControlName="email" 
                      [disabled]="true">
                  </div>
                  
                  <div class="mb-3">
                    <label for="phone" class="form-label">Phone</label>
                    <input 
                      type="tel" 
                      class="form-control" 
                      id="phone" 
                      formControlName="phone">
                  </div>
                  
                  <div class="mb-3">
                    <label for="location" class="form-label">Location</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="location" 
                      formControlName="location"
                      placeholder="City, State, Country">
                  </div>
                  
                  <div class="mb-3" *ngIf="isJobSeeker()">
                    <label for="title" class="form-label">Professional Title</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="title" 
                      formControlName="title"
                      placeholder="e.g. Full Stack Developer">
                  </div>
                  
                  <div class="mb-3" *ngIf="isJobSeeker()">
                    <label for="skills" class="form-label">Skills (comma separated)</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="skills" 
                      formControlName="skills"
                      placeholder="e.g. React, Node.js, MongoDB">
                  </div>
                  
                  <div class="mb-3" *ngIf="isJobSeeker()">
                    <label for="bio" class="form-label">Professional Summary</label>
                    <textarea 
                      class="form-control" 
                      id="bio" 
                      formControlName="bio"
                      rows="4"
                      placeholder="Write a brief summary about your professional background"></textarea>
                  </div>
                  
                  <div class="mb-3" *ngIf="isRecruiter()">
                    <label for="companyName" class="form-label">Company Name</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="companyName" 
                      formControlName="companyName">
                  </div>
                  
                  <div class="mb-3" *ngIf="isRecruiter()">
                    <label for="companyWebsite" class="form-label">Company Website</label>
                    <input 
                      type="url" 
                      class="form-control" 
                      id="companyWebsite" 
                      formControlName="companyWebsite"
                      placeholder="https://example.com">
                  </div>
                  
                  <button type="submit" class="btn btn-primary" [disabled]="profileLoading">
                    <span *ngIf="profileLoading" class="spinner-border spinner-border-sm me-2"></span>
                    Save Changes
                  </button>
                </form>
              </div>
            </div>
          </div>
          
          <!-- Resume Tab -->
          <div *ngIf="activeTab === 'resume' && isJobSeeker()">
            <div class="card mb-4">
              <div class="card-header bg-light d-flex justify-content-between align-items-center">
                <h5 class="mb-0">Resume</h5>
                <button class="btn btn-sm btn-primary">
                  <i class="bi bi-upload me-2"></i>Upload New Resume
                </button>
              </div>
              <div class="card-body">
                <div class="alert alert-info" *ngIf="!hasResume">
                  You haven't uploaded a resume yet. Upload your resume to apply for jobs more quickly.
                </div>
                
                <div *ngIf="hasResume">
                  <div class="d-flex align-items-center">
                    <i class="bi bi-file-earmark-pdf fs-1 text-danger me-3"></i>
                    <div>
                      <h6 class="mb-1">MyResume.pdf</h6>
                      <p class="text-muted mb-0 small">Uploaded on Jan 15, 2023</p>
                    </div>
                    <div class="ms-auto">
                      <button class="btn btn-sm btn-outline-primary me-2">
                        <i class="bi bi-eye me-1"></i>View
                      </button>
                      <button class="btn btn-sm btn-outline-danger">
                        <i class="bi bi-trash me-1"></i>Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Applications Tab -->
          <div *ngIf="activeTab === 'applications' && isJobSeeker()">
            <div class="card mb-4">
              <div class="card-header bg-light">
                <h5 class="mb-0">Job Applications</h5>
              </div>
              <div class="card-body">
                <div class="alert alert-info" *ngIf="applications.length === 0">
                  You haven't applied to any jobs yet. <a routerLink="/jobs">Browse jobs</a> to get started.
                </div>
                
                <div class="list-group">
                  <div class="list-group-item list-group-item-action" *ngFor="let application of applications">
                    <div class="d-flex w-100 justify-content-between">
                      <h5 class="mb-1">{{ application.jobTitle }}</h5>
                      <small class="text-muted">{{ application.appliedDate | date:'mediumDate' }}</small>
                    </div>
                    <p class="mb-1">{{ application.companyName }}</p>
                    <div class="d-flex justify-content-between align-items-center">
                      <span class="badge" 
                        [ngClass]="{
                          'bg-warning': application.status === 'PENDING',
                          'bg-success': application.status === 'ACCEPTED',
                          'bg-danger': application.status === 'REJECTED',
                          'bg-info': application.status === 'INTERVIEW'
                        }">
                        {{ application.status }}
                      </span>
                      <a [routerLink]="['/jobs', application.jobId]" class="btn btn-sm btn-outline-primary">
                        View Job
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Security Tab -->
          <div *ngIf="activeTab === 'security'">
            <div class="card mb-4">
              <div class="card-header bg-light">
                <h5 class="mb-0">Security</h5>
              </div>
              <div class="card-body">
                <div class="alert alert-success" *ngIf="passwordUpdateSuccess">
                  {{ passwordUpdateSuccess }}
                </div>
                <div class="alert alert-danger" *ngIf="passwordUpdateError">
                  {{ passwordUpdateError }}
                </div>
                
                <h6>Change Password</h6>
                <form [formGroup]="passwordForm" (ngSubmit)="updatePassword()">
                  <div class="mb-3">
                    <label for="currentPassword" class="form-label">Current Password</label>
                    <input 
                      type="password" 
                      class="form-control" 
                      id="currentPassword" 
                      formControlName="currentPassword">
                    <div *ngIf="passwordSubmitted && pf2['currentPassword'].errors" class="text-danger small">
                      <div *ngIf="pf2['currentPassword'].errors['required']">Current password is required</div>
                    </div>
                  </div>
                  
                  <div class="mb-3">
                    <label for="newPassword" class="form-label">New Password</label>
                    <input 
                      type="password" 
                      class="form-control" 
                      id="newPassword" 
                      formControlName="newPassword">
                    <div *ngIf="passwordSubmitted && pf2['newPassword'].errors" class="text-danger small">
                      <div *ngIf="pf2['newPassword'].errors['required']">New password is required</div>
                      <div *ngIf="pf2['newPassword'].errors['minlength']">Password must be at least 6 characters</div>
                    </div>
                  </div>
                  
                  <div class="mb-3">
                    <label for="confirmPassword" class="form-label">Confirm New Password</label>
                    <input 
                      type="password" 
                      class="form-control" 
                      id="confirmPassword" 
                      formControlName="confirmPassword">
                    <div *ngIf="passwordSubmitted && pf2['confirmPassword'].errors" class="text-danger small">
                      <div *ngIf="pf2['confirmPassword'].errors['required']">Please confirm your password</div>
                      <div *ngIf="pf2['confirmPassword'].errors['mismatch']">Passwords do not match</div>
                    </div>
                  </div>
                  
                  <button type="submit" class="btn btn-primary" [disabled]="passwordLoading">
                    <span *ngIf="passwordLoading" class="spinner-border spinner-border-sm me-2"></span>
                    Update Password
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .avatar-placeholder {
      width: 80px;
      height: 80px;
      background-color: #007bff;
      color: white;
      font-size: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      margin: 0 auto;
    }
    
    .nav-link {
      cursor: pointer;
    }
  `]
})
export class ProfileDashboardComponent implements OnInit {
  user: User | null = null;
  activeTab = 'profile';
  hasResume = false;
  applications: any[] = [];
  
  // Profile form
  profileForm: FormGroup;
  submitted = false;
  profileLoading = false;
  profileUpdateSuccess = '';
  profileUpdateError = '';
  
  // Password form
  passwordForm: FormGroup;
  passwordSubmitted = false;
  passwordLoading = false;
  passwordUpdateSuccess = '';
  passwordUpdateError = '';

  constructor(
    private formBuilder: FormBuilder,
    private profileService: ProfileService,
    private authService: AuthService,
    private jobService: JobService
  ) {
    this.user = this.authService.currentUserValue;
    
    this.profileForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: [{ value: '', disabled: true }],
      phone: [''],
      location: [''],
      title: [''],
      bio: [''],
      skills: [''],
      companyName: [''],
      companyWebsite: ['']
    });
    
    this.passwordForm = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
    if (this.isJobSeeker()) {
      this.loadApplications();
    }
  }

  // Getter for profile form fields
  get pf() { return this.profileForm.controls; }
  
  // Getter for password form fields
  get pf2() { return this.passwordForm.controls; }

  loadUserProfile(): void {
    if (!this.user) return;
    
    this.profileService.getJobSeekerProfile().subscribe({
      next: (profile: JobSeekerProfile) => {
        this.profileForm.patchValue({
          firstName: profile.user.firstName || this.user?.firstName,
          lastName: profile.user.lastName || this.user?.lastName,
          email: profile.user.email || this.user?.email,
          phone: profile.user.phoneNumber || '',
          location: profile.user.location || '',
          title: profile.user.headline || '',
          bio: profile.user.about || '',
          skills: profile.skills ? profile.skills.join(', ') : '',
          companyName: profile.experience || '',
        });
        
        this.hasResume = !!profile.resumeUrl;
      },
      error: (error: any) => {
        console.error('Error loading profile', error);
      }
    });
  }

  loadApplications(): void {
    this.jobService.getMyApplications().subscribe({
      next: (response: any) => {
        this.applications = response.content;
      },
      error: (error: any) => {
        console.error('Error loading applications', error);
      }
    });
  }

  updateProfile(): void {
    this.submitted = true;
    this.profileUpdateSuccess = '';
    this.profileUpdateError = '';
    
    if (this.profileForm.invalid) {
      return;
    }
    
    this.profileLoading = true;
    const formValues = this.profileForm.getRawValue();
    
    // Transform skills from comma-separated string to array
    const profileData: any = {
      ...formValues,
      skills: formValues.skills ? formValues.skills.split(',').map((s: string) => s.trim()) : []
    };
    
    this.profileService.updateUserProfile(profileData).subscribe({
      next: () => {
        this.profileLoading = false;
        this.profileUpdateSuccess = 'Profile updated successfully';
        
        // Update user in auth service
        if (this.user) {
          this.user = {
            ...this.user,
            firstName: formValues.firstName,
            lastName: formValues.lastName
          };
          
          const storedUser = localStorage.getItem('currentUser');
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            parsedUser.firstName = formValues.firstName;
            parsedUser.lastName = formValues.lastName;
            localStorage.setItem('currentUser', JSON.stringify(parsedUser));
          }
        }
      },
      error: (error: any) => {
        this.profileLoading = false;
        this.profileUpdateError = error?.error?.message || 'Failed to update profile';
      }
    });
  }

  updatePassword(): void {
    this.passwordSubmitted = true;
    this.passwordUpdateSuccess = '';
    this.passwordUpdateError = '';
    
    if (this.passwordForm.invalid) {
      return;
    }
    
    this.passwordLoading = true;
    this.profileService.updatePassword(
      this.passwordForm.value.currentPassword,
      this.passwordForm.value.newPassword
    ).subscribe({
      next: () => {
        this.passwordLoading = false;
        this.passwordUpdateSuccess = 'Password updated successfully';
        this.passwordForm.reset();
        this.passwordSubmitted = false;
      },
      error: (error: any) => {
        this.passwordLoading = false;
        this.passwordUpdateError = error?.error?.message || 'Failed to update password';
      }
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  getInitials(): string {
    if (!this.user) return '';
    
    return (
      (this.user.firstName?.charAt(0) || '') + 
      (this.user.lastName?.charAt(0) || '')
    ).toUpperCase();
  }

  isJobSeeker(): boolean {
    return this.authService.isJobSeeker();
  }

  isRecruiter(): boolean {
    return this.authService.isRecruiter();
  }

  private passwordMatchValidator(formGroup: FormGroup): any {
    const newPassword = formGroup.get('newPassword')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    
    if (newPassword !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ mismatch: true });
      return { mismatch: true };
    }
    
    return null;
  }
}
