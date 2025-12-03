import React from 'react';
import { motion } from 'framer-motion';
import { IconType } from 'react-icons';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: IconType;
  color?: 'blue' | 'green' | 'orange' | 'purple';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  color = 'blue',
  trend,
}) => {
  const colorClasses = {
    blue: 'from-primary-800 to-primary-900',
    green: 'from-green-600 to-green-700',
    orange: 'from-orange-500 to-orange-600',
    purple: 'from-purple-600 to-purple-700',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={`bg-gradient-to-br ${colorClasses[color]} rounded-xl p-6 text-white shadow-medium`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-white/80 text-sm font-medium mb-2">{title}</p>
          <p className="text-3xl font-bold mb-2">{value}</p>
          {trend && (
            <div className="flex items-center gap-1 text-sm">
              <span className={trend.isPositive ? 'text-green-300' : 'text-red-300'}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-white/60">vs last month</span>
            </div>
          )}
        </div>
        <div className="bg-white/20 p-3 rounded-lg">
          <Icon size={28} />
        </div>
      </div>
    </motion.div>
  );
};
