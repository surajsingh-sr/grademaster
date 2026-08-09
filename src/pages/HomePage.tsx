import { ArrowRight, Award, BarChart3, FileText, GraduationCap, Percent, ShieldCheck } from "lucide-react";
import { Hero } from "@/components/Hero";
import { Button } from "@/components/Button";
import type { PageId } from "@/components/Navbar";

const FEATURES = [
  { icon: GraduationCap, title: "CGPA & SGPA", desc: "Unlimited semesters and subjects with live, accurate calculation." },
  { icon: Percent, title: "Percentage Formulas", desc: "Support for major university percentage conversion formulas." },
  { icon: Award, title: "Grade Conversion", desc: "Convert marks to grades and grades to grade points instantly." },
  { icon: BarChart3, title: "Rich Analytics", desc: "Beautiful line, bar, and pie charts to visualize your progress." },
  { icon: FileText, title: "Pro Reports", desc: "Download polished PDF and Excel reports with a single click." },
  { icon: ShieldCheck, title: "Private & Secure", desc: "Your history is stored locally and synced securely with your account." },
];

export function HomePage({ onNavigate }: { onNavigate: (page: PageId) => void }) {
  return (
    <>
      <Hero onNavigate={onNavigate} />

      <section className="container section">
        <div className="text-center mb-16">
          <h2 className="section-title">
            Everything you need, <span className="gradient-text">beautifully built</span>
          </h2>
          <p className="section-subtitle">From semester tracking to professional reports — a complete academic toolkit.</p>
        </div>

        <div className="grid-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="card">
              <span className="icon-circle"><f.icon size={20} /></span>
              <h3 style={{ fontSize: "1.05rem" }}>{f.title}</h3>
              <p className="text-muted mt-8" style={{ fontSize: "0.85rem" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container" style={{ paddingBottom: 100 }}>
        <div className="glass-card text-center" style={{ padding: "56px 32px" }}>
          <h2 style={{ fontSize: "1.8rem" }}>Ready to calculate your academic future?</h2>
          <p className="text-muted mt-16" style={{ maxWidth: 480, margin: "16px auto 0" }}>
            Join thousands of students tracking their CGPA, SGPA, and percentage with confidence.
          </p>
          <div className="mt-24">
            <Button size="lg" onClick={() => onNavigate("calculators")}>
              Start Calculating <ArrowRight size={18} />
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
