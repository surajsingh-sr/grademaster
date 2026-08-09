import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";
import { useThemeStore, useAcademicStore } from "@/store/useStore";
import { marksToPercentage } from "@/lib/calculations";
import type { SchoolSubjectEntry, SemesterEntry } from "@/types";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend, Filler);

function useChartColors() {
  const theme = useThemeStore((s) => s.theme);
  const isDark = theme === "dark";
  return {
    primary: isDark ? "#ef4444" : "#3b82f6",
    primaryFaded: isDark ? "rgba(239,68,68,0.15)" : "rgba(59,130,246,0.15)",
    secondary: isDark ? "#f43f5e" : "#6366f1",
    grid: isDark ? "rgba(255,255,255,0.06)" : "rgba(15,23,42,0.06)",
    text: isDark ? "rgba(226,232,240,0.7)" : "rgba(51,65,85,0.7)",
    palette: isDark
      ? ["#ef4444", "#f43f5e", "#f59e0b", "#8b5cf6", "#10b981", "#0ea5e9"]
      : ["#3b82f6", "#6366f1", "#0ea5e9", "#10b981", "#f59e0b", "#f43f5e"],
  };
}

// function EmptyState({ message }: { message: string }) {
//   return (
//     <div className="empty-state" style={{ padding: "40px 10px", fontSize: "0.85rem" }}>
//       {message}
//     </div>
//   );
// }

// export function SemesterTrendChart({ semesters }: { semesters: SemesterEntry[] }) {
//   const colors = useChartColors();
//   const valid = semesters.filter((s) => s.sgpa > 0);
//   if (valid.length === 0) return <EmptyState message="Add semester data to see your SGPA trend."/>;

/* =========================================================
   1. SEMESTER TREND CHART
========================================================= */

export function SemesterTrendChart({ semesters }: { semesters: SemesterEntry[] }) {
  const colors = useChartColors();

  // Use real semester data when available; otherwise keep the existing demo data.
  const valid = semesters.filter((s) => s.sgpa > 0);
  const labels = valid.length > 0
    ? valid.map((s) => s.label)
    : ["Semester 1", "Semester 2", "Semester 3"];
  const values = valid.length > 0
    ? valid.map((s) => s.sgpa)
    : [6, 4, 8];

  return (
    <Line
      data={{
        labels,

        datasets: [
          {
            label: "SGPA",
            data: values,

            borderColor: "#ef4444",
            backgroundColor: "rgba(239, 68, 68, 0.16)",

            fill: true,
            tension: 0.4,

            borderWidth: 3,

            pointRadius: 5,
            pointHoverRadius: 7,

            pointBackgroundColor: "#ef4444",
            pointBorderColor: "#ffffff",
            pointBorderWidth: 2,
          },
        ],
      }}

      options={{
        responsive: true,
        maintainAspectRatio: false,

        animation: {
          duration: 1200,
          easing: "easeOutQuart",
        },

        interaction: {
          intersect: false,
          mode: "index",
        },

        plugins: {
          legend: {
            display: false,
          },

          tooltip: {
            backgroundColor: "#111827",
            titleColor: "#ffffff",
            bodyColor: "#e5e7eb",

            borderColor: "#ef4444",
            borderWidth: 1,

            padding: 12,
            cornerRadius: 10,

            callbacks: {
              label: (context) =>
                ` SGPA: ${context.parsed.y?.toFixed(2)}`,
            },
          },
        },

        scales: {
          y: {
            min: 0,
            max: 10,

            grid: {
              color: colors.grid,
            },

            border: {
              display: false,
            },

            ticks: {
              color: colors.text,

              font: {
                size: 11,
              },
            },
          },

          x: {
            grid: {
              display: false,
            },

            border: {
              display: false,
            },

            ticks: {
              color: colors.text,

              font: {
                size: 11,
              },
            },
          },
        },
      }}
    />
  );
}

// export function GpaGrowthChart({ semesters }: { semesters: SemesterEntry[] }) {
//   const colors = useChartColors();
//   const valid = semesters.filter((s) => s.sgpa > 0);
//   if (valid.length === 0) return <EmptyState message="Add semester data to see CGPA growth." />;
//   const cumulative = valid.map((_, idx) => calculateCGPA(valid.slice(0, idx + 1)));

/* =========================================================
   2. GPA GROWTH CHART
========================================================= */

export function GpaGrowthChart({ semesters }: { semesters: SemesterEntry[] }) {
  const colors = useChartColors();

  // Calculate cumulative CGPA from real semester data when available.
  const valid = semesters.filter((s) => s.sgpa > 0);
  const labels = valid.length > 0
    ? valid.map((s) => s.label)
    : ["Semester 1", "Semester 2", "Semester 3"];
  const values = valid.length > 0
    ? valid.map((_, index) => {
        const slice = valid.slice(0, index + 1);
        const total = slice.reduce((sum, s) => sum + s.sgpa, 0);
        return total / slice.length;
      })
    : [6, 5.5, 6.1];

  return (
    <Bar
      data={{
        labels,

        datasets: [
          {
            label: "Cumulative CGPA",

            data: values,

            backgroundColor: [
              "#f43f5e",
              "#f43f5e",
              "#f43f5e",
            ],

            borderRadius: 8,
            borderSkipped: false,

            maxBarThickness: 48,

            hoverBackgroundColor: "#fb7185",
          },
        ],
      }}

      options={{
        responsive: true,
        maintainAspectRatio: false,

        animation: {
          duration: 1000,
          easing: "easeOutQuart",
        },

        plugins: {
          legend: {
            display: false,
          },

          tooltip: {
            backgroundColor: "#111827",

            titleColor: "#ffffff",
            bodyColor: "#e5e7eb",

            padding: 12,
            cornerRadius: 10,

            callbacks: {
              label: (context) =>
                ` CGPA: ${context.parsed.y?.toFixed(2)}`,
            },
          },
        },

        scales: {
          y: {
            min: 0,
            max: 10,

            grid: {
              color: colors.grid,
            },

            border: {
              display: false,
            },

            ticks: {
              color: colors.text,

              font: {
                size: 11,
              },
            },
          },

          x: {
            grid: {
              display: false,
            },

            border: {
              display: false,
            },

            ticks: {
              color: colors.text,

              font: {
                size: 11,
              },
            },
          },
        },
      }}
    />
  );
}

