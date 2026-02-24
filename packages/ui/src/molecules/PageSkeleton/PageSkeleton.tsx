import React from "react"
import { Skeleton } from "../../atoms/Skeleton/skeleton"

interface PageSkeletonProps {
    cardsCount?: number;
}

export function PageSkeleton({ cardsCount = 0 }: PageSkeletonProps) {
    const getGridCols = (count: number) => {
        if (count === 3) return "lg:grid-cols-3";
        if (count === 5) return "lg:grid-cols-5";
        return `lg:grid-cols-${count}`;
    };

    return (
        <div className="min-h-fit w-full">
            <div className="max-w-5xl mx-auto px-4 py-8">

                {/* Header Skeleton mimicking title and buttons layouts */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <div>
                        {/* Title h1 class: text-3xl font-bold */}
                        <Skeleton className="h-[36px] w-[280px]" />
                        {/* Subtitle p class: text-muted-foreground mt-2 */}
                        <Skeleton className="h-[20px] w-[200px] mt-2" />
                    </div>
                    {/* Botones flex gap-3 */}
                    <div className="flex gap-3">
                        {/* Exportar Button py-2 px-2 text-[15px] border */}
                        <Skeleton className="h-[38px] w-[90px] rounded" />
                        {/* Primary Button py-2 px-2 text-[14px] rounded-lg */}
                        <Skeleton className="h-[38px] w-[180px] rounded-lg" />
                    </div>
                </div>

                {/* Optional Grid Cards Skeleton */}
                {cardsCount > 0 && (
                    <div className={`grid grid-cols-1 sm:grid-cols-2 ${getGridCols(cardsCount)} gap-4 mt-8`}>
                        {Array.from({ length: cardsCount }).map((_, i) => (
                            <div key={i} className="border border-sidebar-border bg-white rounded-xl p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <Skeleton className="h-4 w-16 mb-1" />
                                        <Skeleton className="h-8 w-12" />
                                    </div>
                                    <Skeleton className="w-10 h-10 rounded-lg" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Table Area Skeleton mimicking DataTable.tsx exactly */}
                <div className={`rounded-lg bg-white border border-sidebar-border relative ${cardsCount > 0 ? 'mt-4' : 'mt-10'}`}>
                    <div className="w-full bg-white rounded-lg h-[calc(100vh-200px)] overflow-hidden flex flex-col">
                        <table className="w-full table-fixed">
                            <thead className="border-b border border-sidebar-border">
                                <tr>
                                    <th className="w-10 px-4 py-3 text-left">
                                        <Skeleton className="w-4 h-4 rounded-sm" />
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
                                            <Skeleton className="w-4 h-4 rounded-sm" />
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
            </div>
        </div>
    )
}
