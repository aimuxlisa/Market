import React from "react";
import clsx from "clsx";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  radius?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  radius,
  className,
  style,
  ...props
}) => {
  return (
    <div
      className={clsx("skeleton", className)}
      style={{
        width,
        height,
        borderRadius: radius,
        ...style,
      }}
      {...props}
    />
  );
};

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="product-card" style={{ pointerEvents: "none" }}>
      <Skeleton height={220} radius="16px 16px 0 0" />
      <div style={{ padding: "1.15rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <Skeleton width="40%" height={14} />
        <Skeleton width="90%" height={18} />
        <Skeleton width="60%" height={18} />
        <Skeleton width="30%" height={16} style={{ marginTop: "0.25rem" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem" }}>
          <Skeleton width="50%" height={24} />
          <Skeleton width={38} height={38} radius="10px" />
        </div>
      </div>
    </div>
  );
};
