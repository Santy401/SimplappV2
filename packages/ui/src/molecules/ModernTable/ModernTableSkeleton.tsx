import React from 'react';
import { Skeleton } from '../../atoms/Skeleton/skeleton';

interface ModernTableSkeletonProps {
  rowCount?: number;
  columnCount?: number;
}

export function ModernTableSkeleton({ rowCount = 5, columnCount = 6 }: ModernTableSkeletonProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden w-full">
      {/* Toolbar Skeleton */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24 rounded-md" />
        </div>
        <div className="relative w-full sm:w-72">
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </div>
      
      {/* Table grid Skeleton */}
      <div className="overflow-x-auto min-h-[300px]">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="p-4 w-10">
                <Skeleton className="w-4 h-4 rounded bg-slate-200 dark:bg-slate-700" />
              </th>
              {Array.from({ length: columnCount }).map((_, idx) => (
                <th key={idx} className="p-4">
                  <Skeleton className="h-4 w-24 bg-slate-200 dark:bg-slate-700/50" />
                </th>
              ))}
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {Array.from({ length: rowCount }).map((_, i) => (
              <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="p-4">
                  <Skeleton className="w-4 h-4 rounded bg-slate-200 dark:bg-slate-700" />
                </td>
                {Array.from({ length: columnCount }).map((_, idx) => (
                  <td key={idx} className="p-4">
                    <Skeleton className={`h-4 ${idx === 0 ? 'w-32' : idx === columnCount - 1 ? 'w-16 ml-auto' : 'w-full max-w-[120px]'} bg-slate-100 dark:bg-slate-800`} />
                  </td>
                ))}
                <td className="p-4 text-right">
                  <Skeleton className="w-4 h-4 ml-auto rounded-full bg-slate-200 dark:bg-slate-700" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Skeleton */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/30 dark:bg-slate-900/30">
        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-8 w-16 rounded-md" />
          <Skeleton className="h-5 w-16" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-5 w-32" />
          <div className="flex items-center gap-1">
            <Skeleton className="w-8 h-8 rounded-md" />
            <Skeleton className="w-8 h-8 rounded-md" />
            <div className="flex items-center gap-1 mx-1">
              <Skeleton className="h-5 w-8" />
              <span className="text-slate-200 dark:text-slate-800">/</span>
              <Skeleton className="h-5 w-8" />
            </div>
            <Skeleton className="w-8 h-8 rounded-md" />
            <Skeleton className="w-8 h-8 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
