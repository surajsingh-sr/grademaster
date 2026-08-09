import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import type { CalculationSummary } from "@/types";

/** Export a list of history entries as a landscape PDF table report. */
export function exportHistoryToPdf(entries: CalculationSummary[]) {
  const doc = new jsPDF({ unit: "pt", format: "a4", orientation: "landscape" });
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFillColor(59, 130, 246);
  doc.rect(0, 0, pageWidth, 70, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("GradeMaster — Calculation History", 40, 40);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Exported on ${format(new Date(), "dd MMMM yyyy, hh:mm a")}`, 40, 58);

  autoTable(doc, {
    startY: 90,
    head: [["Date", "Type", "Level", "CGPA", "SGPA", "Percentage", "Grade", "Performance"]],
    body: entries.map((e) => [
      format(new Date(e.createdAt), "dd MMM yyyy"),
      e.type.replace(/-/g, " "),
      e.level,
      e.cgpa?.toFixed(2) ?? "-",
      e.sgpa?.toFixed(2) ?? "-",
      e.percentage !== undefined ? `${e.percentage.toFixed(2)}%` : "-",
      e.grade ?? "-",
      e.performanceLevel ?? "-",
    ]),
    theme: "grid",
    headStyles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: "bold" },
    styles: { fontSize: 9, cellPadding: 6 },
    margin: { left: 40, right: 40 },
  });

  doc.save(`GradeMaster_History_${Date.now()}.pdf`);
}

/** Generate a single-result professional PDF certificate/report. */
export function exportResultToPdf(entry: CalculationSummary, studentName = "Guest User") {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFillColor(59, 130, 246);
  doc.rect(0, 0, pageWidth, 90, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("GradeMaster Report", 40, 45);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Academic Performance Certificate", 40, 65);

  doc.setTextColor(20, 20, 20);
  let y = 120;
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Student Details", 40, y);
  y += 20;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Name: ${studentName}`, 40, y);
  y += 18;
  doc.text(`Report Date: ${format(new Date(), "dd MMMM yyyy")}`, 40, y);
  y += 26;

  const rows: [string, string][] = [];
  if (entry.cgpa !== undefined) rows.push(["CGPA", entry.cgpa.toFixed(2)]);
  if (entry.sgpa !== undefined) rows.push(["SGPA", entry.sgpa.toFixed(2)]);
  if (entry.percentage !== undefined) rows.push(["Percentage", `${entry.percentage.toFixed(2)}%`]);
  if (entry.totalMarks !== undefined) rows.push(["Total Marks", String(entry.totalMarks)]);
  if (entry.grade) rows.push(["Grade", entry.grade]);
  if (entry.performanceLevel) rows.push(["Performance Level", entry.performanceLevel]);

  autoTable(doc, {
    startY: y,
    head: [["Metric", "Value"]],
    body: rows,
    theme: "grid",
    headStyles: { fillColor: [59, 130, 246], textColor: 255 },
    margin: { left: 40, right: 40 },
  });

  doc.save(`GradeMaster_Report_${entry.type}_${Date.now()}.pdf`);
}

/** Export history entries to an .xlsx workbook. */
export function exportHistoryToExcel(entries: CalculationSummary[]) {
  const rows = entries.map((e) => ({
    Date: format(new Date(e.createdAt), "dd MMM yyyy, hh:mm a"),
    Type: e.type.replace(/-/g, " "),
    Level: e.level,
    Title: e.title,
    CGPA: e.cgpa ?? "",
    SGPA: e.sgpa ?? "",
    "Percentage (%)": e.percentage ?? "",
    "Total Marks": e.totalMarks ?? "",
    Grade: e.grade ?? "",
    "Performance Level": e.performanceLevel ?? "",
  }));
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "History");
  XLSX.writeFile(workbook, `GradeMaster_History_${Date.now()}.xlsx`);
}
