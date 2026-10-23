"use client";

import React, { useEffect, useState } from "react";

export const DynamicBackground: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 50, y: 35 });

  useEffect(() => {
    // Subtle interactive light response on desktop
    const handleMouseMove = (e: MouseEvent) => {
      const x = Math.round((e.clientX / window.innerWidth) * 100);
      const y = Math.round((e.clientY / window.innerHeight) * 100);
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="dynamic-background-root" aria-hidden="true">
      {/* Deep dark void base */}
      <div className="aurora-base" />

      {/* Main Aurora Liquid Waves inspired by user reference photo */}
      <div className="aurora-container">
        {/* Wave 1: Intense Electric Blue & Azure Stream (Left & Bottom) */}
        <div className="aurora-wave aurora-wave-blue" />

        {/* Wave 2: Deep Violet & Radiant Lavender Swirl (Top & Right) */}
        <div className="aurora-wave aurora-wave-violet" />

        {/* Wave 3: Neon Cyan & Magenta Crest Glow (Center Swirl) */}
        <div className="aurora-wave aurora-wave-cyan" />

        {/* Wave 4: Ambient Floating Violet Nebula (Right Side Sweep) */}
        <div className="aurora-wave aurora-wave-magenta" />

        {/* Interactive Soft Mouse Follower Light */}
        <div
          className="aurora-interactive-glow"
          style={{
            left: `${mousePos.x}%`,
            top: `${mousePos.y}%`,
          }}
        />
      </div>

      {/* Atmospheric Soft Gradient Mesh Veil */}
      <div className="aurora-mesh-veil" />

      {/* Subtle Noise / Film Grain to prevent color banding */}
      <div className="aurora-grain-overlay" />
    </div>
  );
};
