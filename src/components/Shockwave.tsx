import React from "react";
import { motion } from "framer-motion";

const RING_DELAYS = [0, 0.4, 0.8] as const;

export function Shockwave() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
    >
      {RING_DELAYS.map((delay) => (
        <motion.span
          key={delay}
          className="absolute h-[120px] w-[120px] rounded-2xl"
          style={{ backgroundColor: "rgba(255, 45, 45, 0.15)" }}
          initial={{ scale: 1, opacity: 0.4 }}
          animate={{ scale: 2.5, opacity: 0 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeOut",
            delay,
          }}
        />
      ))}
    </div>
  );
}
