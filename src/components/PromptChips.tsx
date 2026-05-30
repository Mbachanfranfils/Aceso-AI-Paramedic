import { PROMPT_CHIPS } from "@/lib/constants";
import { motion } from "framer-motion";

interface PromptChipsProps {
  onSelect: (chip: string) => void;
  disabled?: boolean;
}

export function PromptChips({ onSelect, disabled }: PromptChipsProps) {
  return (
    <motion.div
      className="flex flex-wrap gap-2"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.07 } },
      }}
    >
      {PROMPT_CHIPS.map((chip) => (
        <motion.button
          key={chip}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(chip)}
          variants={{
            hidden: { opacity: 0, y: 12, scale: 0.9 },
            visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 22 } },
          }}
          whileHover={{ scale: 1.06, y: -2, transition: { type: "spring", stiffness: 400, damping: 18 } }}
          whileTap={{ scale: 0.93 }}
          className="cursor-pointer rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-medium text-[#374151] shadow-sm transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {chip}
        </motion.button>
      ))}
    </motion.div>
  );
}
