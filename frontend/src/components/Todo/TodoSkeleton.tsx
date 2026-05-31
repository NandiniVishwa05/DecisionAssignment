import React from 'react';

export const TodoCardSkeleton: React.FC = () => (
  <div className="bg-white border border-gray-100 rounded-xl p-5 flex flex-col gap-3.5">
    {/* Top row: checkbox + title + actions */}
    <div className="flex items-center gap-3">
      <div className="skeleton w-5 h-5 rounded-md flex-shrink-0" />
      <div className="skeleton h-4 w-3/5 rounded-md" />
      <div className="ml-auto flex gap-1.5">
        <div className="skeleton w-7 h-7 rounded-lg" />
        <div className="skeleton w-7 h-7 rounded-lg" />
      </div>
    </div>

    {/* Description lines */}
    <div className="ml-8 flex flex-col gap-1.5">
      <div className="skeleton h-3 w-11/12 rounded" />
      <div className="skeleton h-3 w-4/5 rounded" />
    </div>

    {/* Footer badges + date */}
    <div className="ml-8 flex items-center gap-2 flex-wrap">
      <div className="skeleton h-5 w-16 rounded-full" />
      <div className="skeleton h-5 w-20 rounded-full" />
      <div className="ml-auto">
        <div className="skeleton h-3 w-20 rounded" />
      </div>
    </div>
  </div>
);

export const SkeletonGrid: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <div className="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-3.5">
    {Array.from({ length: count }).map((_, i) => (
      <TodoCardSkeleton key={i} />
    ))}
  </div>
);
