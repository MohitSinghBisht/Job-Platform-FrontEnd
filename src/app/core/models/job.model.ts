export interface Job {
  id: number;
  title: string;
  company: string;
  description: string;
  location: string;
  remote: boolean;
  salary?: string;
  jobType: string; // FULL_TIME, PART_TIME, CONTRACT, FREELANCE, INTERNSHIP
  experience?: string; // ENTRY, MID, SENIOR, EXECUTIVE
  skills: string[];
  recruiterId: number;
  recruiterName?: string;
  createdAt: string;
  updatedAt: string;
  active: boolean;
  applicationCount?: number;
  viewCount?: number;
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

export interface Page<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}
