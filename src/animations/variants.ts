import type { Variants, Transition } from "framer-motion";

export const shockwave: Variants = {
  animate: {
    scale: [1, 2.5],
    opacity: [0.4, 0],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeOut",
    },
  },
};

export const float: Variants = {
  animate: {
    y: [-4, -12, -4],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export const messageSlideUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export const morphTransition: Transition = {
  type: "spring",
  stiffness: 200,
  damping: 30,
};
