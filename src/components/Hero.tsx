import { motion } from "framer-motion";
import { ArrowRight, Award, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/Button";
import type { PageId } from "@/components/Navbar";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export function Hero({ onNavigate }: { onNavigate: (page: PageId) => void }) {
  return (
    <section className="hero container">
      <div className="hero-inner">
        <div>
          <motion.div initial="hidden" animate="visible" custom={0} variants={fadeUp} className="hero-badge">
            <Sparkles size={14} /> Trusted by students across every university
          </motion.div>

          <motion.h1 initial="hidden" animate="visible" custom={0.1} variants={fadeUp}>
            Smart <span className="gradient-text">CGPA, SGPA</span> &amp; Percentage Calculator
          </motion.h1>

          <motion.p initial="hidden" animate="visible" custom={0.2} variants={fadeUp} className="lead">
            Calculate your academic performance instantly with accurate formulas, beautiful
            analytics, and professional reports.
          </motion.p>

          <motion.div initial="hidden" animate="visible" custom={0.3} variants={fadeUp} className="hero-actions">
            <Button size="lg" onClick={() => onNavigate("calculators")}>
              Start Calculating <ArrowRight size={18} />
            </Button>
            <Button size="lg" variant="outline" onClick={() => onNavigate("gpa-guide")}>
              View GPA Guide
            </Button>
          </motion.div>

          <motion.div initial="hidden" animate="visible" custom={0.4} variants={fadeUp} className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-icon"><TrendingUp size={18} /></span>
              <div><strong>11 calculators</strong><span>College &amp; school</span></div>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-icon"><Award size={18} /></span>
              <div><strong>100% accurate</strong><span>Verified formulas</span></div>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-icon"><Sparkles size={18} /></span>
              <div><strong>Instant reports</strong><span>PDF &amp; Excel export</span></div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="hero-illustration"
        >
          <div className="glass-card float-card f1">
            <p className="label">Current CGPA</p>
            <p className="value gradient-text">9.24</p>
            <div className="progress-bar-track mt-8">
              <div className="progress-bar-fill" style={{ width: "92%" }} />
            </div>
          </div>
          <div className="glass-card float-card f2">
            <p className="label">Percentage</p>
            <p className="value">87.8%</p>
          </div>
          <div className="glass-card float-card f3">
            <p className="label">Semester 6</p>
            <p className="value">9.5 SGPA</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
