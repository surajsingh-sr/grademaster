import { GraduationCap, School, Percent, FileText, Award } from "lucide-react";
import { useAuthStore, useAcademicStore } from "@/store/useStore";
import { AnimatedNumber } from "@/components/ResultDisplay";
import { AnalyticsSection } from "@/components/Charts";
import type { EducationLevel } from "@/types";



export function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const activeLevel = useAcademicStore((s) => s.activeLevel);
  const setActiveLevel = useAcademicStore((s) => s.setActiveLevel);
  const college = useAcademicStore((s) => s.college);
  const school = useAcademicStore((s) => s.school);

  const cards =
    activeLevel === "college"
      ? [
          { label: "Current CGPA", value: college.cgpa, icon: GraduationCap, suffix: " / 10" },
          { label: "Current Percentage", value: college.percentage, icon: Percent, suffix: "%" },
          { label: "Total Credits", value: college.totalCredits, icon: FileText, decimals: 0 },
        ]
      : [
          { label: "Percentage", value: school.percentage, icon: Percent, suffix: "%" },
          { label: "Total Marks", value: school.totalMarks, icon: FileText, decimals: 0 },
          { label: "Max Marks", value: school.maxMarks, icon: GraduationCap, decimals: 0 },
        ];

  return (
    <div className="container section">
      <h1 className="section-title" style={{ textAlign: "left" }}>
        Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""} 👋
      </h1>
      <p className="text-muted mt-8">Here's a live snapshot of your academic performance and progress.</p>

      <div className="mt-24 mb-16">
        <div className="level-switch">
          {(["college", "school"] as EducationLevel[]).map((level) => (
            <button key={level} className={activeLevel === level ? "active" : ""} onClick={() => setActiveLevel(level)}>
              {level === "college" ? <GraduationCap size={16} /> : <School size={16} />}
              {level === "college" ? "College" : "School"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid-4">
        {cards.map((c) => (
          <div key={c.label} className="card center-col">
            <span className="icon-circle"><c.icon size={20} /></span>
            <p style={{ fontSize: "1.7rem", fontWeight: 800, fontFamily: "Poppins" }}>
              <AnimatedNumber value={c.value} decimals={c.decimals ?? 2} suffix={c.suffix} />
            </p>
            <p className="text-muted" style={{ fontSize: "0.78rem", marginTop: 4 }}>{c.label}</p>
          </div>
        ))}
        <div className="card center-col">
          <span className="icon-circle"><Award size={20} /></span>
          <p style={{ fontSize: "1.7rem", fontWeight: 800, fontFamily: "Poppins" }}>
            {activeLevel === "college" ? college.grade : school.subjects.length}
          </p>
          <p className="text-muted" style={{ fontSize: "0.78rem", marginTop: 4 }}>
            {activeLevel === "college" ? "Grade" : "Subjects"}
          </p>
        </div>
      </div>

      <div style={{ marginTop: 60 }}>
        <h2 className="mb-16">Progress Analytics</h2>
        <AnalyticsSection />
      </div>
    </div>
  );
}



    