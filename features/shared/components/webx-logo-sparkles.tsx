"use client";

import React from "react";
import { SparklesCore } from "./sparkles-core";
import { WebxLogo } from "./webx-logo";

type WebxLogoSparklesProps = {
  /** Rendered logo width in px. Height scales to the 238:74 aspect ratio. */
  width?: number;
  className?: string;
  /** Optional alternate logo path. Defaults to the inline WebX SVG. */
  logoSrc?: string;
  particleColor?: string;
  particleDensity?: number;
  /** Colour of the logo's "web" letters. */
  textColor?: string;
};

/** WebX logo with an animated sparkle field for dark surfaces. */
export const WebxLogoSparkles = ({
  width = 240,
  className,
  logoSrc,
  particleColor = "#FFFFFF",
  particleDensity = 520,
  textColor,
}: WebxLogoSparklesProps) => {
  const height = Math.round((width * 74) / 238);

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className ?? ""}`}
      style={{ width, height }}
    >
      <div
        className="pointer-events-none absolute -inset-x-[40%] -inset-y-[120%]"
        style={{
          maskImage: "radial-gradient(60% 50% at 50% 50%, white, transparent 75%)",
          WebkitMaskImage: "radial-gradient(60% 50% at 50% 50%, white, transparent 75%)",
        }}
      >
        <SparklesCore
          particleColor={particleColor}
          particleDensity={particleDensity}
          maxSize={1.2}
          minSize={0.4}
          speed={0.8}
        />
      </div>
      {logoSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoSrc}
          alt="WebX"
          width={width}
          height={height}
          className="relative select-none"
          draggable={false}
        />
      ) : (
        <WebxLogo width={width} height={height} textColor={textColor} className="relative select-none" />
      )}
    </div>
  );
};
