"use client";

import { Store } from "@domain/entities/Store.entity"

export const createColumns = (handleEditCustomer: (client: Store) => void) => {

    return [
        {
            key: "Info",
            header: "Informacion Basica",
            cell: (store: Store) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center font-semibold">
                        {store.name}
                    </div>
                    <div className="min-w-0">
                        <div className="font-medium text-foreground-text truncate max-w-[180px]">

                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                            {/* <Tag size={12} /> */}

                        </div>
                        {/* {client.code && (
                            <div className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                                <Hash size={10} />
                                {client.code}
                            </div>
                        )} */}
                    </div>
                </div>
            )
        }
    ]
}
