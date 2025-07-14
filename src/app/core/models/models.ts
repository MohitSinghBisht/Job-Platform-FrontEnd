export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  headline?: string;
  about?: string;
  phoneNumber?: string;
  profilePictureUrl?: string;
  location?: string;
  roles: string[];
}

export interface JobSeekerProfile {
  id: number;
  user: User;
  resumeUrl?: string;
  skills: string[];
  education: Education[];
  experience: Experience[];
  certifications: string[];
  jobPreferences?: string;
  appliedJobs?: Job[];
  savedJobs?: Job[];
}

export interface RecruiterProfile {
  id: number;
  user: User;
  companyName: string;
  companyWebsite?: string;
  companySize?: string;
  industry?: string;
  companyDescription?: string;
  companyLogoUrl?: string;
  hiringManagerTitle?: string;
  postedJobs?: Job[];
}

export interface Education {
  id?: number;
  institutionName: string;
  degree?: string;
  fieldOfStudy?: string;
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
  description?: string;
  grade?: string;
}

export interface Experience {
  id?: number;
  companyName: string;
  title: string;
  location?: string;
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
  description?: string;
  skills: string[];
}

export interface Job {
  id?: number;
  recruiter: RecruiterProfile;
  title: string;
  description: string;
  jobType: string;
  experienceLevel: string;
  location?: string;
  remoteAllowed: boolean;
  salary?: string;
  requiredSkills: string[];
  benefits: string[];
  postedDate: Date;
  closingDate?: Date;
  active: boolean;
  applicants?: JobSeekerProfile[];
  applications?: JobApplication[];
  
  // Backward compatibility fields
  company?: string;
  remote?: boolean;
  experience?: string;
  skills?: string[];
  recruiterId?: number;
  recruiterName?: string;
  createdAt?: string;
  updatedAt?: string;
  applicationCount?: number;
  viewCount?: number;
}

export interface JobApplication {
  id?: number;
  job: Job;
  jobSeeker: JobSeekerProfile;
  applicationDate: Date;
  resumeUrl?: string;
  coverLetter?: string;
  status: ApplicationStatus;
  recruiterNotes?: string;
}

export enum ApplicationStatus {
  APPLIED = 'APPLIED',
  REVIEWING = 'REVIEWING',
  INTERVIEW_SCHEDULED = 'INTERVIEW_SCHEDULED',
  OFFERED = 'OFFERED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN'
}

export interface Notification {
  id: number;
  user: User;
  title: string;
  message: string;
  createdAt: Date;
  isRead: boolean;
  type: NotificationType;
  relatedEntityId?: number;
}

export enum NotificationType {
  JOB_APPLICATION_UPDATE = 'JOB_APPLICATION_UPDATE',
  NEW_JOB_MATCH = 'NEW_JOB_MATCH',
  MESSAGE_RECEIVED = 'MESSAGE_RECEIVED',
  PROFILE_VIEW = 'PROFILE_VIEW',
  SYSTEM = 'SYSTEM'
}

export enum Role {
  ROLE_JOB_SEEKER = 'ROLE_JOB_SEEKER',
  ROLE_RECRUITER = 'ROLE_RECRUITER',
  ROLE_ADMIN = 'ROLE_ADMIN'
}

export interface JobRequest {
  title: string;
  company: string;
  description: string;
  location: string;
  remote: boolean;
  salary?: string;
  jobType: string;
  experience?: string;
  skills: string[];
  active?: boolean;
}
