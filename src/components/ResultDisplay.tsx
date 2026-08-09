import { useEffect, useRef, useState, type ReactNode } from "react";
import { Check } from "lucide-react";
import confetti from "canvas-confetti";
import { PERFORMANCE_COLORS } from "@/lib/calculations";
import type { PerformanceLevel } from "@/types";

/* -------------------------------------------------------------------- */
/* Animated number — counts up/down smoothly whenever `value` changes    */
/* -------------------------------------------------------------------- */
export function AnimatedNumber({
  value,
  decimals = 2,
  suffix = "",
}: {
  value: number;
  decimals?: number;
  suffix?: string;
}) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const from = fromRef.current;
    const to = value;
    const start = performance.now();
    const duration = 800;

    if (from === to) {
      setDisplay(to);
      return;
    }

    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplay(from + (to - from) * eased);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = to;
      }
    }
    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [value]);

  return (
    <>
      {display.toFixed(decimals)}
      {suffix}
    </>
  );
}

/* -------------------------------------------------------------------- */
/* Circular animated progress ring                                        */
/* -------------------------------------------------------------------- */
export function ProgressRing({
  percentage,
  size = 150,
  strokeWidth = 12,
  color = "#3b82f6",
  label,
  sublabel,
}: {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: ReactNode;
  sublabel?: ReactNode;
}) {
  const [animated, setAnimated] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(Math.max(percentage, 0), 100);
  const offset = circumference - (animated / 100) * circumference;

  useEffect(() => {
    const t = window.setTimeout(() => setAnimated(clamped), 80);
    return () => window.clearTimeout(t);
  }, [clamped]);

  return (
    <div className="progress-ring-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          stroke="var(--border)"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(0.16,1,0.3,1)" }}
        />
      </svg>
      <div className="progress-ring-label">
        {label && <strong>{label}</strong>}
        {sublabel && <span>{sublabel}</span>}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------- */
/* Performance level badge                                                */
/* -------------------------------------------------------------------- */
export function PerformanceBadge({ level }: { level: PerformanceLevel }) {
  const color = PERFORMANCE_COLORS[level];
  return (
    <span className="badge" style={{ color, background: `${color}1a` }}>
      <span className="badge-dot" />
      {level}
    </span>
  );
}

/** Confetti burst — fired once when a result is classified "Excellent". */
export function fireConfetti() {
  const colors = ["#3b82f6", "#6366f1", "#f43f5e", "#10b981", "#f59e0b"];
  confetti({ particleCount: 90, spread: 100, origin: { y: 0.6 }, colors });
}

/* -------------------------------------------------------------------- */
/* Shared premium result card used by every calculator                    */
/* -------------------------------------------------------------------- */
export interface ResultStat {
  label: string;
  value: number;
  decimals?: number;
  suffix?: string;
}

export function ResultCard({
  title,
  primaryValue,
  primaryLabel,
  primaryMax = 10,
  primarySuffix = "",
  stats,
  performanceLevel,
  isValid,
}: {
  title: string;
  primaryValue: number;
  primaryLabel: string;
  primaryMax?: number;
  primarySuffix?: string;
  stats: ResultStat[];
  performanceLevel: PerformanceLevel;
  isValid: boolean;
}) {
  const firedRef = useRef(false);

  useEffect(() => {
    if (isValid && performanceLevel === "Excellent" && !firedRef.current) {
      firedRef.current = true;
      fireConfetti();
    }
    if (!isValid) firedRef.current = false;
  }, [isValid, performanceLevel]);

  const ringPct = primaryMax > 0 ? Math.min((primaryValue / primaryMax) * 100, 100) : 0;

  return (
    <div className="glass-card fade-in" style={{ padding: 24 }}>
      <div className="result-card-header">
        <h3>{title}</h3>
        {isValid && (
          <span className="success-check">
            <Check size={15} strokeWidth={3} />
          </span>
        )}
      </div>

      <div className="result-body">
        <ProgressRing
          percentage={ringPct}
          color={PERFORMANCE_COLORS[performanceLevel]}
          label={isValid ? <AnimatedNumber value={primaryValue} suffix={primarySuffix} /> : "—"}
          sublabel={primaryLabel}
        />
        <div className="result-stats">
          {stats.map((s) => (
            <div key={s.label} className="stat-box">
              <p className="label">{s.label}</p>
              <p className="value">
                {isValid ? <AnimatedNumber value={s.value} decimals={s.decimals ?? 2} suffix={s.suffix} /> : "—"}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mt-24">
        <span className="text-muted" style={{ fontSize: "0.85rem" }}>
          Performance level
        </span>
        <PerformanceBadge level={performanceLevel} />
      </div>
    </div>
  );
}
