import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Job, JobApplication } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private apiUrl = 'http://localhost:8080/api/jobs';

  constructor(private http: HttpClient) { }

  getAllJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(this.apiUrl);
  }

  getJobs(page: number = 0, size: number = 10, keyword?: string, location?: string, jobType?: string): Observable<any> {
    let params: any = { page, size };
    
    if (keyword) params.keyword = keyword;
    if (location) params.location = location;
    if (jobType) params.jobType = jobType;
    
    return this.http.get<any>(`${this.apiUrl}`, { params });
  }

  getJobById(id: number): Observable<Job> {
    return this.http.get<Job>(`${this.apiUrl}/${id}`);
  }

  createJob(job: any): Observable<Job> {
    return this.http.post<Job>(this.apiUrl, job);
  }

  updateJob(id: number, job: any): Observable<Job> {
    return this.http.put<Job>(`${this.apiUrl}/${id}`, job);
  }

  deleteJob(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  searchJobs(params: any): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.apiUrl}/search`, { params });
  }

  getRecruiterJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.apiUrl}/recruiter`);
  }

  getMyJobs(page: number = 0, size: number = 10): Observable<any> {
    const params = { page: page.toString(), size: size.toString() };
    return this.http.get<any>(`${this.apiUrl}/recruiter`, { params });
  }

  applyForJob(jobId: number, application: JobApplication, resumeFile?: FormData | null): Observable<JobApplication> {
    if (resumeFile) {
      // If resume file is provided, use multipart/form-data
      // Add application data to FormData
      resumeFile.append('application', new Blob([JSON.stringify(application)], { type: 'application/json' }));
      return this.http.post<JobApplication>(`${this.apiUrl}/${jobId}/apply`, resumeFile);
    } else {
      // Otherwise, use standard JSON request
      return this.http.post<JobApplication>(`${this.apiUrl}/${jobId}/apply`, application);
    }
  }

  getJobApplications(jobId: number): Observable<JobApplication[]> {
    return this.http.get<JobApplication[]>(`${this.apiUrl}/${jobId}/applications`);
  }

  getMyApplications(): Observable<JobApplication[]> {
    return this.http.get<JobApplication[]>(`${this.apiUrl}/my-applications`);
  }

  updateApplicationStatus(applicationId: number, status: string): Observable<JobApplication> {
    return this.http.put<JobApplication>(`${this.apiUrl}/applications/${applicationId}/status`, null, {
      params: { status }
    });
  }

  // Methods for job seeker dashboard
  getSavedJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.apiUrl}/saved`);
  }

  withdrawApplication(applicationId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/applications/${applicationId}/withdraw`, {});
  }

  unsaveJob(jobId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${jobId}/unsave`);
  }
}
