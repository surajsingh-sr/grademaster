import type { InputHTMLAttributes, SelectHTMLAttributes, ReactNode } from "react";

interface FloatingInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

/** Text/number input with a floating label and animated error message. */
export function FloatingInput({ label, error, id, ...props }: FloatingInputProps) {
  const inputId = id ?? `field-${label.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <div className={`field ${error ? "has-error" : ""}`}>
      <input id={inputId} placeholder=" " aria-invalid={!!error} {...props} />
      <label htmlFor={inputId}>{label}</label>
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  children: ReactNode;
}

/** Native select styled to match the input fields, with a static label above it. */
export function SelectField({ label, children, ...props }: SelectFieldProps) {
  return (
    <div>
      <span className="field-label-static">{label}</span>
      <div className="field">
        <select {...props}>{children}</select>
      </div>
    </div>
  );
}
