import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const AnimatedTitle = ({ children }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const variants = {
    hidden: {
      opacity: 0,
      x: -200, // começa mais longe à esquerda
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1.2,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.h2
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={variants}
      className="text-3xl font-bold text-gray-800 mb-4"
    >
      {children}
    </motion.h2>
  );
};

export default AnimatedTitle;
