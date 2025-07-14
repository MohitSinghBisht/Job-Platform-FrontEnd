import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card">
            <div class="card-header bg-primary text-white">
              <h4 class="mb-0">Register</h4>
            </div>
            <div class="card-body">
              <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
                <div class="alert alert-danger" *ngIf="error">
                  {{ error }}
                </div>
                
                <div class="alert alert-success" *ngIf="success">
                  {{ success }}
                </div>

                <div class="row mb-3">
                  <div class="col-md-6">
                    <label for="firstName" class="form-label">First Name</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="firstName" 
                      formControlName="firstName"
                      [ngClass]="{'is-invalid': submitted && f['firstName'].errors}">
                    <div *ngIf="submitted && f['firstName'].errors" class="invalid-feedback">
                      <div *ngIf="f['firstName'].errors['required']">First Name is required</div>
                      <div *ngIf="f['firstName'].errors['minlength']">First Name must be at least 2 characters</div>
                    </div>
                  </div>
                  
                  <div class="col-md-6">
                    <label for="lastName" class="form-label">Last Name</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="lastName" 
                      formControlName="lastName"
                      [ngClass]="{'is-invalid': submitted && f['lastName'].errors}">
                    <div *ngIf="submitted && f['lastName'].errors" class="invalid-feedback">
                      <div *ngIf="f['lastName'].errors['required']">Last Name is required</div>
                      <div *ngIf="f['lastName'].errors['minlength']">Last Name must be at least 2 characters</div>
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
                    [ngClass]="{'is-invalid': submitted && f['email'].errors}">
                  <div *ngIf="submitted && f['email'].errors" class="invalid-feedback">
                    <div *ngIf="f['email'].errors['required']">Email is required</div>
                    <div *ngIf="f['email'].errors['email']">Email must be a valid email address</div>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="username" class="form-label">Username</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="username" 
                    formControlName="username"
                    [ngClass]="{'is-invalid': submitted && f['username'].errors}">
                  <div *ngIf="submitted && f['username'].errors" class="invalid-feedback">
                    <div *ngIf="f['username'].errors['required']">Username is required</div>
                    <div *ngIf="f['username'].errors['minlength']">Username must be at least 3 characters</div>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <input 
                    type="password" 
                    class="form-control" 
                    id="password" 
                    formControlName="password"
                    [ngClass]="{'is-invalid': submitted && f['password'].errors}">
                  <div *ngIf="submitted && f['password'].errors" class="invalid-feedback">
                    <div *ngIf="f['password'].errors['required']">Password is required</div>
                    <div *ngIf="f['password'].errors['minlength']">Password must be at least 6 characters</div>
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Account Type</label>
                  <div class="form-check">
                    <input 
                      class="form-check-input" 
                      type="radio" 
                      name="role" 
                      id="jobSeeker" 
                      value="jobseeker" 
                      formControlName="role">
                    <label class="form-check-label" for="jobSeeker">
                      Job Seeker - I want to find a job
                    </label>
                  </div>
                  <div class="form-check">
                    <input 
                      class="form-check-input" 
                      type="radio" 
                      name="role" 
                      id="recruiter" 
                      value="recruiter" 
                      formControlName="role">
                    <label class="form-check-label" for="recruiter">
                      Recruiter - I want to post jobs
                    </label>
                  </div>
                  <div *ngIf="submitted && f['role'].errors" class="text-danger small">
                    <div *ngIf="f['role'].errors['required']">Please select an account type</div>
                  </div>
                </div>

                <div class="d-grid gap-2">
                  <button 
                    type="submit" 
                    class="btn btn-primary" 
                    [disabled]="loading">
                    <span *ngIf="loading" class="spinner-border spinner-border-sm me-1"></span>
                    Register
                  </button>
                </div>
              </form>
            </div>
            <div class="card-footer text-center">
              <p class="mb-0">Already have an account? <a routerLink="/login">Login here</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  success = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
    
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['jobseeker', Validators.required]
    });
  }

  // Getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';
    this.success = '';

    // Stop if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.register(this.registerForm.value)
      .subscribe({
        next: () => {
          this.success = 'Registration successful! You can now log in.';
          this.loading = false;
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: error => {
          this.error = error?.error?.message || 'Registration failed. Please try again.';
          this.loading = false;
        }
      });
  }
}