// export function CreditDistributionChart({ semesters }: { semesters: SemesterEntry[] }) {
//   const colors = useChartColors();
//   const valid = semesters.filter((s) => s.sgpa > 0 && s.credits > 0);
//   if (valid.length === 0) return <EmptyState message="Add semester credits to see the distribution." />;


export function CreditDistributionChart({
  semesters,
}: {
  semesters: SemesterEntry[];
}) {
  const colors = useChartColors();

  // Use real semester credits when available; otherwise keep the demo data.
  const valid = semesters.filter((s) => s.credits > 0);
  const hasRealData = valid.length > 0;

  const labels = hasRealData
    ? valid.map((s) => s.label)
    : ["Semester 1", "Semester 2", "Semester 3", "Semester 4"];

  const credits = hasRealData
    ? valid.map((s) => s.credits)
    : [24, 26, 25, 28];

  return (
    <Pie
      data={{
        labels,
        datasets: [
          {
            data: credits,
            backgroundColor: colors.palette,
            borderColor: "transparent",
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: "bottom", labels: { color: colors.text, boxWidth: 12, padding: 14, font: { size: 11 } } } },
      }}
    />
  );
}

// export function PerformanceAnalysisChart({
//   semesters = [],
//   schoolS

// export function PerformanceAnalysisChart({
//   semesters = [],
//   schoolSubjects = [],
// }: {
//   semesters?: SemesterEntry[];
//   schoolSubjects?: SchoolSubjectEntry[];
// }) {
//   const colors = useChartColors();
//   const useCollege = semesters.some((s) => s.sgpa > 0);
//   const useSchool = schoolSubjects.some((s) => s.maxMarks > 0);

//   let labels: string[] = [];
//   let values: number[] = [];
//   if (useCollege) {
//     const valid = semesters.filter((s) => s.sgpa > 0);
//     labels = valid.map((s) => s.label);
//     values = valid.map((s) => s.sgpa * 10);
//   } else if (useSchool) {
//     const valid = schoolSubjects.filter((s) => s.maxMarks > 0);
//     labels = valid.map((s) => s.name);
//     values = valid.map((s) => marksToPercentage(s.marks, s.maxMarks));
//   }

//   if (labels.length === 0) return <EmptyState message="Add data to see the performance analysis." />;

export function PerformanceAnalysisChart({
  semesters = [],
  schoolSubjects = [],
}: {
  semesters?: SemesterEntry[];
  schoolSubjects?: SchoolSubjectEntry[];
}) {
  const colors = useChartColors();

  const useCollege = semesters.some((s) => s.sgpa > 0);
  const useSchool = schoolSubjects.some((s) => s.maxMarks > 0);

  let labels: string[] = [];
  let values: number[] = [];

  if (useCollege) {
    const valid = semesters.filter((s) => s.sgpa > 0);

    labels = valid.map((s) => s.label);
    values = valid.map((s) => s.sgpa * 10);
  } else if (useSchool) {
    const valid = schoolSubjects.filter((s) => s.maxMarks > 0);

    labels = valid.map((s) => s.name);
    values = valid.map((s) =>
      marksToPercentage(s.marks, s.maxMarks)
    );
  } else {
    // Default chart data
    labels = [
      "Mathematics",
      "Programming",
      "Database",
      "Computer Networks",
      "English",
      "Data Structures",
    ];

    values = [82, 91, 76, 68, 88, 94];
  }

  return (
    <Bar
      data={{
        labels,
        datasets: [
          {
            label: "Performance (%)",
            data: values,
            backgroundColor: values.map((v) => (v >= 85 ? "#10b981" : v >= 70 ? colors.primary : v >= 55 ? colors.secondary : "#f59e0b")),
            borderRadius: 8,
            maxBarThickness: 36,
          },
        ],
      }}
      options={{
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { min: 0, max: 100, grid: { color: colors.grid }, ticks: { color: colors.text } },
          y: { grid: { display: false }, ticks: { color: colors.text } },
        },
      }}
    />
  );
}

/** Combined 4-chart analytics grid used on both the calculators page and dashboard. */
export function AnalyticsSection() {
  const activeLevel = useAcademicStore((s) => s.activeLevel);
  const semesters = useAcademicStore((s) => s.college.semesters);
  const schoolSubjects = useAcademicStore((s) => s.school.subjects);

  return (
    <div className="grid-2">
      <div className="card">
        <h4 className="mb-16"> Trend</h4>
        <div className="chart-box"><SemesterTrendChart semesters={semesters} /></div>
      </div>
      <div className="card">
        <h4 className="mb-16"> Growth</h4>
        <div className="chart-box"><GpaGrowthChart semesters={semesters} /></div>
      </div>
      <div className="card">
        <h4 className="mb-16">Credit</h4>
        <div className="chart-box"><CreditDistributionChart semesters={semesters} /></div>
      </div>
      <div className="card">
        <h4 className="mb-16">Performance Analysis</h4>
        <div className="chart-box">
          <PerformanceAnalysisChart
            semesters={activeLevel === "college" ? semesters : []}
            schoolSubjects={activeLevel === "school" ? schoolSubjects : []}
          />
        </div>
      </div>
    </div>
  );
}