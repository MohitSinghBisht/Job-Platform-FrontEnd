import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JobSeekerProfile, RecruiterProfile, Education, Experience } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'http://localhost:8080/api/profile';

  constructor(private http: HttpClient) { }

  getJobSeekerProfile(): Observable<JobSeekerProfile> {
    return this.http.get<JobSeekerProfile>(`${this.apiUrl}/job-seeker`);
  }

  updateJobSeekerProfile(profile: JobSeekerProfile): Observable<JobSeekerProfile> {
    return this.http.put<JobSeekerProfile>(`${this.apiUrl}/job-seeker`, profile);
  }

  getRecruiterProfile(): Observable<RecruiterProfile> {
    return this.http.get<RecruiterProfile>(`${this.apiUrl}/recruiter`);
  }

  updateRecruiterProfile(profile: RecruiterProfile): Observable<RecruiterProfile> {
    return this.http.put<RecruiterProfile>(`${this.apiUrl}/recruiter`, profile);
  }

  getRecommendedJobs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/recommended-jobs`);
  }

  // Education
  addEducation(education: Education): Observable<Education> {
    return this.http.post<Education>(`${this.apiUrl}/education`, education);
  }

  updateEducation(id: number, education: Education): Observable<Education> {
    return this.http.put<Education>(`${this.apiUrl}/education/${id}`, education);
  }

  deleteEducation(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/education/${id}`);
  }

  // Experience
  addExperience(experience: Experience): Observable<Experience> {
    return this.http.post<Experience>(`${this.apiUrl}/experience`, experience);
  }

  updateExperience(id: number, experience: Experience): Observable<Experience> {
    return this.http.put<Experience>(`${this.apiUrl}/experience/${id}`, experience);
  }

  deleteExperience(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/experience/${id}`);
  }

  updateUserProfile(profileData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/user`, profileData);
  }

  updatePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/password`, {
      currentPassword,
      newPassword
    });
  }
}
