import React from 'react';
import { Skeleton } from '../atoms/Skeleton/skeleton';

export function DataTableSkeleton() {
    return (
        <div className={`rounded-lg bg-white border border-sidebar-border relative`}>
            <div className="w-full bg-white rounded-lg h-[calc(100vh-200px)] overflow-hidden flex flex-col">
                <table className="w-full table-fixed">
                    <thead className="border-b border border-sidebar-border">
                        <tr>
                            <th className="w-10 px-4 py-3 text-left">
                                <Skeleton className="w-4 h-4 rounded-sm bg-muted/30" />
                            </th>
                            {[1, 2, 3, 4, 5].map((idx) => (
                                <th key={idx} className="px-4 py-3 text-left">
                                    <Skeleton className="h-4 w-24" />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-sidebar-border">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <tr key={i} className="border-b border-sidebar-border">
                                <td className="w-10 px-4 py-4">
                                    <Skeleton className="w-4 h-4 rounded-sm bg-muted/40" />
                                </td>
                                {[1, 2, 3, 4].map((idx) => (
                                    <td key={idx} className="px-4 py-4">
                                        <Skeleton className="h-4 w-[70%]" />
                                    </td>
                                ))}
                                <td className="px-4 py-4 w-[100px]">
                                    <Skeleton className="h-6 w-16 rounded-full" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination mimicking DataTable */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-auto mb-6 mx-6 pt-4">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-[100px]" />
                        <Skeleton className="h-7 w-[60px] rounded" />
                        <Skeleton className="h-4 w-[120px]" />
                    </div>
                    <div className="flex items-center gap-1">
                        <Skeleton className="h-8 w-8 rounded" />
                        <Skeleton className="h-8 w-8 rounded" />
                        <Skeleton className="h-8 w-8 rounded" />
                        <Skeleton className="h-8 w-8 rounded" />
                    </div>
                </div>
            </div>
        </div>
    );
}
