import { GraduationCap, Globe, Send, MessageCircle, Link2, Mail } from "lucide-react";
import type { PageId } from "@/components/Navbar";

const FOOTER_LINKS: Record<string, { label: string; page: PageId }[]> = {
  Product: [
    { label: "Calculators", page: "calculators" },
    { label: "GPA Guide", page: "gpa-guide" },
    { label: "Student Dashboard", page: "dashboard" },
  ],
  Company: [
    { label: "About", page: "about" },
    { label: "Contact", page: "contact" },
  ],
  Account: [
    { label: "Sign in", page: "auth" },
    { label: "History", page: "history" },
    { label: "Settings", page: "settings" },
  ],
};

export function Footer({ onNavigate }: { onNavigate: (page: PageId) => void }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="logo">
              <span className="logo-icon">
                <GraduationCap size={20} />
              </span>
              Grade<span className="gradient-text">Master</span>
            </div>
            <p className="about">
              Calculate your academic performance instantly with accurate formulas, beautiful
              analytics, and professional reports.
            </p>
            <div className="social-row">
              <a className="social-btn" href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
                <Globe size={16} />
              </a>
              <a className="social-btn" href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
                <Send size={16} />
              </a>
              <a className="social-btn" href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                <MessageCircle size={16} />
              </a>
              <a className="social-btn" href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <Link2 size={16} />
              </a>
              <a className="social-btn" href="mailto:support@grademaster.app" aria-label="Email">
                <Mail size={16} />
              </a>
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h4>{section}</h4>
              <ul>
                {links.map((link) => (
                  <li key={link.page}>
                    <a
                      href={`#${link.page}`}
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate(link.page);
                      }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} GradeMaster. All rights reserved.</p>
          <p>support@grademaster.app · Built for students, by SR.</p>
        </div>
      </div>
    </footer>
  );
}
