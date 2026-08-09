import { useState } from "react";
import { Bell, Download, Globe, Moon, RotateCcw, Shield, Sun, Trash2 } from "lucide-react";
import { Button } from "@/components/Button";
import { useHistoryStore, useThemeStore } from "@/store/useStore";
import { useToast } from "@/components/Toast";
import { exportHistoryToExcel } from "@/lib/exportUtils";

export function SettingsPage() {
  const { theme, toggleTheme } = useThemeStore();
  const entries = useHistoryStore((s) => s.entries);
  const clearHistory = useHistoryStore((s) => s.clearHistory);
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="container section" style={{ maxWidth: 720 }}>
      <h1 className="section-title" style={{ textAlign: "left" }}>Settings</h1>
      <p className="text-muted mt-8">Manage your preferences, data, and account.</p>

      <div className="flex" style={{ flexDirection: "column", gap: 20, marginTop: 32 }}>
        <div className="card">
          <h4 className="flex items-center gap-8 mb-16">
            {theme === "dark" ? <Moon size={16} /> : <Sun size={16} />} Appearance
          </h4>
          <div className="flex items-center justify-between">
            <span>Dark mode</span>
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              <span className="theme-toggle-thumb">{theme === "dark" ? <Moon size={13} /> : <Sun size={13} />}</span>
            </button>
          </div>
        </div>

        <div className="card">
          <h4 className="flex items-center gap-8 mb-16"><Globe size={16} /> Language</h4>
          <div className="flex items-center justify-between">
            <span>English (default)</span>
            <span className="text-muted" style={{ fontSize: "0.78rem" }}>More languages coming soon</span>
          </div>
        </div>

        <div className="card">
          <h4 className="flex items-center gap-8 mb-16"><Bell size={16} /> Notifications</h4>
          <div className="flex items-center justify-between">
            <span>Product notifications</span>
            <button className="theme-toggle" onClick={() => setNotifications((v) => !v)} aria-label="Toggle notifications">
              <span className="theme-toggle-thumb" style={{ transform: notifications ? "translateX(26px)" : "none" }} />
            </button>
          </div>
        </div>

        <div className="card">
          <h4 className="flex items-center gap-8 mb-16"><Shield size={16} /> Privacy &amp; Data</h4>
          <div className="flex gap-8" style={{ flexWrap: "wrap" }}>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                if (entries.length === 0) return showToast("No data to export yet.", "error");
                exportHistoryToExcel(entries);
                showToast("Data exported.", "success");
              }}
            >
              <Download size={15} /> Export my data
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                clearHistory();
                showToast("History reset.", "success");
              }}
            >
              <RotateCcw size={15} /> Reset history
            </Button>
            <Button size="sm" variant="danger" onClick={() => showToast("Contact support to permanently delete your account.", "info")}>
              <Trash2 size={15} /> Delete account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
