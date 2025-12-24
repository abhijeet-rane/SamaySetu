import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hover = false, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card ${className} ${onClick ? 'cursor-pointer' : ''}`}
      whileHover={hover ? { y: -4, shadow: '0 12px 24px rgba(0,0,0,0.15)' } : {}}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};
