import React from "react";
import clsx from "clsx";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "coral" | "cyan" | "purple" | "success" | "warning" | "danger";
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = "cyan",
  ...props
}) => {
  return (
    <span
      className={clsx(
        "badge",
        variant === "coral" && "badge-coral",
        variant === "cyan" && "badge-cyan",
        variant === "purple" && "badge-purple",
        variant === "success" && "badge-success",
        variant === "warning" && "badge-warning",
        variant === "danger" && "badge-danger",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
