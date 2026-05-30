import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FirstAidBox } from "@/components/FirstAidBox";
import { ChatSurface } from "@/components/ChatSurface";
import { useSession } from "@/hooks/useSession";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aceso — AI Paramedic | First Aid Assistant" },
      {
        name: "description",
        content:
          "AI-powered first aid assistant providing calm, evidence-based emergency guidance. Not a replacement for professional medical care.",
      },
    ],
  }),
  component: Index,
});

// Floating particle component
function Particle({ delay, x, y, size }: { delay: number; x: string; y: string; size: number }) {
  return (
    <motion.span
      className="pointer-events-none absolute rounded-full bg-red-400/20"
      style={{ left: x, top: y, width: size, height: size }}
      animate={{
        y: [0, -18, 0],
        opacity: [0.3, 0.7, 0.3],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 4 + delay,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    />
  );
}

const PARTICLES = [
  { delay: 0, x: "10%", y: "20%", size: 8 },
  { delay: 0.8, x: "85%", y: "15%", size: 12 },
  { delay: 1.4, x: "70%", y: "75%", size: 6 },
  { delay: 0.5, x: "20%", y: "70%", size: 10 },
  { delay: 2, x: "50%", y: "10%", size: 7 },
  { delay: 1.1, x: "90%", y: "55%", size: 9 },
  { delay: 0.3, x: "5%", y: "50%", size: 5 },
  { delay: 1.7, x: "40%", y: "85%", size: 11 },
];

function Index() {
  const [open, setOpen] = useState(false);
  const { sessionId } = useSession();

  return (
    <main className="relative min-h-dvh overflow-hidden">
      {/* Premium gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#fff5f5] via-white to-[#fff0f0]" />
      {/* Radial glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,_rgba(255,45,45,0.1),_transparent)]" />
      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#FF2D2D 1px, transparent 1px), linear-gradient(to right, #FF2D2D 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* Floating particles */}
      {PARTICLES.map((p, i) => (
        <Particle key={i} {...p} />
      ))}

      <AnimatePresence mode="wait">
        {!open ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.3 }}
            className="relative flex min-h-dvh flex-col items-center justify-center gap-10 px-4 text-center"
          >
            {/* Live badge — bounces in */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 300, damping: 20 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-white/80 px-4 py-1.5 text-sm font-medium text-red-500 shadow-sm backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                </span>
                AI Paramedic · Always ready
              </span>
            </motion.div>

            {/* Main button with animated rings */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 260, damping: 22 }}
              className="relative flex items-center justify-center"
            >
              {/* Animated shockwave rings */}
              {[1, 2, 3].map((i) => (
                <motion.span
                  key={i}
                  className="absolute rounded-[38px]"
                  style={{
                    border: "1.5px solid rgba(255,45,45,0.2)",
                    inset: `-${i * 22}px`,
                  }}
                  animate={{
                    opacity: [0.7, 0, 0.7],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 3.2,
                    repeat: Infinity,
                    delay: i * 0.65,
                    ease: "easeInOut",
                  }}
                />
              ))}
              <FirstAidBox onClick={() => setOpen(true)} />
            </motion.div>

            {/* Text below — slides up */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, type: "spring", stiffness: 200, damping: 24 }}
              className="flex flex-col items-center gap-1.5"
            >
              <p className="text-lg font-semibold text-black">Tap for first aid guidance</p>
              <p className="text-sm text-[#9CA3AF]">Calm. Clear. Evidence-based.</p>
            </motion.div>

            {/* Scroll hint arrow — gentle bounce */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: [0, 6, 0] }}
              transition={{
                opacity: { delay: 1.2, duration: 0.4 },
                y: { delay: 1.2, duration: 1.8, repeat: Infinity, ease: "easeInOut" },
              }}
              className="absolute bottom-8 flex flex-col items-center gap-1"
            >
              <p className="text-xs text-[#D1D5DB]">Emergency contacts below</p>
              <svg className="h-4 w-4 text-[#D1D5DB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.div>
          </motion.div>
        ) : (
          <ChatSurface key="chat" sessionId={sessionId} />
        )}
      </AnimatePresence>
    </main>
  );
}
