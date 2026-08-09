import { useState } from "react";
import { GraduationCap, School } from "lucide-react";
import { useAcademicStore } from "@/store/useStore";
import { AnalyticsSection } from "@/components/Charts";
import {
  CGPACalculator,
  SGPACalculator,
  PercentageCalculator,
  GPACalculator,
  GradeCalculator,
  PercentageToCGPACalculator,
  CGPAToPercentageCalculator,
  SemesterPerformanceCalculator,
  SchoolTotalMarksCalculator,
  SchoolMarksToPercentageCalculator,
  SchoolPercentageToMarksCalculator,
} from "@/components/Calculators";
import type { EducationLevel } from "@/types";

const COLLEGE_TABS = [
  { id: "cgpa", label: "CGPA", Component: CGPACalculator },
  { id: "sgpa", label: "SGPA", Component: SGPACalculator },
  { id: "percentage", label: "Percentage", Component: PercentageCalculator },
  { id: "gpa", label: "GPA", Component: GPACalculator },
  { id: "grade", label: "Grade", Component: GradeCalculator },
  { id: "pct-to-cgpa", label: "% → SCGPA", Component: PercentageToCGPACalculator },
  { id: "cgpa-to-pct", label: "SCGPA → %", Component: CGPAToPercentageCalculator },
  { id: "semester-perf", label: "Semester Stats", Component: SemesterPerformanceCalculator },
] as const;

const SCHOOL_TABS = [
  { id: "school-total", label: "Total Marks", Component: SchoolTotalMarksCalculator },
  { id: "school-pct", label: "Marks → %", Component: SchoolMarksToPercentageCalculator },
  { id: "school-marks", label: "% → Marks", Component: SchoolPercentageToMarksCalculator },
] as const;

export function CalculatorsPage() {
  const activeLevel = useAcademicStore((s) => s.activeLevel);
  const setActiveLevel = useAcademicStore((s) => s.setActiveLevel);
  const tabs = activeLevel === "college" ? COLLEGE_TABS : SCHOOL_TABS;
  const [activeTab, setActiveTab] = useState<string>(tabs[0].id);

  function switchLevel(level: EducationLevel) {
    setActiveLevel(level);
    setActiveTab(level === "college" ? COLLEGE_TABS[0].id : SCHOOL_TABS[0].id);
  }

  const ActiveComponent = tabs.find((t) => t.id === activeTab)?.Component ?? tabs[0].Component;

  return (
    <div className="container section">
      <div className="text-center mb-16">
        <h1 className="section-title">
          Academic <span className="gradient-text">Calculators</span>
        </h1>
        <p className="section-subtitle">
          Choose your education level, then pick a calculator — results update live as you type.
        </p>
      </div>

      <div className="text-center mt-24 mb-16">
        <div className="level-switch">
          {(["college", "school"] as EducationLevel[]).map((level) => (
            <button key={level} className={activeLevel === level ? "active" : ""} onClick={() => switchLevel(level)}>
              {level === "college" ? <GraduationCap size={16} /> : <School size={16} />}
              {level === "college" ? "College / University" : "School Board Exam"}
            </button>
          ))}
        </div>
      </div>

      <div className="tabs" style={{ justifyContent: "center" }}>
        {tabs.map((tab) => (
          <button key={tab.id} className={`tab ${activeTab === tab.id ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="fade-in" key={activeTab}>
        <ActiveComponent />
      </div>

      <div className="mt-40" style={{ marginTop: 80 }}>
        <h2 className="section-title" style={{ fontSize: "1.8rem" }}>
          Performance <span className="gradient-text">Analytics</span>
        </h2>
        <div className="mt-24">
          <AnalyticsSection />
        </div>
      </div>
    </div>
  );
}
