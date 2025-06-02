
import { Variants } from 'framer-motion';

// Drag & Drop Animations
export const dragVariants: Variants = {
  idle: {
    scale: 1,
    rotate: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 30 }
  },
  dragging: {
    scale: 0.95,
    rotate: 2,
    opacity: 0.8,
    zIndex: 1000,
    transition: { type: "spring", stiffness: 300, damping: 30 }
  },
  dropped: {
    scale: [0.95, 1.05, 1.0],
    rotate: 0,
    opacity: 1,
    transition: { 
      type: "spring", 
      stiffness: 400, 
      damping: 25,
      times: [0, 0.6, 1]
    }
  }
};

// Block Selection Animations
export const selectionVariants: Variants = {
  unselected: {
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 30 }
  },
  selected: {
    scale: [1, 1.02, 1],
    transition: { 
      repeat: Infinity,
      repeatType: "reverse",
      duration: 2,
      ease: "easeInOut"
    }
  }
};

// Drop Zone Animations
export const dropZoneVariants: Variants = {
  inactive: {
    opacity: 0,
    scale: 0.95,
    borderColor: "transparent"
  },
  active: {
    opacity: 1,
    scale: 1,
    borderColor: "#3b82f6",
    transition: { type: "spring", stiffness: 400, damping: 25 }
  },
  hover: {
    scale: 1.02,
    borderColor: "#1d4ed8",
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    transition: { type: "spring", stiffness: 400, damping: 25 }
  }
};

// AI Suggestions Animations
export const suggestionVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -20,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 30 }
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: { duration: 0.2 }
  }
};

// Chip Stagger Animation
export const chipContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export const chipVariants: Variants = {
  hidden: { opacity: 0, x: -20, scale: 0.8 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 30 }
  }
};

// Button Interactions
export const buttonVariants: Variants = {
  idle: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: { type: "spring", stiffness: 400, damping: 25 }
  },
  tap: { 
    scale: 0.95,
    transition: { type: "spring", stiffness: 400, damping: 25 }
  }
};

// Success/Error States
export const statusVariants: Variants = {
  success: {
    scale: [1, 1.2, 1],
    backgroundColor: ["#10b981", "#34d399", "#10b981"],
    transition: { duration: 0.6, times: [0, 0.5, 1] }
  },
  error: {
    x: [-5, 5, -5, 5, 0],
    backgroundColor: ["#ef4444", "#f87171", "#ef4444"],
    transition: { duration: 0.5 }
  }
};

// Panel Slide Animations
export const panelVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.2 }
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 30,
      staggerChildren: 0.1
    }
  }
};

// Canvas responsiveness
export const canvasVariants: Variants = {
  desktop: {
    width: 600,
    transition: { type: "spring", stiffness: 300, damping: 30 }
  },
  mobile: {
    width: 375,
    transition: { type: "spring", stiffness: 300, damping: 30 }
  }
};

// Loading animations
export const loadingVariants: Variants = {
  animate: {
    opacity: [0.5, 1, 0.5],
    transition: {
      repeat: Infinity,
      duration: 1.5,
      ease: "easeInOut"
    }
  }
};
