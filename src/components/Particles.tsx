"use client";

import { useMemo, useState, useCallback } from "react";
import GlassModal from "@/components/GlassModal";
import type React from "react";

type ParticleSpec = {
  id: string;
  sizePx: number;
  hue: number;
  durationSec: number;
  delaySec: number;
  angleDeg: number;
  trackOffsetPercent: number;
  opacity: number;
  paletteRotDeg: number;
};

export default function Particles({ count = 60 }: { count?: number }) {
  const particles = useMemo<ParticleSpec[]>(() => {
    const specs: ParticleSpec[] = [];
    for (let i = 0; i < count; i += 1) {
      const sizePx = Math.floor(10 + Math.random() * 44); // 10-54px
      const hue = Math.floor(Math.random() * 360);
      const durationSec = 16 + Math.random() * 34; // 16-50s
      const delaySec = -Math.random() * durationSec; // start mid-animation
      const angleDeg = Math.floor(Math.random() * 360);
      const trackOffsetPercent = Math.floor(Math.random() * 100); // where along the cross-axis
      const opacity = 0.45 + Math.random() * 0.4; // 0.45-0.85
      const paletteRotDeg = Math.floor(Math.random() * 360);
      specs.push({
        id: `p-${i}`,
        sizePx,
        hue,
        durationSec,
        delaySec,
        angleDeg,
        trackOffsetPercent,
        opacity,
        paletteRotDeg,
      });
    }
    return specs;
  }, [count]);

  const [active, setActive] = useState<ActiveState>(null);
  const closeModal = useCallback(() => setActive(null), []);

  return (
    <div className="fixed inset-0 overflow-hidden">
      {particles.map((p) => {
        return (
          <div key={p.id} className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div style={{ transform: `rotate(${p.angleDeg}deg)` }}>
            {/* Particle track */}
            <span
              className={[
                // geometry & motion
                "absolute rounded-full will-change-transform cursor-pointer pointer-events-auto",
                "w-[var(--size)] h-[var(--size)]",
                "top-[var(--track)] left-[-15vw]",
                "animate-[particles-slide_var(--dur)_linear_var(--delay)_infinite]",
                // base glass body (subtle tint + frosted blur)
                "backdrop-blur-3xl backdrop-saturate-150",
                "ring-2 ring-white/20 border border-white/20",
                // outer rim and soft shadow
                "shadow-[0_4px_30px_rgba(0,0,0,0.25),_0_0_calc(var(--size)*0.9)_hsla(var(--hue)_80%_60%_/_0.35)]",
                "mix-blend-screen",
              ].join(" ")}
              style={{
                ...( {
                  "--size": `${p.sizePx}px`,
                  "--track": `${p.trackOffsetPercent}vh`,
                  "--dur": `${p.durationSec}s`,
                  "--delay": `${p.delaySec}s`,
                  "--hue": `${p.hue}`,
                  "--rot": `${p.paletteRotDeg}deg`,
                } as CSSVarStyle ),
                opacity: p.opacity,
              }}
              onClick={(e) => {
                e.stopPropagation();
                setActive({ hue: p.hue, rot: p.paletteRotDeg });
              }}
            >
              {/* Color-in-glass glow (radial) */}
              <span
                className={[
                  "absolute inset-0 rounded-full z-0",
                  // multi-stop radial color with darker rim for spherical depth
                  "bg-[radial-gradient(circle_at_55%_60%,hsl(var(--hue)_85%_65%/_0.95)_0%,hsl(var(--hue)_80%_60%/_0.7)_35%,hsl(var(--hue)_70%_45%/_0.35)_65%,transparent_80%)]",
                  "opacity-90 mix-blend-screen",
                ].join(" ")}
              />

              {/* Multi-hue conic tint for rainbow-like core */}
              <span
                className={[
                  "absolute inset-0 rounded-full z-0",
                  "bg-[conic-gradient(from_var(--rot)_at_50%_50%,#ff5ea0_0%,#ffc14d_22%,#94f9a0_48%,#34d3ff_70%,#b18cff_85%,#ff5ea0_100%)]",
                  "opacity-55 mix-blend-screen",
                ].join(" ")}
              />

              {/* Neutral glass shading dome (gives the sphere form) */}
              <span
                className={[
                  "absolute inset-0 rounded-full z-0",
                  "bg-[radial-gradient(circle_at_40%_30%,rgba(255,255,255,0.85)_0%,rgba(255,255,255,0.45)_15%,rgba(255,255,255,0.12)_40%,rgba(0,0,0,0.25)_72%,rgba(0,0,0,0.45)_100%)]",
                  "opacity-70",
                ].join(" ")}
              />

              {/* No eyes on floating orbs; eyes appear only inside the modal */}

              {/* Subtle inner frost depth */}
              <span className="absolute inset-0 rounded-full shadow-[inset_0_10px_22px_rgba(255,255,255,0.45),_inset_0_-8px_18px_rgba(0,0,0,0.35)] z-10" />

              {/* Outer rim darkening for glass edge */}
              <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_50%,transparent_62%,rgba(0,0,0,0.5)_100%)] opacity-70 mix-blend-multiply z-10" />

              {/* Fine grain for micro-surface scattering */}
              <span className="absolute inset-0 rounded-full opacity-15 mix-blend-overlay z-10 [background-image:radial-gradient(rgba(255,255,255,0.25)_1px,transparent_1px),radial-gradient(rgba(0,0,0,0.15)_1px,transparent_1px)] [background-position:0_0,2px_2px] [background-size:4px_4px]" />
            </span>
            </div>
          </div>
        );
      })}
      <GlassPortal active={active} onClose={closeModal} />
    </div>
  );
}

type CSSVarStyle = React.CSSProperties & {
  "--size": string;
  "--track": string;
  "--dur": string;
  "--delay": string;
  "--hue": string;
  "--rot"?: string;
};

type ActiveState = { hue: number; rot: number } | null;

function GlassPortal({ active, onClose }: { active: ActiveState; onClose: () => void }) {
  if (!active) return null;
  return <GlassModal open={true} onClose={onClose} hue={active.hue} rotDeg={active.rot} />;
}


