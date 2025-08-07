"use client";

import type React from "react";
import { useEffect } from "react";

export type GlassModalProps = {
  open: boolean;
  onClose: () => void;
  hue: number; // 0-360
  rotDeg?: number; // rotation for conic tint
};

export default function GlassModal({ open, onClose, hue, rotDeg = 0 }: GlassModalProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // no mouse tracking for eyes in the modal

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Dim/blurred backdrop */}
      <button
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Glass dialog */}
      <div
        className="relative mx-4 w-full max-w-xl aspect-square rounded-full p-6 pointer-events-auto animate-[modal-in_360ms_cubic-bezier(0.2,0.7,0.2,1)_forwards] [animation:head-look_14s_cubic-bezier(0.25,0.8,0.25,1)_infinite] will-change-transform"
        style={({ "--hue": String(hue), "--rot": `${rotDeg}deg` } as CSSVarModalStyle)}
      >
        {/* Outer glass shell */}
        <div className="absolute inset-0 rounded-full ring-2 ring-white/20 border border-white/20 backdrop-blur-3xl backdrop-saturate-150 mix-blend-screen z-10" />

        {/* Color core (radial) */}
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_55%_60%,hsl(var(--hue)_85%_65%/_0.95)_0%,hsl(var(--hue)_80%_60%/_0.7)_35%,hsl(var(--hue)_70%_45%/_0.35)_65%,transparent_82%)] opacity-90 mix-blend-screen z-10" />

        {/* Conic rainbow tint */}
        <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_var(--rot)_at_50%_50%,#ff5ea0_0%,#ffc14d_22%,#94f9a0_48%,#34d3ff_70%,#b18cff_85%,#ff5ea0_100%)] opacity-55 mix-blend-screen z-10" />

        {/* Spherical shading */}
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_40%_30%,rgba(255,255,255,0.85)_0%,rgba(255,255,255,0.45)_15%,rgba(255,255,255,0.12)_40%,rgba(0,0,0,0.25)_72%,rgba(0,0,0,0.5)_100%)] opacity-70 z-20" />

        {/* Eyes (vertical pills) */}
        <div
          className="absolute inset-0 z-[100]"
          style={({
            "--eye-w": "clamp(34px, 11%, 72px)",
            "--eye-h": "clamp(104px, 38%, 220px)",
          } as CSSVarEyesStyle)}
        >
          {/* LEFT EYE: wrapper moves (look), SVG core blinks */}
          <div
            className="absolute z-[110] will-change-transform"
            style={{ left: "41%", top: "34%", transform: "translate(-50%, -50%)", animation: "eyes-look 14s cubic-bezier(0.25,0.8,0.25,1) infinite" }}
          >
            <svg
              viewBox="0 0 120 360"
              className="block"
              style={{ width: "var(--eye-w)", height: "var(--eye-h)", animation: "blink-natural 11s 0s infinite", transformOrigin: "60px 180px" }}
            >
              <path
                d="M60 0 C 28 0 14 34 14 90 V 270 C 14 326 28 360 60 360 C 92 360 106 326 106 270 V 90 C 106 34 92 0 60 0 Z"
                fill="#ffffff"
                stroke="rgba(0,0,0,0.4)"
                strokeWidth="6"
              />
            </svg>
          </div>

          {/* RIGHT EYE: wrapper moves (look), SVG core blinks */}
          <div
            className="absolute z-[110] will-change-transform"
            style={{ left: "59%", top: "34%", transform: "translate(-50%, -50%)", animation: "eyes-look 14s cubic-bezier(0.25,0.8,0.25,1) infinite" }}
          >
            <svg
              viewBox="0 0 120 360"
              className="block"
              style={{ width: "var(--eye-w)", height: "var(--eye-h)", animation: "blink-natural 11s 0s infinite", transformOrigin: "60px 180px" }}
            >
              <path
                d="M60 0 C 28 0 14 34 14 90 V 270 C 14 326 28 360 60 360 C 92 360 106 326 106 270 V 90 C 106 34 92 0 60 0 Z"
                fill="#ffffff"
                stroke="rgba(0,0,0,0.4)"
                strokeWidth="6"
              />
            </svg>
          </div>
        </div>

        {/* Inner frost depth */}
        <div className="absolute inset-0 rounded-full shadow-[inset_0_10px_22px_rgba(255,255,255,0.45),_inset_0_-8px_18px_rgba(0,0,0,0.35)] z-40" />

        {/* Rim darkening */}
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_50%,transparent_62%,rgba(0,0,0,0.55)_100%)] opacity-70 mix-blend-multiply z-30" />

        {/* Fine grain */}
        <div className="absolute inset-0 rounded-full opacity-15 mix-blend-overlay z-30 [background-image:radial-gradient(rgba(255,255,255,0.25)_1px,transparent_1px),radial-gradient(rgba(0,0,0,0.15)_1px,transparent_1px)] [background-position:0_0,2px_2px] [background-size:4px_4px]" />

        {/* Content area (invisible, just to keep spacing for potential text later) */}
        <div className="relative z-10 h-full w-full" />
      </div>
    </div>
  );
}

type CSSVarModalStyle = React.CSSProperties & {
  "--hue": string;
  "--rot": string;
};

type CSSVarEyesStyle = React.CSSProperties & {
  "--eye-w": string;
  "--eye-h": string;
};


