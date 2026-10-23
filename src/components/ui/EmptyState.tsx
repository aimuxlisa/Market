import React from "react";
import { PackageOpen } from "lucide-react";
import Link from "next/link";
import { Button } from "./Button";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionText,
  actionHref,
  onAction,
}) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        {icon || <PackageOpen size={32} />}
      </div>
      <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)" }}>
        {title}
      </h3>
      <p style={{ color: "var(--text-secondary)", maxWidth: "420px", fontSize: "0.9375rem" }}>
        {description}
      </p>
      {(actionText && actionHref) && (
        <Link href={actionHref}>
          <Button variant="cyan" size="md">
            {actionText}
          </Button>
        </Link>
      )}
      {(actionText && onAction && !actionHref) && (
        <Button variant="cyan" size="md" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
