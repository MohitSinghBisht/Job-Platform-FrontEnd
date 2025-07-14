import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { JobSeekerDashboardComponent } from './features/job-seeker/job-seeker-dashboard/job-seeker-dashboard.component';
import { NotificationListComponent } from './features/notifications/notification-list/notification-list.component';
import { JobFormComponent } from './features/recruiter/job-form/job-form.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'jobs',
    loadComponent: () => import('./features/jobs/job-list/job-list.component').then(m => m.JobListComponent)
  },
  {
    path: 'jobs/:id',
    loadComponent: () => import('./features/jobs/job-details/job-details.component').then(m => m.JobDetailsComponent)
  },
  {
    path: 'jobs/:id/apply',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ROLE_JOB_SEEKER'] },
    loadComponent: () => import('./features/jobs/job-application/job-application.component').then(m => m.JobApplicationComponent)
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./features/profile/profile-dashboard/profile-dashboard.component').then(m => m.ProfileDashboardComponent)
  },
  {
    path: 'recruiter',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ROLE_RECRUITER'] },
    loadComponent: () => import('./features/recruiter/recruiter-dashboard/recruiter-dashboard.component').then(m => m.RecruiterDashboardComponent)
  },
  {
    path: 'recruiter/jobs/new',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ROLE_RECRUITER'] },
    component: JobFormComponent
  },
  {
    path: 'recruiter/jobs/:id/edit',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ROLE_RECRUITER'] },
    component: JobFormComponent
  },
  {
    path: 'job-seeker',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ROLE_JOB_SEEKER'] },
    component: JobSeekerDashboardComponent
  },
  {
    path: 'notifications',
    canActivate: [authGuard],
    component: NotificationListComponent
  },
  {
    path: '**',
    loadComponent: () => import('./core/components/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
