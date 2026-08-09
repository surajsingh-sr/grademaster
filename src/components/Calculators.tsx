import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/Button";
import { FloatingInput, SelectField } from "@/components/FormFields";
import { ResultCard } from "@/components/ResultDisplay";
import { useAcademicStore, useHistoryStore } from "@/store/useStore";
import { useToast } from "@/components/Toast";
import {
  GRADE_SCALE,
  PERCENTAGE_FORMULAS,
  calculateCGPA,
  calculateGPA,
  calculateSGPA,
  calculateSchoolTotals,
  calculateSemesterPerformance,
  cgpaToGrade,
  cgpaToPercentage,
  generateId,
  getPerformanceLevel,
  getPerformanceLevelFromPercentage,
  gradePointTo4Scale,
  gradeToGradePoint,
  marksToGrade,
  marksToGradePoint,
  marksToPercentage,
  percentageToCgpa,
  percentageToMarks,
} from "@/lib/calculations";
import type { SchoolSubjectEntry, SemesterEntry, SubjectEntry } from "@/types";

/* ======================================================================== */
/* Shared validation helpers                                                 */
/* ======================================================================== */
function isNonNegative(n: number): boolean {
  return !Number.isNaN(n) && n >= 0;
}

/* ======================================================================== */
/* 1. CGPA CALCULATOR                                                        */
/* ======================================================================== */
export function CGPACalculator() {
  const updateCollegeSemesters = useAcademicStore((s) => s.updateCollegeSemesters);
  const formulaId = useAcademicStore((s) => s.college.formulaId);
  const addEntry = useHistoryStore((s) => s.addEntry);
  const { showToast } = useToast();

  const [semesters, setSemesters] = useState<SemesterEntry[]>([
    { id: generateId(), label: "Semester 1", sgpa: 0, credits: 20 },
  ]);

  const cgpa = calculateCGPA(semesters);
  const percentage = cgpaToPercentage(cgpa, formulaId);
  const grade = cgpaToGrade(cgpa);
  const stats = calculateSemesterPerformance(semesters);
  const performanceLevel = getPerformanceLevel(cgpa);
  const isValid = semesters.some((s) => s.sgpa > 0);

  useEffect(() => {
    updateCollegeSemesters(semesters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(semesters)]);

  function updateSemester(id: string, patch: Partial<SemesterEntry>) {
    setSemesters((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  function handleSave() {
    if (!isValid) {
      showToast("Add at least one semester with a valid SGPA first.", "error");
      return;
    }
    addEntry({
      type: "cgpa",
      level: "college",
      title: `CGPA Calculation — ${semesters.length} semesters`,
      cgpa,
      percentage,
      grade: grade.grade,
      totalCredits: stats.totalCredits,
      performanceLevel,
    });
    showToast("Saved to your history.", "success");
  }

  return (
    <div className="grid-2">
      <div className="glass-card" style={{ padding: 24 }}>
        <div className="flex items-center justify-between mb-16">
          <h3>Semesters</h3>
          <span className="badge">{semesters.length} added</span>
        </div>

        <div className="row-list">
          <AnimatePresence initial={false}>
            {semesters.map((sem, index) => (
              <motion.div
                key={sem.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="dynamic-row"
              >
                <div className="dynamic-row-head">
                  <span className="text-muted" style={{ fontSize: "0.75rem", fontWeight: 700 }}>
                    Semester {index + 1}
                  </span>
                  {semesters.length > 1 && (
                    <button
                      className="remove-btn"
                      onClick={() => setSemesters((prev) => prev.filter((s) => s.id !== sem.id))}
                      aria-label={`Remove semester ${index + 1}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                <div className="dynamic-row-fields cols-3">
                  <FloatingInput
                    label="Label"
                    value={sem.label}
                    onChange={(e) => updateSemester(sem.id, { label: e.target.value })}
                  />
                  <FloatingInput
                    label="SGPA"
                    type="number"
                    step="0.01"
                    min={0}
                    max={10}
                    value={sem.sgpa || ""}
                    onChange={(e) => updateSemester(sem.id, { sgpa: parseFloat(e.target.value) || 0 })}
                  />
                  <FloatingInput
                    label="Credits"
                    type="number"
                    min={0}
                    value={sem.credits || ""}
                    onChange={(e) => updateSemester(sem.id, { credits: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="row-actions">
          <Button
            variant="outline"
            onClick={() =>
              setSemesters((prev) => [
                ...prev,
                { id: generateId(), label: `Semester ${prev.length + 1}`, sgpa: 0, credits: 20 },
              ])
            }
          >
            <Plus size={16} /> Add Semester
          </Button>
          <Button onClick={handleSave}>Save Result</Button>
        </div>
      </div>

      <ResultCard
        title="CGPA Result"
        primaryValue={cgpa}
        primaryLabel="CGPA / 10"
        stats={[
          { label: "Percentage", value: percentage, suffix: "%" },
          { label: "Grade", value: grade.gradePoint, decimals: 0, suffix: ` (${grade.grade})` },
          { label: "Total Credits", value: stats.totalCredits, decimals: 0 },
          { label: "Semesters", value: semesters.length, decimals: 0 },
        ]}
        performanceLevel={performanceLevel}
        isValid={isValid}
      />
    </div>
  );
}

/* ======================================================================== */
/* 2. SGPA CALCULATOR                                                        */
/* ======================================================================== */
export function SGPACalculator() {
  const addEntry = useHistoryStore((s) => s.addEntry);
  const { showToast } = useToast();
  const [subjects, setSubjects] = useState<SubjectEntry[]>([
    { id: generateId(), name: "Subject 1", marks: 0, maxMarks: 100, credit: 4 },
  ]);

  const sgpa = calculateSGPA(subjects);
  const grade = cgpaToGrade(sgpa);
  const performanceLevel = getPerformanceLevel(sgpa);
  const validSubjects = subjects.filter((s) => s.maxMarks > 0);
  const avgPercent =
    validSubjects.length > 0
      ? validSubjects.reduce((sum, s) => sum + (s.marks / s.maxMarks) * 100, 0) / validSubjects.length
      : 0;
  const totalCredits = validSubjects.reduce((sum, s) => sum + (s.credit || 1), 0);
  const isValid = validSubjects.length > 0 && sgpa > 0;

  function updateSubject(id: string, patch: Partial<SubjectEntry>) {
    setSubjects((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  function handleSave() {
    if (!isValid) {
      showToast("Add at least one subject with valid marks first.", "error");
      return;
    }
    addEntry({
      type: "sgpa",
      level: "college",
      title: `SGPA Calculation — ${subjects.length} subjects`,
      sgpa,
      grade: grade.grade,
      totalCredits,
      performanceLevel,
    });
    showToast("Saved to your history.", "success");
  }

  return (
    <div className="grid-2">
      <div className="glass-card" style={{ padding: 24 }}>
        <div className="flex items-center justify-between mb-16">
          <h3>Subjects</h3>
          <span className="badge">{subjects.length} added</span>
        </div>

        <div className="row-list">
          <AnimatePresence initial={false}>
            {subjects.map((subj, index) => {
              const gp = marksToGradePoint(subj.marks, subj.maxMarks || 100);
              return (
                <motion.div
                  key={subj.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="dynamic-row"
                >
                  <div className="dynamic-row-head">
                    <span className="text-muted" style={{ fontSize: "0.75rem", fontWeight: 700 }}>
                      Grade point: {gp.toFixed(2)}
                    </span>
                    {subjects.length > 1 && (
                      <button
                        className="remove-btn"
                        onClick={() => setSubjects((prev) => prev.filter((s) => s.id !== subj.id))}
                        aria-label={`Remove subject ${index + 1}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <div className="dynamic-row-fields cols-3">
                    <FloatingInput
                      label="Subject"
                      value={subj.name}
                      onChange={(e) => updateSubject(subj.id, { name: e.target.value })}
                    />
                    <FloatingInput
                      label="Marks"
                      type="number"
                      min={0}
                      value={subj.marks || ""}
                      onChange={(e) => updateSubject(subj.id, { marks: parseFloat(e.target.value) || 0 })}
                    />
                    <FloatingInput
                      label="Max marks"
                      type="number"
                      min={1}
                      value={subj.maxMarks || ""}
                      onChange={(e) => updateSubject(subj.id, { maxMarks: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="dynamic-row-fields mt-8">
                    <FloatingInput
                      label="Credit (optional)"
                      type="number"
                      min={0}
                      value={subj.credit || ""}
                      onChange={(e) => updateSubject(subj.id, { credit: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <div className="row-actions">
          <Button
            variant="outline"
            onClick={() =>
              setSubjects((prev) => [
                ...prev,
                { id: generateId(), name: `Subject ${prev.length + 1}`, marks: 0, maxMarks: 100, credit: 4 },
              ])
            }
          >
            <Plus size={16} /> Add Subject
          </Button>
          <Button onClick={handleSave}>Save Result</Button>
        </div>
      </div>

      <ResultCard
        title="SGPA Result"
        primaryValue={sgpa}
        primaryLabel="SGPA / 10"
        stats={[
          { label: "Avg. Percentage", value: avgPercent, suffix: "%" },
          { label: "Grade", value: grade.gradePoint, decimals: 0, suffix: ` (${grade.grade})` },
          { label: "Total Credits", value: totalCredits, decimals: 0 },
          { label: "Subjects", value: subjects.length, decimals: 0 },
        ]}
        performanceLevel={performanceLevel}
        isValid={isValid}
      />
    </div>
  );
}

/* ======================================================================== */
/* 3. PERCENTAGE CALCULATOR (CGPA -> %)                                     */
/* ======================================================================== */
export function PercentageCalculator() {
  const [cgpaInput, setCgpaInput] = useState("");
  const [formulaId, setFormulaId] = useState(PERCENTAGE_FORMULAS[0].value);
  const addEntry = useHistoryStore((s) => s.addEntry);
  const { showToast } = useToast();

  const cgpa = parseFloat(cgpaInput);
  const isValid = isNonNegative(cgpa) && cgpa > 0 && cgpa <= 10;
  const percentage = isValid ? cgpaToPercentage(cgpa, formulaId) : 0;
  const performanceLevel = getPerformanceLevel(cgpa || 0);
  const grade = cgpaToGrade(isValid ? cgpa : 0);

  function handleSave() {
    if (!isValid) {
      showToast("Enter a valid CGPA between 0 and 10 first.", "error");
      return;
    }
    addEntry({ type: "percentage", level: "college", title: "Percentage Calculation", percentage, performanceLevel });
    showToast("Saved to your history.", "success");
  }

  return (
    <div className="grid-2">
      <div className="glass-card" style={{ padding: 24 }}>
        <h3 className="mb-16">CGPA to Percentage</h3>
        <div className="flex" style={{ flexDirection: "column", gap: 20 }}>
          <FloatingInput
            label="Your CGPA (0–10)"
            type="number"
            step="0.01"
            min={0}
            max={10}
            value={cgpaInput}
            onChange={(e) => setCgpaInput(e.target.value)}
          />
          <SelectField label="University formula" value={formulaId} onChange={(e) => setFormulaId(e.target.value as typeof formulaId)}>
            {PERCENTAGE_FORMULAS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </SelectField>
          <Button block onClick={handleSave}>Save Result</Button>
        </div>
      </div>

      <ResultCard
        title="Percentage Result"
        primaryValue={percentage}
        primaryLabel="Percentage"
        primaryMax={100}
        primarySuffix="%"
        stats={[
          { label: "CGPA used", value: isValid ? cgpa : 0 },
          { label: "Grade", value: grade.gradePoint, decimals: 0, suffix: ` (${grade.grade})` },
        ]}
        performanceLevel={performanceLevel}
        isValid={isValid}
      />
    </div>
  );
}

/* ======================================================================== */
/* 4. GPA CALCULATOR (grade based)                                          */
/* ======================================================================== */
interface GradeRow { id: string; grade: string; credit: number }

export function GPACalculator() {
  const [rows, setRows] = useState<GradeRow[]>([{ id: generateId(), grade: "A", credit: 4 }]);
  const addEntry = useHistoryStore((s) => s.addEntry);
  const { showToast } = useToast();

  const gradesForCalc = rows.map((r) => ({
    gradePoint: GRADE_SCALE.find((g) => g.grade === r.grade)?.gradePoint ?? 0,
    credit: r.credit,
  }));
  const gpa10 = calculateGPA(gradesForCalc);
  const gpa4 = gradePointTo4Scale(gpa10);
  const totalCredits = rows.reduce((sum, r) => sum + (r.credit || 0), 0);
  const performanceLevel = getPerformanceLevel(gpa10);
  const isValid = rows.length > 0 && totalCredits > 0;

  function updateRow(id: string, patch: Partial<GradeRow>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function handleSave() {
    if (!isValid) {
      showToast("Add at least one grade with credits first.", "error");
      return;
    }
    addEntry({ type: "gpa", level: "college", title: `GPA Calculation — ${rows.length} grades`, totalCredits, performanceLevel });
    showToast("Saved to your history.", "success");
  }

  return (
    <div className="grid-2">
      <div className="glass-card" style={{ padding: 24 }}>
        <div className="flex items-center justify-between mb-16">
          <h3>Grades</h3>
          <span className="badge">{rows.length} added</span>
        </div>

        <div className="row-list">
          <AnimatePresence initial={false}>
            {rows.map((row, index) => (
              <motion.div
                key={row.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="dynamic-row"
              >
                <div className="dynamic-row-head">
                  <span className="text-muted" style={{ fontSize: "0.75rem", fontWeight: 700 }}>
                    Course {index + 1}
                  </span>
                  {rows.length > 1 && (
                    <button
                      className="remove-btn"
                      onClick={() => setRows((prev) => prev.filter((r) => r.id !== row.id))}
                      aria-label={`Remove course ${index + 1}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                <div className="dynamic-row-fields cols-2">
                  <SelectField label="Grade" value={row.grade} onChange={(e) => updateRow(row.id, { grade: e.target.value })}>
                    {GRADE_SCALE.map((g) => (
                      <option key={g.grade} value={g.grade}>
                        {g.grade} — {g.gradePoint} pts
                      </option>
                    ))}
                  </SelectField>
                  <FloatingInput
                    label="Credit"
                    type="number"
                    min={0}
                    value={row.credit || ""}
                    onChange={(e) => updateRow(row.id, { credit: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="row-actions">
          <Button variant="outline" onClick={() => setRows((prev) => [...prev, { id: generateId(), grade: "A", credit: 4 }])}>
            <Plus size={16} /> Add Course
          </Button>
          <Button onClick={handleSave}>Save Result</Button>
        </div>
      </div>

      <ResultCard
        title="GPA Result"
        primaryValue={gpa10}
        primaryLabel="GPA / 10"
        stats={[
          { label: "GPA (4.0 scale)", value: gpa4 },
          { label: "Total Credits", value: totalCredits, decimals: 0 },
        ]}
        performanceLevel={performanceLevel}
        isValid={isValid}
      />
    </div>
  );
}

/* ======================================================================== */
/* 5. GRADE CALCULATOR (Marks<->Grade, Grade->Point)                        */
/* ======================================================================== */
export function GradeCalculator() {
  const [mode, setMode] = useState<"marks-to-grade" | "grade-to-point">("marks-to-grade");
  const [marks, setMarks] = useState("");
  const [maxMarks, setMaxMarks] = useState("100");
  const [selectedGrade, setSelectedGrade] = useState(GRADE_SCALE[0].grade);

  const marksNum = parseFloat(marks);
  const maxNum = parseFloat(maxMarks);
  const marksValid = isNonNegative(marksNum) && maxNum > 0 && marksNum <= maxNum;
  const gradeResult = marksValid ? marksToGrade(marksNum, maxNum) : null;
  const gradePointResult = gradeToGradePoint(selectedGrade);

  return (
    <div className="glass-card" style={{ padding: 24, maxWidth: 640, margin: "0 auto" }}>
      <h3 className="mb-16">Grade Calculator</h3>

      <div className="tabs">
        <button className={`tab ${mode === "marks-to-grade" ? "active" : ""}`} onClick={() => setMode("marks-to-grade")}>
          Marks → Grade
        </button>
        <button className={`tab ${mode === "grade-to-point" ? "active" : ""}`} onClick={() => setMode("grade-to-point")}>
          Grade → Grade Point
        </button>
      </div>

      {mode === "marks-to-grade" ? (
        <>
          <div className="dynamic-row-fields cols-2 mt-16">
            <FloatingInput label="Marks obtained" type="number" min={0} value={marks} onChange={(e) => setMarks(e.target.value)} />
            <FloatingInput label="Maximum marks" type="number" min={1} value={maxMarks} onChange={(e) => setMaxMarks(e.target.value)} />
          </div>
          <div className="card mt-24 fade-in">
            {gradeResult ? (
              <div className="flex items-center justify-between" style={{ flexWrap: "wrap", gap: 12 }}>
                <div>
                  <p className="gradient-text" style={{ fontSize: "2.4rem", fontWeight: 800, fontFamily: "Poppins" }}>
                    {gradeResult.grade}
                  </p>
                  <p className="text-muted" style={{ fontSize: "0.85rem" }}>
                    Grade point: {gradeResult.gradePoint} · {((marksNum / maxNum) * 100).toFixed(2)}%
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-muted">Enter valid marks to see the grade.</p>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="mt-16" style={{ maxWidth: 260 }}>
            <SelectField label="Grade" value={selectedGrade} onChange={(e) => setSelectedGrade(e.target.value)}>
              {GRADE_SCALE.map((g) => (
                <option key={g.grade} value={g.grade}>
                  {g.grade}
                </option>
              ))}
            </SelectField>
          </div>
          <div className="card mt-24 fade-in">
            <p className="gradient-text" style={{ fontSize: "2.4rem", fontWeight: 800, fontFamily: "Poppins" }}>
              {gradePointResult}
            </p>
            <p className="text-muted" style={{ fontSize: "0.85rem" }}>
              Grade point for grade "{selectedGrade}"
            </p>
          </div>
        </>
      )}
    </div>
  );
}

/* ======================================================================== */
/* 6. PERCENTAGE -> CGPA (also used as "Percentage to SCGPA")               */
/* ======================================================================== */
export function PercentageToCGPACalculator() {
  const [percentInput, setPercentInput] = useState("");
  const [formulaId, setFormulaId] = useState(PERCENTAGE_FORMULAS[0].value);

  const percentage = parseFloat(percentInput);
  const isValid = isNonNegative(percentage) && percentage > 0 && percentage <= 100;
  const cgpa = isValid ? percentageToCgpa(percentage, formulaId) : 0;
  const performanceLevel = getPerformanceLevel(cgpa);

  return (
    <div className="grid-2">
      <div className="glass-card" style={{ padding: 24 }}>
        <h3 className="mb-16">Percentage to SGPA/CGPA</h3>
        <div className="flex" style={{ flexDirection: "column", gap: 20 }}>
          <FloatingInput
            label="Your Percentage (0–100)"
            type="number"
            step="0.01"
            min={0}
            max={100}
            value={percentInput}
            onChange={(e) => setPercentInput(e.target.value)}
          />
          <SelectField label="University formula" value={formulaId} onChange={(e) => setFormulaId(e.target.value as typeof formulaId)}>
            {PERCENTAGE_FORMULAS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </SelectField>
        </div>
      </div>

      <ResultCard
        title="CGPA Result"
        primaryValue={cgpa}
        primaryLabel="CGPA / 10"
        stats={[{ label: "Percentage used", value: isValid ? percentage : 0, suffix: "%" }]}
        performanceLevel={performanceLevel}
        isValid={isValid}
      />
    </div>
  );
}

/* ======================================================================== */
/* 7. CGPA -> PERCENTAGE (also used as "SCGPA to Percentage")               */
/* ======================================================================== */
export function CGPAToPercentageCalculator() {
  const [cgpaInput, setCgpaInput] = useState("");
  const [formulaId, setFormulaId] = useState(PERCENTAGE_FORMULAS[0].value);

  const cgpa = parseFloat(cgpaInput);
  const isValid = isNonNegative(cgpa) && cgpa > 0 && cgpa <= 10;
  const percentage = isValid ? cgpaToPercentage(cgpa, formulaId) : 0;
  const performanceLevel = getPerformanceLevelFromPercentage(percentage);

  return (
    <div className="grid-2">
      <div className="glass-card" style={{ padding: 24 }}>
        <h3 className="mb-16">SGPA/CGPA to Percentage</h3>
        <div className="flex" style={{ flexDirection: "column", gap: 20 }}>
          <FloatingInput
            label="Your SGPA / CGPA (0–10)"
            type="number"
            step="0.01"
            min={0}
            max={10}
            value={cgpaInput}
            onChange={(e) => setCgpaInput(e.target.value)}
          />
          <SelectField label="University formula" value={formulaId} onChange={(e) => setFormulaId(e.target.value as typeof formulaId)}>
            {PERCENTAGE_FORMULAS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </SelectField>
        </div>
      </div>

      <ResultCard
        title="Percentage Result"
        primaryValue={percentage}
        primaryLabel="Percentage"
        primaryMax={100}
        primarySuffix="%"
        stats={[{ label: "SGPA/CGPA used", value: isValid ? cgpa : 0 }]}
        performanceLevel={performanceLevel}
        isValid={isValid}
      />
    </div>
  );
}

/* ======================================================================== */
/* 8. SEMESTER PERFORMANCE                                                   */
/* ======================================================================== */
export function SemesterPerformanceCalculator() {
  const semesters = useAcademicStore((s) => s.college.semesters);
  const stats = calculateSemesterPerformance(semesters);
  const hasData = semesters.some((s) => s.sgpa > 0);

  const cards = [
    { label: "Highest SGPA", value: stats.highest },
    { label: "Lowest SGPA", value: stats.lowest },
    { label: "Average SGPA", value: stats.average },
    { label: "Total Credits", value: stats.totalCredits, decimals: 0 },
  ];

  return (
    <div>
      {!hasData && (
        <p className="text-center text-muted mb-16">
          Add semester data in the CGPA Calculator to see performance analytics here.
        </p>
      )}
      <div className="grid-4">
        {cards.map((c) => (
          <div key={c.label} className="card center-col">
            <p style={{ fontSize: "2rem", fontWeight: 800, fontFamily: "Poppins" }}>
              {c.value.toFixed(c.decimals ?? 2)}
            </p>
            <p className="text-muted" style={{ fontSize: "0.78rem", marginTop: 4 }}>
              {c.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ======================================================================== */
/* 9. SCHOOL: TOTAL MARKS CALCULATOR                                        */
/* ======================================================================== */
export function SchoolTotalMarksCalculator() {
  const updateSchoolSubjects = useAcademicStore((s) => s.updateSchoolSubjects);
  const addEntry = useHistoryStore((s) => s.addEntry);
  const { showToast } = useToast();
  const [subjects, setSubjects] = useState<SchoolSubjectEntry[]>([
    { id: generateId(), name: "Subject 1", marks: 0, maxMarks: 100 },
  ]);

  const { totalMarks, maxMarks, percentage } = calculateSchoolTotals(subjects);
  const performanceLevel = getPerformanceLevelFromPercentage(percentage);
  const isValid = subjects.some((s) => s.maxMarks > 0);

  useEffect(() => {
    updateSchoolSubjects(subjects);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(subjects)]);

  function updateSubject(id: string, patch: Partial<SchoolSubjectEntry>) {
    setSubjects((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  function handleSave() {
    if (!isValid) {
      showToast("Add at least one subject with valid marks first.", "error");
      return;
    }
    addEntry({
      type: "school-total-marks",
      level: "school",
      title: `Total Marks — ${subjects.length} subjects`,
      totalMarks,
      maxMarks,
      percentage,
      performanceLevel,
    });
    showToast("Saved to your history.", "success");
  }

  return (
    <div className="grid-2">
      <div className="glass-card" style={{ padding: 24 }}>
        <div className="flex items-center justify-between mb-16">
          <h3>Subjects</h3>
          <span className="badge">{subjects.length} added</span>
        </div>
        <div className="row-list">
          <AnimatePresence initial={false}>
            {subjects.map((subj, index) => (
              <motion.div
                key={subj.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="dynamic-row"
              >
                <div className="dynamic-row-head">
                  <span className="text-muted" style={{ fontSize: "0.75rem", fontWeight: 700 }}>
                    Subject {index + 1}
                  </span>
                  {subjects.length > 1 && (
                    <button
                      className="remove-btn"
                      onClick={() => setSubjects((prev) => prev.filter((s) => s.id !== subj.id))}
                      aria-label={`Remove subject ${index + 1}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                <div className="dynamic-row-fields cols-3">
                  <FloatingInput label="Name" value={subj.name} onChange={(e) => updateSubject(subj.id, { name: e.target.value })} />
                  <FloatingInput
                    label="Marks"
                    type="number"
                    min={0}
                    value={subj.marks || ""}
                    onChange={(e) => updateSubject(subj.id, { marks: parseFloat(e.target.value) || 0 })}
                  />
                  <FloatingInput
                    label="Max marks"
                    type="number"
                    min={1}
                    value={subj.maxMarks || ""}
                    onChange={(e) => updateSubject(subj.id, { maxMarks: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="row-actions">
          <Button
            variant="outline"
            onClick={() => setSubjects((prev) => [...prev, { id: generateId(), name: `Subject ${prev.length + 1}`, marks: 0, maxMarks: 100 }])}
          >
            <Plus size={16} /> Add Subject
          </Button>
          <Button onClick={handleSave}>Save Result</Button>
        </div>
      </div>

      <ResultCard
        title="Total Marks Result"
        primaryValue={percentage}
        primaryLabel="Percentage"
        primaryMax={100}
        primarySuffix="%"
        stats={[
          { label: "Total Marks", value: totalMarks, decimals: 0 },
          { label: "Max Marks", value: maxMarks, decimals: 0 },
          { label: "Subjects", value: subjects.length, decimals: 0 },
        ]}
        performanceLevel={performanceLevel}
        isValid={isValid}
      />
    </div>
  );
}

/* ======================================================================== */
/* 10. SCHOOL: MARKS -> PERCENTAGE CALCULATOR                               */
/* ======================================================================== */
export function SchoolMarksToPercentageCalculator() {
  const addEntry = useHistoryStore((s) => s.addEntry);
  const { showToast } = useToast();
  const [subjects, setSubjects] = useState<SchoolSubjectEntry[]>([
    { id: generateId(), name: "Subject 1", marks: 0, maxMarks: 100 },
  ]);

  const { totalMarks, maxMarks, percentage } = calculateSchoolTotals(subjects);
  const performanceLevel = getPerformanceLevelFromPercentage(percentage);
  const isValid = subjects.some((s) => s.maxMarks > 0);

  function updateSubject(id: string, patch: Partial<SchoolSubjectEntry>) {
    setSubjects((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  function handleSave() {
    if (!isValid) {
      showToast("Add at least one subject with valid marks first.", "error");
      return;
    }
    addEntry({
      type: "school-marks-to-percentage",
      level: "school",
      title: `Marks to Percentage — ${subjects.length} subjects`,
      totalMarks,
      maxMarks,
      percentage,
      performanceLevel,
    });
    showToast("Saved to your history.", "success");
  }

  return (
    <div className="grid-2">
      <div className="glass-card" style={{ padding: 24 }}>
        <div className="flex items-center justify-between mb-16">
          <h3>Subjects</h3>
          <span className="badge">{subjects.length} added</span>
        </div>
        <div className="row-list">
          <AnimatePresence initial={false}>
            {subjects.map((subj, index) => (
              <motion.div
                key={subj.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="dynamic-row"
              >
                <div className="dynamic-row-head">
                  <span className="text-muted" style={{ fontSize: "0.75rem", fontWeight: 700 }}>
                    {marksToPercentage(subj.marks, subj.maxMarks || 1).toFixed(1)}%
                  </span>
                  {subjects.length > 1 && (
                    <button
                      className="remove-btn"
                      onClick={() => setSubjects((prev) => prev.filter((s) => s.id !== subj.id))}
                      aria-label={`Remove subject ${index + 1}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                <div className="dynamic-row-fields cols-3">
                  <FloatingInput label="Name" value={subj.name} onChange={(e) => updateSubject(subj.id, { name: e.target.value })} />
                  <FloatingInput
                    label="Marks"
                    type="number"
                    min={0}
                    value={subj.marks || ""}
                    onChange={(e) => updateSubject(subj.id, { marks: parseFloat(e.target.value) || 0 })}
                  />
                  <FloatingInput
                    label="Total marks"
                    type="number"
                    min={1}
                    value={subj.maxMarks || ""}
                    onChange={(e) => updateSubject(subj.id, { maxMarks: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="row-actions">
          <Button
            variant="outline"
            onClick={() => setSubjects((prev) => [...prev, { id: generateId(), name: `Subject ${prev.length + 1}`, marks: 0, maxMarks: 100 }])}
          >
            <Plus size={16} /> Add Subject
          </Button>
          <Button onClick={handleSave}>Save Result</Button>
        </div>
      </div>

      <ResultCard
        title="Percentage Result"
        primaryValue={percentage}
        primaryLabel="Overall Percentage"
        primaryMax={100}
        primarySuffix="%"
        stats={[
          { label: "Total Marks", value: totalMarks, decimals: 0 },
          { label: "Total Max Marks", value: maxMarks, decimals: 0 },
          { label: "Subjects", value: subjects.length, decimals: 0 },
        ]}
        performanceLevel={performanceLevel}
        isValid={isValid}
      />
    </div>
  );
}

/* ======================================================================== */
/* 11. SCHOOL: PERCENTAGE -> MARKS CALCULATOR                               */
/* ======================================================================== */
export function SchoolPercentageToMarksCalculator() {
  const [percentInput, setPercentInput] = useState("");
  const [maxMarksInput, setMaxMarksInput] = useState("500");

  const percentage = parseFloat(percentInput);
  const totalMaxMarks = parseFloat(maxMarksInput);
  const isValid = isNonNegative(percentage) && percentage <= 100 && totalMaxMarks > 0;
  const marks = isValid ? percentageToMarks(percentage, totalMaxMarks) : 0;
  const performanceLevel = getPerformanceLevelFromPercentage(isValid ? percentage : 0);

  return (
    <div className="grid-2">
      <div className="glass-card" style={{ padding: 24 }}>
        <h3 className="mb-16">Percentage to Marks</h3>
        <div className="flex" style={{ flexDirection: "column", gap: 20 }}>
          <FloatingInput
            label="Percentage (0–100)"
            type="number"
            step="0.01"
            min={0}
            max={100}
            value={percentInput}
            onChange={(e) => setPercentInput(e.target.value)}
          />
          <FloatingInput
            label="Total maximum marks"
            type="number"
            min={1}
            value={maxMarksInput}
            onChange={(e) => setMaxMarksInput(e.target.value)}
          />
        </div>
      </div>

      <ResultCard
        title="Marks Result"
        primaryValue={marks}
        primaryLabel="Marks obtained"
        primaryMax={totalMaxMarks || 100}
        stats={[
          { label: "Percentage used", value: isValid ? percentage : 0, suffix: "%" },
          { label: "Out of", value: isValid ? totalMaxMarks : 0, decimals: 0 },
        ]}
        performanceLevel={performanceLevel}
        isValid={isValid}
      />
    </div>
  );
}
