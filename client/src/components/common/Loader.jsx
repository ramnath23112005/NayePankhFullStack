import React from 'react';

export default function Loader() {
  return (
    <div className="fixed inset-0 z-[9999] bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        {/* Branded Spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-gray-200 dark:border-gray-800 rounded-full" />
          <div className="absolute inset-0 border-4 border-transparent border-t-green-600 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-green-600">NP</span>
          </div>
        </div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
}
