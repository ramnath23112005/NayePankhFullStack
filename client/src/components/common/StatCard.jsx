import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { HiArrowRight } from 'react-icons/hi';

const colorMap = {
  green: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    icon: 'text-green-600 dark:text-green-400',
    text: 'text-green-700 dark:text-green-300',
    border: 'border-green-200 dark:border-green-800',
    trendUp: 'text-green-600',
    trendDown: 'text-red-600',
  },
  yellow: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    icon: 'text-yellow-600 dark:text-yellow-400',
    text: 'text-yellow-700 dark:text-yellow-300',
    border: 'border-yellow-200 dark:border-yellow-800',
    trendUp: 'text-green-600',
    trendDown: 'text-red-600',
  },
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    icon: 'text-blue-600 dark:text-blue-400',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-800',
    trendUp: 'text-green-600',
    trendDown: 'text-red-600',
  },
  red: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    icon: 'text-red-600 dark:text-red-400',
    text: 'text-red-700 dark:text-red-300',
    border: 'border-red-200 dark:border-red-800',
    trendUp: 'text-green-600',
    trendDown: 'text-red-600',
  },
};

function AnimatedCounter({ value }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (value === undefined || value === null) return;
    const numValue = Number(value);
    const duration = 800;
    const steps = 30;
    const increment = numValue / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), numValue);
      setDisplay(current);
      if (step >= steps) {
        setDisplay(numValue);
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{display.toLocaleString()}</span>;
}

export default function StatCard({
  title = '',
  value = 0,
  icon: Icon,
  color = 'green',
  trend,
}) {
  const colors = colorMap[color] || colorMap.green;
  const isUp = trend >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`relative overflow-hidden bg-white dark:bg-gray-900 rounded-xl border ${colors.border} p-6 hover:shadow-lg transition-shadow`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <p className={`text-3xl font-bold ${colors.text}`}>
            <AnimatedCounter value={value} />
          </p>
          {trend !== undefined && trend !== null && (
            <div className="flex items-center space-x-1">
              <HiArrowRight
                className={`w-4 h-4 ${
                  isUp ? colors.trendUp : colors.trendDown
                } ${isUp ? '' : 'rotate-90'} transition-transform`}
              />
              <span
                className={`text-sm font-medium ${
                  isUp ? colors.trendUp : colors.trendDown
                }`}
              >
                {Math.abs(trend)}%
              </span>
              <span className="text-xs text-gray-400">vs last month</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg ${colors.bg}`}>
            <Icon className={`w-6 h-6 ${colors.icon}`} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
