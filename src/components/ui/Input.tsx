import React from "react";
import clsx from "clsx";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="form-group">
        {label && (
          <label htmlFor={inputId} className="form-label">
            {label}
          </label>
        )}
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          {leftIcon && (
            <span
              style={{
                position: "absolute",
                left: "1rem",
                display: "flex",
                alignItems: "center",
                pointerEvents: "none",
                color: "var(--text-muted)",
              }}
            >
              {leftIcon}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            className={clsx("input", className)}
            style={{
              paddingLeft: leftIcon ? "2.75rem" : undefined,
              paddingRight: rightIcon ? "2.75rem" : undefined,
              borderColor: error ? "var(--color-danger)" : undefined,
            }}
            {...props}
          />
          {rightIcon && (
            <span
              style={{
                position: "absolute",
                right: "1rem",
                display: "flex",
                alignItems: "center",
                color: "var(--text-muted)",
              }}
            >
              {rightIcon}
            </span>
          )}
        </div>
        {error && (
          <p style={{ color: "var(--color-danger)", fontSize: "0.8125rem", marginTop: "0.25rem" }}>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p style={{ color: "var(--text-muted)", fontSize: "0.8125rem", marginTop: "0.25rem" }}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
