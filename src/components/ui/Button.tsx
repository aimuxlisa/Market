import React from "react";
import clsx from "clsx";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "cyan" | "outline" | "ghost" | "icon";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={clsx(
          "btn",
          variant === "primary" && "btn-primary",
          variant === "secondary" && "btn-secondary",
          variant === "cyan" && "btn-cyan",
          variant === "outline" && "btn-outline",
          variant === "ghost" && "btn-ghost",
          variant === "icon" && "btn-icon",
          size === "sm" && "btn-sm",
          size === "lg" && "btn-lg",
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="spinner" aria-hidden="true" style={{ width: 18, height: 18, border: "2px solid currentColor", borderRightColor: "transparent", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
