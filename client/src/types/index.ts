export interface AcademicYear {
  _id: string;
  year: string;
  isActive: boolean;
  sectionCount?: number;
  teamCount?: number;
  projectCount?: number;
  createdAt: string;
}

export interface Section {
  _id: string;
  yearId: string | AcademicYear;
  name: string;
  teamCount?: number;
  projectCount?: number;
  createdAt: string;
}

export interface Team {
  _id: string;
  yearId: AcademicYear | string;
  sectionId: Section | string;
  name: string;
  members: string[];
  teamLeadName: string;
  teamLeadEmail: string;
  isSubmitted: boolean;
  createdAt: string;
}

export interface RatingCriteria {
  technicalApproach: number; // max 15
  uiUxDesign: number;        // max 15
  designThinking: number;    // max 10
  functionality: number;     // max 20
  innovation: number;        // max 15
  projectQuality: number;    // max 10
  problemSolving: number;    // max 15
}

export interface Rating {
  _id: string;
  projectId: string;
  teacherId: {
    _id: string;
    name: string;
    email: string;
  };
  criteria: RatingCriteria;
  totalScore: number;
  feedback: string;
  evaluatedAt: string;
}

export interface Project {
  _id: string;
  teamId: Team;
  yearId: AcademicYear;
  sectionId: Section;
  title: string;
  description: string;
  liveUrl: string;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'RATED';
  ratingId?: Rating | null;
  submittedAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'TEACHER' | 'ADMIN' | 'TEAM_LEAD';
  teamId?: string;
  sectionId?: string;
  yearId?: string;
}
