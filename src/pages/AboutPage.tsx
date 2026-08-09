import { Sparkles, Target, Users } from "lucide-react";

const ITEMS = [
  { icon: Target, title: "Our Mission", desc: "Make academic calculations accurate, instant, and stress-free for every student." },
  { icon: Users, title: "Built for Students", desc: "Designed with real student workflows in mind — from first semester to final year." },
  { icon: Sparkles, title: "Always Improving", desc: "New formulas, calculators, and analytics are added based on student feedback." },
];

export function AboutPage() {
  return (
    <div className="container section" style={{ maxWidth: 880 }}>
      <h1 className="section-title" style={{ textAlign: "left" }}>
        About <span className="gradient-text">GradeMaster</span>
      </h1>
      <p className="text-muted mt-16" style={{ lineHeight: 1.7 }}>
        GradeMaster was built to remove the friction and guesswork from tracking academic
        performance. Whether you're a college student calculating CGPA across semesters or a
        school student converting marks to percentage, GradeMaster gives you instant, accurate
        results wrapped in a beautiful, distraction-free interface.
      </p>

      <div className="grid-3 mt-40">
        {ITEMS.map((item) => (
          <div key={item.title} className="card">
            <span className="icon-circle"><item.icon size={20} /></span>
            <h3 style={{ fontSize: "1.1rem" }}>{item.title}</h3>
            <p className="text-muted mt-8" style={{ fontSize: "0.85rem" }}>{item.desc}</p>
          </div>
        ))}
      </div>
      
    </div>
  );
}
