import React from "react";
import { motion } from "framer-motion";

interface FirstAidBoxProps {
  onClick: () => void;
}

export function FirstAidBox({ onClick }: FirstAidBoxProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      layoutId="first-aid-box"
      aria-label="Start first aid chat"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{
        scale: [1, 1.03, 1],
        opacity: 1,
        y: [0, -6, 0],
      }}
      transition={{
        opacity: { duration: 0.4 },
        scale: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
        y: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
      }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      className="relative flex h-[128px] w-[128px] items-center justify-center rounded-[32px] focus:outline-none focus:ring-4 focus:ring-red-300/60"
      style={{
        background: "linear-gradient(145deg, #FF4D4D 0%, #FF2D2D 50%, #C41E1E 100%)",
        boxShadow:
          "0 20px 60px -10px rgba(255,45,45,0.55), 0 6px 20px -4px rgba(255,45,45,0.35), inset 0 1px 0 rgba(255,255,255,0.2)",
      }}
    >
      {/* Glossy inner highlight */}
      <span
        className="pointer-events-none absolute inset-0 rounded-[32px]"
        style={{
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.18) 0%, transparent 55%)",
        }}
      />
      {/* Cross SVG */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="relative z-10 h-14 w-14 drop-shadow-md"
        aria-hidden="true"
      >
        <path
          d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6V3z"
          fill="#FFFFFF"
          fillOpacity="0.95"
        />
      </svg>
    </motion.button>
  );
}
