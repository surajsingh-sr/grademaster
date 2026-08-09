import type {
  GradeScaleRow,
  PercentageFormulaOption,
  PerformanceLevel,
  SchoolSubjectEntry,
  SemesterEntry,
  SubjectEntry,
} from "@/types";

export function round(value: number, decimals = 2): number {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

// ---- CGPA: credit-weighted average of semester SGPAs -----------------------
export function calculateCGPA(semesters: SemesterEntry[]): number {
  const valid = semesters.filter((s) => s.sgpa > 0);
  if (valid.length === 0) return 0;
  const totalPoints = valid.reduce((sum, s) => sum + s.sgpa * (s.credits || 1), 0);
  const totalCredits = valid.reduce((sum, s) => sum + (s.credits || 1), 0);
  return totalCredits === 0 ? 0 : round(totalPoints / totalCredits);
}

// ---- SGPA: credit-weighted average of subject grade points -----------------
export function marksToGradePoint(marks: number, maxMarks: number): number {
  if (maxMarks <= 0) return 0;
  const percent = (marks / maxMarks) * 100;
  return round(Math.min(Math.max(percent / 9.5, 0), 10));
}

export function calculateSGPA(subjects: SubjectEntry[]): number {
  const valid = subjects.filter((s) => s.maxMarks > 0);
  if (valid.length === 0) return 0;
  const totalPoints = valid.reduce(
    (sum, s) => sum + marksToGradePoint(s.marks, s.maxMarks) * (s.credit || 1),
    0,
  );
  const totalCredits = valid.reduce((sum, s) => sum + (s.credit || 1), 0);
  return totalCredits === 0 ? 0 : round(totalPoints / totalCredits);
}

// ---- Percentage formulas (CGPA -> %) ----------------------------------------
export const PERCENTAGE_FORMULAS: PercentageFormulaOption[] = [
  { value: "cgpa_9_5", label: "Percentage = CGPA × 9.5", compute: (c) => round(c * 9.5) },
  { value: "cgpa_9_25", label: "Percentage = CGPA × 9.25", compute: (c) => round(c * 9.25) },
];

export function cgpaToPercentage(cgpa: number, formulaId: string): number {
  const formula = PERCENTAGE_FORMULAS.find((f) => f.value === formulaId) ?? PERCENTAGE_FORMULAS[0];
  return Math.min(Math.max(formula.compute(cgpa), 0), 100);
}

export function percentageToCgpa(percentage: number, formulaId: string): number {
  const divisor = formulaId === "cgpa_9_25" ? 9.25 : 9.5;
  return round(Math.min(Math.max(percentage / divisor, 0), 10));
}

// ---- Grade scale --------------------------------------------------------------
export const GRADE_SCALE: GradeScaleRow[] = [
  { grade: "O", minPercent: 90, maxPercent: 100, gradePoint: 10 },
  { grade: "A+", minPercent: 80, maxPercent: 89.99, gradePoint: 9 },
  { grade: "A", minPercent: 70, maxPercent: 79.99, gradePoint: 8 },
  { grade: "B+", minPercent: 60, maxPercent: 69.99, gradePoint: 7 },
  { grade: "B", minPercent: 55, maxPercent: 59.99, gradePoint: 6 },
  { grade: "C", minPercent: 50, maxPercent: 54.99, gradePoint: 5 },
  { grade: "P", minPercent: 40, maxPercent: 49.99, gradePoint: 4 },
  { grade: "F", minPercent: 0, maxPercent: 39.99, gradePoint: 0 },
];

export function marksToGrade(marks: number, maxMarks: number): GradeScaleRow {
  const percent = maxMarks > 0 ? (marks / maxMarks) * 100 : 0;
  return (
    GRADE_SCALE.find((r) => percent >= r.minPercent && percent <= r.maxPercent) ??
    GRADE_SCALE[GRADE_SCALE.length - 1]
  );
}

export function gradeToGradePoint(grade: string): number {
  return GRADE_SCALE.find((r) => r.grade.toLowerCase() === grade.toLowerCase())?.gradePoint ?? 0;
}

export function cgpaToGrade(cgpa: number): GradeScaleRow {
  return GRADE_SCALE.find((r) => cgpa >= r.gradePoint) ?? GRADE_SCALE[GRADE_SCALE.length - 1];
}

export function gradePointTo4Scale(gradePoint10: number): number {
  return round((gradePoint10 / 10) * 4);
}

export function calculateGPA(grades: { gradePoint: number; credit: number }[]): number {
  const valid = grades.filter((g) => g.credit > 0);
  if (valid.length === 0) return 0;
  const totalPoints = valid.reduce((sum, g) => sum + g.gradePoint * g.credit, 0);
  const totalCredits = valid.reduce((sum, g) => sum + g.credit, 0);
  return totalCredits === 0 ? 0 : round(totalPoints / totalCredits);
}

// ---- School section: total marks & percentage --------------------------------
export function calculateSchoolTotals(subjects: SchoolSubjectEntry[]) {
  const totalMarks = subjects.reduce((sum, s) => sum + (s.marks || 0), 0);
  const maxMarks = subjects.reduce((sum, s) => sum + (s.maxMarks || 0), 0);
  const percentage = maxMarks > 0 ? round((totalMarks / maxMarks) * 100) : 0;
  return { totalMarks: round(totalMarks), maxMarks: round(maxMarks), percentage };
}

export function percentageToMarks(percentage: number, totalMaxMarks: number): number {
  return round((percentage / 100) * totalMaxMarks);
}

export function marksToPercentage(marks: number, totalMaxMarks: number): number {
  return totalMaxMarks <= 0 ? 0 : round((marks / totalMaxMarks) * 100);
}

// ---- Semester performance stats ------------------------------------------------
export function calculateSemesterPerformance(semesters: SemesterEntry[]) {
  const valid = semesters.filter((s) => s.sgpa > 0);
  if (valid.length === 0) return { highest: 0, lowest: 0, average: 0, totalCredits: 0 };
  const sgpas = valid.map((s) => s.sgpa);
  const totalCredits = valid.reduce((sum, s) => sum + (s.credits || 1), 0);
  return {
    highest: round(Math.max(...sgpas)),
    lowest: round(Math.min(...sgpas)),
    average: round(sgpas.reduce((a, b) => a + b, 0) / sgpas.length),
    totalCredits: round(totalCredits),
  };
}

// ---- Performance level classification ------------------------------------------
export function getPerformanceLevel(cgpaOn10Scale: number): PerformanceLevel {
  if (cgpaOn10Scale >= 9) return "Excellent";
  if (cgpaOn10Scale >= 8) return "Very Good";
  if (cgpaOn10Scale >= 7) return "Good";
  if (cgpaOn10Scale >= 6) return "Average";
  return "Needs Improvement";
}

export function getPerformanceLevelFromPercentage(percentage: number): PerformanceLevel {
  if (percentage >= 85) return "Excellent";
  if (percentage >= 70) return "Very Good";
  if (percentage >= 55) return "Good";
  if (percentage >= 40) return "Average";
  return "Needs Improvement";
}

export const PERFORMANCE_COLORS: Record<PerformanceLevel, string> = {
  Excellent: "#10b981",
  "Very Good": "#3b82f6",
  Good: "#6366f1",
  Average: "#f59e0b",
  "Needs Improvement": "#ef4444",
};

export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}
