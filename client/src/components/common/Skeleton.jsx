import React from 'react';

function SkeletonBar({ className = '' }) {
  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}
    />
  );
}

function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <SkeletonBar className="h-4 w-24" />
        <SkeletonBar className="h-8 w-8 rounded-full" />
      </div>
      <SkeletonBar className="h-8 w-16" />
      <SkeletonBar className="h-3 w-32" />
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <SkeletonBar className="h-8 w-64" />
      </div>
      <div className="p-6 space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <SkeletonBar className="h-4 flex-1" />
            <SkeletonBar className="h-4 w-24" />
            <SkeletonBar className="h-4 w-20" />
            <SkeletonBar className="h-8 w-20 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <SkeletonBar className="h-4 w-32" />
        <SkeletonBar className="h-4 w-16" />
      </div>
      <div className="flex items-end space-x-2 h-40">
        {[...Array(8)].map((_, i) => (
          <SkeletonBar
            key={i}
            className="flex-1"
            style={{ height: `${30 + Math.random() * 70}%` }}
          />
        ))}
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <SkeletonBar className="h-16 w-16 rounded-full" />
        <div className="space-y-2 flex-1">
          <SkeletonBar className="h-5 w-40" />
          <SkeletonBar className="h-3 w-24" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-1">
            <SkeletonBar className="h-3 w-20" />
            <SkeletonBar className="h-5 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

const skeletonMap = {
  card: CardSkeleton,
  table: TableSkeleton,
  chart: ChartSkeleton,
  profile: ProfileSkeleton,
};

export default function Skeleton({ type = 'card', count = 1 }) {
  const Component = skeletonMap[type] || CardSkeleton;

  return (
    <>
      {[...Array(count)].map((_, i) => (
        <Component key={i} />
      ))}
    </>
  );
}
