import { useState, type ButtonHTMLAttributes, type MouseEvent, type ReactNode } from "react";

interface RippleState { id: number; x: number; y: number; size: number }

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  block?: boolean;
  children: ReactNode;
}

/** Reusable button with a built-in ripple effect and press/hover animation. */
export function Button({
  variant = "primary",
  size = "md",
  block,
  className = "",
  onClick,
  children,
  ...props
}: ButtonProps) {
  const [ripples, setRipples] = useState<RippleState[]>([]);

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.4;
    const id = Date.now();
    setRipples((prev) => [
      ...prev,
      { id, x: e.clientX - rect.left - size / 2, y: e.clientY - rect.top - size / 2, size },
    ]);
    window.setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 650);
    onClick?.(e);
  }

  const variantClass = variant === "primary" ? "btn-primary" : variant === "outline" ? "btn-outline" : "btn-danger";
  const sizeClass = size === "sm" ? "btn-sm" : size === "lg" ? "btn-lg" : "";

  return (
    <button
      className={`btn ${variantClass} ${sizeClass} ${block ? "btn-block" : ""} ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}
      {ripples.map((r) => (
        <span key={r.id} className="ripple" style={{ left: r.x, top: r.y, width: r.size, height: r.size }} />
      ))}
    </button>
  );
}
