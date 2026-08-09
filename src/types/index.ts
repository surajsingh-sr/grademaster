export type EducationLevel = "college" | "school";

export type PerformanceLevel =
  | "Excellent"
  | "Very Good"
  | "Good"
  | "Average"
  | "Needs Improvement";

export interface SemesterEntry {
  id: string;
  label: string;
  sgpa: number;
  credits: number;
}

export interface SubjectEntry {
  id: string;
  name: string;
  marks: number;
  maxMarks: number;
  credit: number;
}

export interface SchoolSubjectEntry {
  id: string;
  name: string;
  marks: number;
  maxMarks: number;
}

export interface GradeScaleRow {
  grade: string;
  minPercent: number;
  maxPercent: number;
  gradePoint: number;
}

export type PercentageFormula = "cgpa_9_5" | "cgpa_9_25";

export interface PercentageFormulaOption {
  value: PercentageFormula;
  label: string;
  compute: (cgpa: number) => number;
}

export interface CalculationSummary {
  id: string;
  createdAt: string;
  type: string;
  level: EducationLevel;
  title: string;
  cgpa?: number;
  sgpa?: number;
  percentage?: number;
  totalMarks?: number;
  maxMarks?: number;
  grade?: string;
  totalCredits?: number;
  performanceLevel?: PerformanceLevel;
}

export interface StudentProfile {
  userId: string;
  name: string;
  email: string;
  institutionType: EducationLevel;
  institutionName: string;
  courseOrClass: string;
  createdAt: string;
}
