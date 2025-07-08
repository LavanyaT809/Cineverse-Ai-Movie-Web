// components/PageWrapper.jsx
//animation of moving from one page to other fade in coming up

// Import motion component from Framer Motion
import { motion } from 'framer-motion';

//  Animation variants for page transition
const pageVariants = {
  // Initial state when page enters
  initial: { opacity: 0, y: 40 },

  // Final state when animation completes (page visible)
  animate: { opacity: 1, y: 0 },

  // Exit state when page is leaving
  exit: { opacity: 0, y: -20 },
};

//  PageWrapper component wraps each page route to add animation
export default function PageWrapper({ children }) {
  return (
    <motion.div
      // Tell motion to use our variants defined above
      variants={pageVariants}

      // Set initial animation state when component mounts
      initial="initial"

      // Animate to this state after mount
      animate="animate"

      // Animate to this state when component unmounts
      exit="exit"

      // Customize animation timing
      transition={{ duration: 0.4, ease: 'easeInOut' }}

      // Required to prevent layout jump during animation
      style={{
        position: "absolute", // stack pages on top of each other
        width: "100%",        // take full width
      }}
    >
      {/* Render the page component inside motion animation */}
      {children}
    </motion.div>
  );
}
