import { useMemo, useState } from "react";
import { format } from "date-fns";
import { FileDown, FileSpreadsheet, History as HistoryIcon, Printer, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/Button";
import { PerformanceBadge } from "@/components/ResultDisplay";
import { useHistoryStore } from "@/store/useStore";
import { useToast } from "@/components/Toast";
import { exportHistoryToExcel, exportHistoryToPdf } from "@/lib/exportUtils";

export function HistoryPage() {
  const [query, setQuery] = useState("");
  const entries = useHistoryStore((s) => s.entries);
  const removeEntry = useHistoryStore((s) => s.removeEntry);
  const clearHistory = useHistoryStore((s) => s.clearHistory);
  const { showToast } = useToast();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter((e) => e.title.toLowerCase().includes(q) || e.type.includes(q) || e.level.includes(q));
  }, [entries, query]);

  return (
    <div className="container section">
      <h1 className="section-title" style={{ textAlign: "left" }}>
        Calculation <span className="gradient-text">History</span>
      </h1>
      <p className="text-muted mt-8">Every saved calculation, permanently stored in your browser.</p>

      <div className="flex items-center justify-between mt-24" style={{ flexWrap: "wrap", gap: 12 }}>
        <div style={{ position: "relative", maxWidth: 320, flex: 1 }}>
          <Search size={16} style={{ position: "absolute", left: 14, top: 18, opacity: 0.5 }} />
          <div className="field">
            <input placeholder="Search history..." value={query} onChange={(e) => setQuery(e.target.value)} style={{ paddingLeft: 38 }} />
          </div>
        </div>
        <div className="flex gap-8" style={{ flexWrap: "wrap" }}>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              if (filtered.length === 0) return showToast("No history entries to export.", "error");
              exportHistoryToPdf(filtered);
              showToast("PDF report downloaded.", "success");
            }}
          >
            <FileDown size={15} /> PDF
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              if (filtered.length === 0) return showToast("No history entries to export.", "error");
              exportHistoryToExcel(filtered);
              showToast("Excel file downloaded.", "success");
            }}
          >
            <FileSpreadsheet size={15} /> Excel
          </Button>
          <Button size="sm" variant="outline" onClick={() => window.print()}>
            <Printer size={15} /> Print
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => {
              clearHistory();
              showToast("History cleared.", "success");
            }}
          >
            <Trash2 size={15} /> Clear all
          </Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <HistoryIcon size={36} style={{ opacity: 0.4, marginBottom: 12 }} />
          <p>{entries.length === 0 ? "No saved calculations yet." : "No results match your search."}</p>
        </div>
      ) : (
        <div className="grid-3 mt-24">
          {filtered.map((entry) => (
            <div key={entry.id} className="card fade-in">
              <div className="flex items-center justify-between" style={{ alignItems: "flex-start" }}>
                <div>
                  <p style={{ fontWeight: 700, fontSize: "0.9rem" }}>{entry.title}</p>
                  <p className="text-muted" style={{ fontSize: "0.72rem", marginTop: 4 }}>
                    {format(new Date(entry.createdAt), "dd MMM yyyy, hh:mm a")}
                  </p>
                </div>
                <button
                  onClick={() => removeEntry(entry.id)}
                  aria-label="Delete entry"
                  style={{ background: "none", border: "none", color: "var(--danger)", opacity: 0.7 }}
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="flex gap-8 mt-16" style={{ flexWrap: "wrap" }}>
                <span className="badge" style={{ textTransform: "capitalize" }}>{entry.level}</span>
                <span className="badge" style={{ textTransform: "capitalize" }}>{entry.type.replace(/-/g, " ")}</span>
              </div>

              <div className="grid-2" style={{ gap: 8, marginTop: 12 }}>
                {entry.cgpa !== undefined && <Stat label="CGPA" value={entry.cgpa.toFixed(2)} />}
                {entry.sgpa !== undefined && <Stat label="SGPA" value={entry.sgpa.toFixed(2)} />}
                {entry.percentage !== undefined && <Stat label="Percentage" value={`${entry.percentage.toFixed(2)}%`} />}
                {entry.totalMarks !== undefined && <Stat label="Total Marks" value={String(entry.totalMarks)} />}
                {entry.grade && <Stat label="Grade" value={entry.grade} />}
                {entry.totalCredits !== undefined && <Stat label="Credits" value={String(entry.totalCredits)} />}
              </div>

              {entry.performanceLevel && (
                <div className="mt-16">
                  <PerformanceBadge level={entry.performanceLevel} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat-box">
      <p className="label">{label}</p>
      <p className="value" style={{ fontSize: "0.9rem" }}>{value}</p>
    </div>
  );
}
