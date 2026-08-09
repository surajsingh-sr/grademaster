import { useEffect, useState } from "react";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Navbar, type PageId } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ToastProvider } from "@/components/Toast";
import { HomePage } from "@/pages/HomePage";
import { CalculatorsPage } from "@/pages/CalculatorsPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { HistoryPage } from "@/pages/HistoryPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { AboutPage } from "@/pages/AboutPage";
import { ContactPage } from "@/pages/ContactPage";
import { GpaGuidePage } from "@/pages/GpaGuidePage";
import { AuthPage } from "@/pages/AuthPage";
import { useAuthStore } from "@/store/useStore";

function AppShell() {
  const [page, setPage] = useState<PageId>("home");
  const initSession = useAuthStore((s) => s.initSession);

  useEffect(() => {
    initSession();
  }, [initSession]);

  function navigate(next: PageId) {
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AnimatedBackground />
      <Navbar page={page} onNavigate={navigate} />

      <main style={{ flex: 1 }}>
        {page === "home" && <HomePage onNavigate={navigate} />}
        {page === "calculators" && <CalculatorsPage />}
        {page === "dashboard" && <DashboardPage />}
        {page === "history" && <HistoryPage />}
        {page === "settings" && <SettingsPage />}
        {page === "about" && <AboutPage />}
        {page === "contact" && <ContactPage />}
        {page === "gpa-guide" && <GpaGuidePage />}
        {page === "auth" && <AuthPage onNavigate={navigate} />}
      </main>

      <Footer onNavigate={navigate} />
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <AppShell />
    </ToastProvider>
  );
}

export default App;
