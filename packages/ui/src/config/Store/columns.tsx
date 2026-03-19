"use client";

import { Store } from "@domain/entities/Store.entity";
import { TableActionsDropdown } from "../../molecules/TableActionsDropdown";

export const createColumns = (
  handleEditCustomer: (client: Store) => void,
  handleDeleteCustomer: (client: Store) => void,
) => {
  return [
    {
      key: "Name",
      header: "Nombre",
      cell: (store: Store) => (
        <div className="flex items-center gap-3">{store.name}</div>
      ),
    },
    {
      key: "Address",
      header: "Direccion",
      cell: (store: Store) => (
        <div className="flex items-center gap-3">{store.address || ""}</div>
      ),
    },
    {
      key: "Observations",
      header: "Observaciones",
      cell: (store: Store) => (
        <div className="flex items-center gap-3">{store.observation || ""}</div>
      ),
    },
    {
      key: "actions",
      header: "Acciones",
      cell: (store: Store) => (
        <TableActionsDropdown
          onView={() => {
            /* no-op */
          }}
          onEdit={() => handleEditCustomer(store)}
          onDelete={() => handleDeleteCustomer(store)}
        />
      ),
    },
  ];
};
