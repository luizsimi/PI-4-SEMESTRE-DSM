import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const AnimatedBox = ({
  children,
  className = "",
  delay = 0,
  axis = "x"  // nova prop, pode ser "x" ou "y"
}) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  // define inicial dependendo do eixo
  const initial = axis === "x"
    ? { opacity: 0, x: -200 }
    : { opacity: 0, y: 50 };

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.8, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedBox;
