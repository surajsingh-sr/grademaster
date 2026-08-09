import { GRADE_SCALE, PERCENTAGE_FORMULAS } from "@/lib/calculations";

export function GpaGuidePage() {
  return (
    <div className="container section" style={{ maxWidth: 880 }}>
      <h1 className="section-title" style={{ textAlign: "left" }}>
        GPA &amp; Grading <span className="gradient-text">Guide</span>
      </h1>
      <p className="text-muted mt-8">Understand exactly how GradeMaster calculates CGPA, SGPA, grades, and percentages.</p>

      <div className="flex" style={{ flexDirection: "column", gap: 24, marginTop: 32 }}>
        <div className="card">
          <h3 className="mb-16">10-Point Grade Scale</h3>
          <table style={{ width: "100%", fontSize: "0.85rem", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", color: "var(--text-muted)", borderBottom: "1px solid var(--border)" }}>
                <th style={{ padding: "8px 0" }}>Grade</th>
                <th style={{ padding: "8px 0" }}>Percentage Range</th>
                <th style={{ padding: "8px 0" }}>Grade Point</th>
              </tr>
            </thead>
            <tbody>
              {GRADE_SCALE.map((row) => (
                <tr key={row.grade} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "10px 0", fontWeight: 700 }}>{row.grade}</td>
                  <td style={{ padding: "10px 0" }}>{row.minPercent}% – {row.maxPercent}%</td>
                  <td style={{ padding: "10px 0" }}>{row.gradePoint}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <h3 className="mb-16">How to CGPA is Calculated</h3>
          <p className="text-muted" style={{ fontSize: "0.85rem" }}>CGPA is the credit-weighted average of all your semester SGPAs:</p>
          <p
            style={{
              fontFamily: "monospace",
              fontSize: "0.8rem",
              background: "color-mix(in srgb, var(--text) 4%, transparent)",
              borderRadius: 10,
              padding: 12,
              marginTop: 10,
            }}
          >
            CGPA = Σ(SGPA × Credits) / Σ(Credits)
          </p>
        </div>

          <div className="card">
          <h3 className="mb-16">How to SCGPA is Calculated</h3>
          <p className="text-muted" style={{ fontSize: "0.85rem" }}>SGPA is the credit-weighted average of grade points obtained in a semester.</p>
          <p
            style={{
              fontFamily: "monospace",
              fontSize: "0.8rem",
              background: "color-mix(in srgb, var(--text) 4%, transparent)",
              borderRadius: 10,
              padding: 12,
              marginTop: 10,
            }}
          >
             SGPA = Σ(Grade Point × Credit) / ΣCredits.
          </p>
        </div>
          <div className="card">
          <h3 className="mb-16">CGPA to Percentage Formula:</h3>
          <p className="text-muted" style={{ fontSize: "0.85rem" }}>Multiply CGPA by 9.5 to convert it into percentage using the standard 9.5 conversion method.</p>
          <p
            style={{
              fontFamily: "monospace",
              fontSize: "0.8rem",
              background: "color-mix(in srgb, var(--text) 4%, transparent)",
              borderRadius: 10,
              padding: 12,
              marginTop: 10,
            }}
          >
             Percentage = CGPA × 9.5
          </p>
        </div>
      
          <div className="card">
          <h3 className="mb-16">SGPA to Percentage Formula:</h3>
          <p className="text-muted" style={{ fontSize: "0.85rem" }}>Multiply SGPA by 9.5 to convert it into percentage using the standard 9.5 conversion method.</p>
          <p
            style={{
              fontFamily: "monospace",
              fontSize: "0.8rem",
              background: "color-mix(in srgb, var(--text) 4%, transparent)",
              borderRadius: 10,
              padding: 12,
              marginTop: 10,
            }}
          >
             Percentage = SGPA × 9.5
          </p>
        </div>

        <div className="card">
          <h3 className="mb-16">CGPA TO Percentage Calculate Formulas</h3>
          {PERCENTAGE_FORMULAS.map((f) => (
            <div key={f.value} style={{ background: "color-mix(in srgb, var(--text) 4%, transparent)", borderRadius: 12, padding: 14, marginBottom: 10 }}>
              <p style={{ fontWeight: 700, fontSize: "0.88rem" }}>{f.label}</p>
            </div>
          ))}
        </div>
      </div>
       </div>
  );
}
