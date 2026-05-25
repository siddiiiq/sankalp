import { motion } from 'framer-motion';

// Define the animation states for our pages
const pageVariants = {
  initial: {
    opacity: 0,
    y: 15, // Starts slightly pushed down
    scale: 0.98, // Starts slightly shrunk
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 1, 0.5, 1], // Super smooth easing curve
    },
  },
  exit: {
    opacity: 0,
    y: -10, // Exits smoothly by pulling up
    scale: 0.98,
    transition: {
      duration: 0.25,
      ease: [0.25, 0, 0.5, 1],
    },
  },
};

export default function AnimatedPage({ children, className = "" }) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className={`w-full min-h-screen ${className}`}
    >
      {children}
    </motion.div>
  );
}