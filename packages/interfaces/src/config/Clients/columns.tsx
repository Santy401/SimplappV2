"use client";

import { Button } from '@ui/index';
import { Client, OrganizationType } from "@domain/entities/Client.entity";
import { formatIdentificationType, getFullName } from "../../hooks/features/Clients/utils/index";
import { Hash, Mail, MapPin, Phone, Tag, Eye, Edit, Trash2 } from "lucide-react";

export const createColumns = (handleEditCustomer: (client: Client) => void,
    handleDeleteCustomer: (client: Client) => Promise<void>,
    handleViewCustomer: (client: Client) => void) => {

    return [
        {
            key: "basicInfo",
            header: "Información Básica",
            cell: (client: Client) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center font-semibold">
                        {getFullName(client).split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <div className="font-medium text-foreground-text truncate max-w-[180px]">
                            {getFullName(client)}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Tag size={12} />
                            {client.organizationType === OrganizationType.PERSON_JURIDIC ? "Jurídica" : "Natural"}
                        </div>
                        {client.code && (
                            <div className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                                <Hash size={10} />
                                {client.code}
                            </div>
                        )}
                    </div>
                </div>
            ),
        },
        {
            key: "identification",
            header: "Identificación",
            cell: (client: Client) => (
                <div className="space-y-1 min-w-[140px]">
                    <div className="font-medium text-foreground-text-second">
                        {formatIdentificationType(client.identificationType)}
                    </div>
                    <div className="text-sm text-gray-500 font-mono">
                        {client.identificationNumber}
                    </div>
                </div>
            ),
        },
        {
            key: "contact",
            header: "Contacto",
            cell: (client: Client) => (
                <div className="space-y-1 min-w-[160px]">
                    {client.email && (
                        <div className="flex items-center gap-2 text-sm">
                            <Mail size={12} className="text-foreground-text-second" />
                            <span className="text-foreground-text-second truncate max-w-[150px]">
                                {client.email}
                            </span>
                        </div>
                    )}
                    {client.phone && (
                        <div className="flex items-center gap-2 text-sm">
                            <Phone size={12} className="text-gray-400" />
                            <span className="text-gray-400">
                                {client.phone}
                            </span>
                        </div>
                    )}
                    {!client.email && !client.phone && (
                        <span className="text-sm text-gray-500 italic">Sin contacto</span>
                    )}
                </div>
            ),
        },
        {
            key: "location",
            header: "Ubicación",
            cell: (client: Client) => (
                <div className="space-y-1 min-w-[140px]">
                    <div className="font-medium text-foreground-text-second text-sm">
                        {client.country || "Sin país"}
                    </div>
                    {(client.department || client.municipality) && (
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                            <MapPin size={10} />
                            {[client.department, client.municipality].filter(Boolean).join(", ")}
                        </div>
                    )}
                    {client.postalCode && (
                        <div className="text-xs text-gray-400">
                            CP: {client.postalCode}
                        </div>
                    )}
                </div>
            ),
        },
        {
            key: "address",
            header: "Dirección",
            cell: (client: Client) => (
                <div className="text-sm text-gray-500 max-w-[180px] truncate">
                    {client.address || "Sin dirección"}
                </div>
            ),
        },
        {
            key: "type",
            header: "Tipo",
            cell: (client: Client) => (
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full justify-center text-xs font-medium ${client.is_supplier
                    ? "bg-green-500/20 text-green-500 border border-green-500/30"
                    : "bg-blue-500/20 text-blue-500 border border-blue-500/30"
                    }`}>
                    <div className={`pr-[21px] w-2 h-2 rounded-full justify-center items-center ${client.is_supplier ? "bg-green-500" : "bg-blue-500"
                        }`} />
                    {client.is_supplier ? "Proveedor" : "Cliente"}
                </div>
            ),
        },
        {
            key: "features",
            header: "Características",
            cell: (client: Client) => (
                <div className="flex flex-wrap gap-1">
                    {client.it_branches && (
                        <span className="px-2 py-2 w-20 text-center text-xs bg-purple-500/20 text-purple-400 rounded">
                            Sucursales
                        </span>
                    )}
                    {client.includeCcBcc && (
                        <span className="px-2 py-2 w-20 text-center text-xs bg-yellow-500/20 text-yellow-400 rounded">
                            Cc/Bcc
                        </span>
                    )}
                    {!client.it_branches && !client.includeCcBcc && (
                        <span className="px-2 py-1 text-xs bg-gray-500/20 text-gray-400 rounded">
                            N/A
                        </span>
                    )}
                </div>
            ),
        },
        {
            key: "actions",
            header: "Acciones",
            cell: (client: Client) => (
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewCustomer(client)}
                        className="hover:bg-gray-800 hover:text-white"
                        title="Ver detalles"
                    >
                        <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditCustomer(client)}
                        className="hover:bg-gray-800 hover:text-white"
                        title="Editar"
                    >
                        <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCustomer(client)}
                        className="hover:bg-red-500/20 text-red-500 hover:text-red-400"
                        title="Eliminar"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            ),
        },
    ];
};

// export { createColumns as columns };