import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JobService } from '../../../core/services/job.service';
import { Job, JobRequest } from '../../../core/models/models';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-job-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './job-form.component.html',
  styleUrls: ['./job-form.component.scss']
})
export class JobFormComponent implements OnInit {
  jobForm!: FormGroup;
  isEditMode = false;
  jobId: number | null = null;
  loading = false;
  submitting = false;
  submitted = false; // Add this flag for form validation
  job: Job | null = null;
  error = '';
  newSkill = ''; // Add field for adding new skills
  skillsArray!: FormArray; // Add form array for skills

  constructor(
    private fb: FormBuilder,
    private jobService: JobService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.initForm();
    
    // Check if we're editing an existing job
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.jobId = +id;
      this.loadJobDetails(this.jobId);
    }
  }

  initForm(): void {
    this.skillsArray = this.fb.array([], Validators.required);
    
    this.jobForm = this.fb.group({
      title: ['', Validators.required],
      company: ['', Validators.required],
      location: [''],
      remote: [false],
      description: ['', [Validators.required, Validators.minLength(50)]],
      requirements: ['', Validators.required],
      salary: [''],
      jobType: ['FULL_TIME', Validators.required],
      experience: ['ENTRY_LEVEL', Validators.required],
      skills: this.skillsArray,
      benefits: [''],
      closingDate: ['']
    });
  }
  
  // Getter for easy access to form fields
  get f() { 
    return this.jobForm.controls; 
  }
  
  // Methods for managing skills
  addSkill() {
    if (this.newSkill.trim()) {
      this.skillsArray.push(this.fb.control(this.newSkill.trim()));
      this.newSkill = '';
    }
  }
  
  removeSkill(index: number) {
    this.skillsArray.removeAt(index);
  }

  loadJobDetails(jobId: number): void {
    this.loading = true;
    this.jobService.getJobById(jobId).subscribe({
      next: (job) => {
        this.job = job;
        this.populateForm(job);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load job details. Please try again.';
        this.loading = false;
        console.error('Error fetching job:', err);
      }
    });
  }

  populateForm(job: Job): void {
    // Clear existing skills and add job skills one by one
    this.skillsArray.clear();
    const skills = job.requiredSkills || job.skills || [];
    
    skills.forEach(skill => {
      this.skillsArray.push(this.fb.control(skill));
    });
    
    const benefitsString = job.benefits ? job.benefits.join(', ') : '';

    this.jobForm.patchValue({
      title: job.title,
      company: job.company || (job.recruiter?.companyName || ''),
      location: job.location || '',
      remote: job.remoteAllowed || job.remote || false,
      description: job.description,
      requirements: job.description, // Assuming requirements might be part of description
      salary: job.salary || '',
      jobType: job.jobType || 'FULL_TIME',
      experience: job.experienceLevel || job.experience || 'ENTRY_LEVEL',
      benefits: benefitsString,
      closingDate: job.closingDate || ''
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.jobForm.invalid) {
      return;
    }

    this.submitting = true;
    const formValue = this.jobForm.value;
    
    // Convert skills array to expected format
    const jobData: JobRequest = {
      title: formValue.title,
      company: formValue.company,
      location: formValue.location || '',
      remote: formValue.remote,
      description: formValue.description,
      salary: formValue.salary || undefined,
      jobType: formValue.jobType,
      experience: formValue.experience,
      skills: formValue.skills, // This is already an array from FormArray
      active: true
    };

    if (this.isEditMode && this.jobId) {
      this.updateJob(this.jobId, jobData);
    } else {
      this.createJob(jobData);
    }
  }

  createJob(jobData: JobRequest): void {
    this.jobService.createJob(jobData).subscribe({
      next: (job) => {
        this.notificationService.showSuccess('Success', 'Job posted successfully');
        this.router.navigate(['/recruiter']);
        this.submitting = false;
      },
      error: (err) => {
        this.error = 'Failed to create job. Please try again.';
        this.submitting = false;
        console.error('Error creating job:', err);
      }
    });
  }

  updateJob(jobId: number, jobData: JobRequest): void {
    this.jobService.updateJob(jobId, jobData).subscribe({
      next: (job) => {
        this.notificationService.showSuccess('Success', 'Job updated successfully');
        this.router.navigate(['/recruiter']);
        this.submitting = false;
      },
      error: (err) => {
        this.error = 'Failed to update job. Please try again.';
        this.submitting = false;
        console.error('Error updating job:', err);
      }
    });
  }

  cancelEdit(): void {
    this.router.navigate(['/recruiter']);
  }
}
