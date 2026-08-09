import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ID } from "appwrite";
import { account, appwriteConfig, databases } from "@/lib/appwrite";
import {
  calculateCGPA,
  calculateSchoolTotals,
  calculateSemesterPerformance,
  cgpaToGrade,
  cgpaToPercentage,
  generateId,
  getPerformanceLevel,
  getPerformanceLevelFromPercentage,
} from "@/lib/calculations";
import type {
  CalculationSummary,
  EducationLevel,
  PerformanceLevel,
  SchoolSubjectEntry,
  SemesterEntry,
  StudentProfile,
} from "@/types";

// ---------------------------------------------------------------------------
// 1) THEME
// ---------------------------------------------------------------------------
export type Theme = "light" | "dark";

function applyThemeClass(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

interface ThemeSlice {
  theme: Theme;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeSlice>()(
  persist(
    (set, get) => ({
      theme: window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
      toggleTheme: () => {
        const next: Theme = get().theme === "light" ? "dark" : "light";
        applyThemeClass(next);
        set({ theme: next });
      },
    }),
    {
      name: "gm-theme",
      onRehydrateStorage: () => (state) => {
        if (state) applyThemeClass(state.theme);
      },
    },
  ),
);

// ---------------------------------------------------------------------------
// 2) ACADEMIC STATE (shared between calculators, dashboard, charts)
// ---------------------------------------------------------------------------
interface CollegeSnapshot {
  semesters: SemesterEntry[];
  formulaId: string;
  cgpa: number;
  percentage: number;
  grade: string;
  totalCredits: number;
  performanceLevel: PerformanceLevel;
}

interface SchoolSnapshot {
  subjects: SchoolSubjectEntry[];
  totalMarks: number;
  maxMarks: number;
  percentage: number;
  performanceLevel: PerformanceLevel;
}

interface AcademicSlice {
  activeLevel: EducationLevel;
  setActiveLevel: (level: EducationLevel) => void;
  college: CollegeSnapshot;
  updateCollegeSemesters: (semesters: SemesterEntry[], formulaId?: string) => void;
  school: SchoolSnapshot;
  updateSchoolSubjects: (subjects: SchoolSubjectEntry[]) => void;
}

export const useAcademicStore = create<AcademicSlice>()(
  persist(
    (set) => ({
      activeLevel: "college",
      setActiveLevel: (level) => set({ activeLevel: level }),

      college: {
        semesters: [],
        formulaId: "cgpa_9_5",
        cgpa: 0,
        percentage: 0,
        grade: "-",
        totalCredits: 0,
        performanceLevel: "Needs Improvement",
      },
      updateCollegeSemesters: (semesters, formulaId) =>
        set((state) => {
          const usedFormula = formulaId ?? state.college.formulaId;
          const cgpa = calculateCGPA(semesters);
          const { totalCredits } = calculateSemesterPerformance(semesters);
          return {
            college: {
              semesters,
              formulaId: usedFormula,
              cgpa,
              percentage: cgpaToPercentage(cgpa, usedFormula),
              grade: cgpaToGrade(cgpa).grade,
              totalCredits,
              performanceLevel: getPerformanceLevel(cgpa),
            },
          };
        }),

      school: {
        subjects: [],
        totalMarks: 0,
        maxMarks: 0,
        percentage: 0,
        performanceLevel: "Needs Improvement",
      },
      updateSchoolSubjects: (subjects) =>
        set(() => {
          const { totalMarks, maxMarks, percentage } = calculateSchoolTotals(subjects);
          return {
            school: {
              subjects,
              totalMarks,
              maxMarks,
              percentage,
              performanceLevel: getPerformanceLevelFromPercentage(percentage),
            },
          };
        }),
    }),
    { name: "gm-academic" },
  ),
);

// ---------------------------------------------------------------------------
// 3) HISTORY (permanent localStorage)
// ---------------------------------------------------------------------------
interface HistorySlice {
  entries: CalculationSummary[];
  addEntry: (entry: Omit<CalculationSummary, "id" | "createdAt">) => void;
  removeEntry: (id: string) => void;
  clearHistory: () => void;
}

export const useHistoryStore = create<HistorySlice>()(
  persist(
    (set) => ({
      entries: [],
      addEntry: (entry) =>
        set((state) => ({
          entries: [{ ...entry, id: generateId(), createdAt: new Date().toISOString() }, ...state.entries],
        })),
      removeEntry: (id) => set((state) => ({ entries: state.entries.filter((e) => e.id !== id) })),
      clearHistory: () => set({ entries: [] }),
    }),
    { name: "gm-history" },
  ),
);

// ---------------------------------------------------------------------------
// 4) AUTH (wired to live Appwrite Account + Database)
// ---------------------------------------------------------------------------
interface AuthSlice {
  user: StudentProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  initSession: () => Promise<void>;
  signUp: (data: {
    name: string;
    email: string;
    password: string;
    institutionType: EducationLevel;
    institutionName: string;
    courseOrClass: string;
  }) => Promise<void>;
  signIn: (data: { email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthSlice>()((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,

  initSession: async () => {
    set({ isLoading: true });
    try {
      const current = await account.get();
      set({
        user: {
          userId: current.$id,
          name: current.name,
          email: current.email,
          institutionType: "college",
          institutionName: "",
          courseOrClass: "",
          createdAt: current.$createdAt,
        },
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  signUp: async ({ name, email, password, institutionType, institutionName, courseOrClass }) => {
    set({ isLoading: true, error: null });
    try {
      const newAccount = await account.create(ID.unique(), email, password, name);
      await account.createEmailPasswordSession(email, password);
      const profile: StudentProfile = {
        userId: newAccount.$id,
        name,
        email,
        institutionType,
        institutionName,
        courseOrClass,
        createdAt: new Date().toISOString(),
      };
      try {
        await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.profilesCollectionId,
          newAccount.$id,
          profile,
        );
      } catch {
        /* profiles collection may not exist yet — auth still succeeds */
      }
      set({ user: profile, isAuthenticated: true, isLoading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sign up failed.";
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  signIn: async ({ email, password }) => {
    set({ isLoading: true, error: null });
    try {
      await account.createEmailPasswordSession(email, password);
      const current = await account.get();
      set({
        user: {
          userId: current.$id,
          name: current.name,
          email: current.email,
          institutionType: "college",
          institutionName: "",
          courseOrClass: "",
          createdAt: current.$createdAt,
        },
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Invalid email or password.";
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  signOut: async () => {
    try {
      await account.deleteSession("current");
    } finally {
      set({ user: null, isAuthenticated: false });
    }
  },
}));
