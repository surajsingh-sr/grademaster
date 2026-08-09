import { useEffect, useState } from "react";
import { GraduationCap, LayoutDashboard, LogIn, Menu, Moon, Sun, X } from "lucide-react";
import { useAuthStore, useThemeStore } from "@/store/useStore";
import { Button } from "@/components/Button";

export type PageId =
  | "home"
  | "calculators"
  | "gpa-guide"
  | "about"
  | "contact"
  | "dashboard"
  | "history"
  | "settings"
  | "auth";

const NAV_LINKS: { id: PageId; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "calculators", label: "Calculators" },
  { id: "gpa-guide", label: "GPA Guide" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

export function Navbar({ page, onNavigate }: { page: PageId; onNavigate: (page: PageId) => void }) {
  const { theme, toggleTheme } = useThemeStore();
  const { isAuthenticated, user } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => setMobileOpen(false), [page]);

  return (
    <header className="navbar">
      <div className="navbar-inner container">
        <button className="logo" onClick={() => onNavigate("home")} aria-label="GradeMaster home">
          <span className="logo-icon">
            <GraduationCap size={20} />
          </span>
          Grade<span className="gradient-text">Master</span>
        </button>

        <nav className="nav-links">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              className={`nav-link ${page === link.id ? "active" : ""}`}
              onClick={() => onNavigate(link.id)}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="nav-right">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            aria-pressed={theme === "dark"}
          >
            <span className="theme-toggle-thumb">
              {theme === "dark" ? <Moon size={13} /> : <Sun size={13} />}
            </span>
          </button>

          <div className="desktop-only">
            {isAuthenticated ? (
              <Button size="sm" variant="outline" onClick={() => onNavigate("dashboard")}>
                <LayoutDashboard size={15} />
                {user?.name?.split(" ")[0] ?? "Dashboard"}
              </Button>
            ) : (
              <Button size="sm" onClick={() => onNavigate("auth")}>
                <LogIn size={15} /> Sign in
              </Button>
            )}
          </div>

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            style={{ background: "none", border: "none", display: "flex" }}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="mobile-menu">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              className={`nav-link ${page === link.id ? "active" : ""}`}
              onClick={() => onNavigate(link.id)}
              style={{ textAlign: "left" }}
            >
              {link.label}
            </button>
          ))}
          <Button block className="mt-8" onClick={() => onNavigate(isAuthenticated ? "dashboard" : "auth")}>
            {isAuthenticated ? "Student dashboard" : "Sign in / Sign up"}
          </Button>
        </div>
      )}
    </header>
  );
}
