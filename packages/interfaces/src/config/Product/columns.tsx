"use client";

import { Product, ProductCategory, UnitOfMeasure } from "@domain/entities/Product.entity";
import { TableActionsDropdown } from "@ui/index";
import { Package, Tag, DollarSign, Percent, Check, X } from "lucide-react";
import { Badge } from "@ui/index";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@ui/atoms/CardHover/hover-card";
import { ToastContainer, toast } from "react-toastify";

export const createColumns = (
    handleViewProduct: (product: any) => void,
    handleEditProduct: (product: any) => void,
    handleDeleteProduct: (product: any) => void
) => {
    return [
        {
            key: "code",
            header: "Código",
            className: "min-w-[120px] whitespace-nowrap",
            cell: (product: any) => {
                const code = product.code || 'N/A';
                const maxLength = 10;
                const truncatedCode = code.length > maxLength ? `${code.substring(0, maxLength)}...` : code;

                const handleCopyCode = async () => {
                    try {
                        await navigator.clipboard.writeText(code);
                        toast.success(`Código copiado: ${code}`, {
                            position: "bottom-right",
                            autoClose: 2000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                        });
                    } catch (err) {
                        console.error('Error al copiar:', err);
                        toast.error('Error al copiar el código', {
                            position: "bottom-right",
                            autoClose: 3000,
                        });
                    }
                };

                return (
                    <div className="flex items-center gap-2 max-w-[150px]">
                        <Package className="w-4 h-4 text-gray-500 shrink-0" />
                        {code.length > maxLength ? (
                            <HoverCard>
                                <HoverCardTrigger asChild>
                                    <span
                                        className="font-medium cursor-pointer hover:text-blue-600"
                                        onClick={handleCopyCode}
                                    >
                                        {truncatedCode}
                                    </span>
                                </HoverCardTrigger>
                                <HoverCardContent className="w-auto">
                                    <div className="space-y-1">
                                        <p className="text-sm font-semibold">Código completo:</p>
                                        <p className="text-sm font-mono">{code}</p>
                                        <p className="text-xs text-muted-foreground">Click para copiar</p>
                                    </div>
                                </HoverCardContent>
                            </HoverCard>
                        ) : (
                            <span
                                className="font-medium cursor-pointer hover:text-blue-600"
                                onClick={handleCopyCode}
                                title="Click para copiar"
                            >
                                {code}
                            </span>
                        )}
                    </div>
                );
            }
        },
        {
            key: "name",
            header: "Nombre",
            className: "min-w-[250px] w-full",
            cell: (product: any) => (
                <div className="flex flex-col min-w-[200px]">
                    <span className="font-semibold text-gray-900 truncate" title={product.name}>{product.name}</span>
                    {product.reference && (
                        <span className="text-sm text-gray-500 truncate" title={`Ref: ${product.reference}`}>Ref: {product.reference}</span>
                    )}
                </div>
            )
        },
        {
            key: "category",
            header: "Categoría",
            className: "min-w-[140px] whitespace-nowrap",
            cell: (product: any) => (
                <div className="flex items-center gap-2 text-gray-600">
                    <span className="text-sm font-medium">{product.category?.name || 'Sin categoría'}</span>
                </div>
            )
        },
        {
            key: "type",
            header: "Tipo",
            className: "min-w-[120px] whitespace-nowrap",
            cell: (product: any) => (
                <Badge
                    className="w-24 h-6 px-0 text-xs justify-center font-medium shadow-sm transition-colors"
                    variant={
                        product.type === 'SERVICE' ? "secondary" :
                            product.type === 'PRODUCT' ? "default" :
                                "outline"
                    }
                >
                    {getTypeLabel(product.type)}
                </Badge>
            )
        },
        {
            key: "store",
            header: "Bodega",
            className: "min-w-[120px] whitespace-nowrap",
            cell: (product: any) => (
                <div className="flex items-center gap-2 text-gray-600">
                    <span className="text-sm font-medium">{product.store?.name || 'Sin bodega'}</span>
                </div>
            )
        },
        {
            key: "unit",
            header: "Unidad",
            className: "min-w-[130px] whitespace-nowrap",
            cell: (product: any) => (
                <div className="flex items-center gap-1.5 text-gray-600 bg-gray-50 px-2 py-1 rounded-md w-fit border border-gray-100">
                    <Tag className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                    <span className="text-sm font-medium">{getUnitLabel(product.unit)}</span>
                </div>
            )
        },
        {
            key: "price",
            header: "Precio",
            className: "min-w-[180px] whitespace-nowrap",
            cell: (product: any) => {
                const price = product.prices?.[0]?.value || product.basePrice || product.finalPrice || '0';
                const numericPrice = typeof price === 'string' ? parseFloat(price) : price;

                return (
                    <div className="flex items-center gap-1.5 font-bold text-green-700 bg-green-50 px-2 py-1 rounded-md w-fit whitespace-nowrap">
                        <DollarSign className="w-4 h-4 shrink-0 text-green-600" />
                        <span className="tracking-tight">{!isNaN(numericPrice) ? numericPrice.toLocaleString("es-CO", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0,00'}</span>
                    </div>
                );
            }
        },
        {
            key: "tax",
            header: "Impuestos",
            className: "min-w-[110px] whitespace-nowrap",
            cell: (product: any) => (
                <div className="flex items-center gap-1.5 text-gray-600 bg-gray-50 px-2 py-1 rounded-md w-fit border border-gray-100">
                    <Percent className="w-3 h-3 shrink-0 text-gray-400" />
                    <span className="text-sm font-medium">{product.taxRate}%</span>
                </div>
            )
        },
        {
            key: "status",
            header: "Estado",
            className: "min-w-[120px] whitespace-nowrap",
            cell: (product: any) => (
                <div className="flex items-center">
                    {product.active ? (
                        <Badge
                            variant="active"
                            className="flex justify-center items-center gap-1 bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 w-24 px-0 h-6 text-xs transition-colors"
                        >
                            <Check className="w-3 h-3" />
                            Activo
                        </Badge>
                    ) : (
                        <Badge
                            variant="destructive"
                            className="flex justify-center items-center gap-1 bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 w-24 px-0 h-6 text-xs transition-colors"
                        >
                            <X className="w-3 h-3" />
                            Inactivo
                        </Badge>
                    )}
                </div>
            )
        },
        {
            key: "actions",
            header: "Acciones",
            className: "min-w-[100px] whitespace-nowrap",
            cell: (product: any) => (
                <TableActionsDropdown
                    onView={() => handleViewProduct(product)}
                    onEdit={() => handleEditProduct(product)}
                    onDelete={() => handleDeleteProduct(product)}
                />
            ),
        },
    ]
};

// Función para traducir tipos
const getTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
        'PRODUCT': "Producto",
        'SERVICE': "Servicio",
        'COMBO': "Combo",
        'VARIANT': "Variante"
    };
    return labels[type] || type;
};

// Función para traducir unidades de medida
const getUnitLabel = (unit: string): string => {
    const labels: Record<string, string> = {
        'UNIDAD': "Unidad",
        'PAR': "Par",
        'CAJA': "Caja",
        'BOTELLA': "Botella",
        'CENTIMETRO': "Centímetro",
        'CENTIMETRO_CUADRADO': "Centímetro²",
        'METRO_CUADRADO': "Metro²",
        'PULGADA': "Pulgada",
        'MILILITRO': "Mililitro",
        'LITRO': "Litro",
        'GALON': "Galón",
        'METRO_CUBICO': "Metro³",
        'GRAMO': "Gramo",
        'KILOGRAMO': "Kilogramo",
        'TONELADA': "Tonelada",
        'LIBRA': "Libra",
        'HORA': "Hora",
        'MINUTO': "Minuto",
        'DIA': "Día"
    };
    return labels[unit] || unit;
};

// Opcional: Componente para la tabla de productos
export const ProductTable = (handleEditCustomer: (product: Product) => void, handleDeleteCustomer: (product: Product) => Promise<void>, {
    products, handleViewProduct, handleEditProduct, handleDeleteProduct
}: {
    products: Product[];
    handleViewProduct: (product: any) => void;
    handleEditProduct: (product: any) => void;
    handleDeleteProduct: (product: any) => void;
}) => {
    const columns = createColumns(handleViewProduct, handleEditProduct, handleDeleteProduct);

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {columns.map((column: any) => (
                            <th
                                key={column.key}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                            {columns.map((column) => (
                                <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                                    {column.cell(product)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export const createCompactProductColumns = (
    handleViewProduct: (product: any) => void,
    handleEditProduct: (product: any) => void,
    handleDeleteProduct: (product: any) => void
) => {
    return [
        {
            key: "name",
            header: "Producto",
            cell: (product: any) => (
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-gray-500" />
                        <span className="font-semibold">{product.name}</span>
                    </div>
                    <div className="flex gap-4 mt-1 text-sm text-gray-500">
                        <span>Código: {product.codeProduct || 'N/A'}</span>
                        <span>Categoría: {getCategoryLabel(product.category || 'N/A')}</span>
                    </div>
                </div>
            )
        },
        {
            key: "details",
            header: "Detalles",
            cell: (product: any) => (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <Tag className="w-3 h-3" />
                        <span>{getUnitLabel(product.unitOfMeasure)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm">
                            Inv: {product.initialAmount !== null ? product.initialAmount : 'N/A'}
                        </span>
                    </div>
                </div>
            )
        },
        {
            key: "financial",
            header: "Financiero",
            cell: (product: any) => (
                <div className="flex flex-col">
                    <div className="flex items-center gap-2 font-semibold text-green-700">
                        <DollarSign className="w-4 h-4" />
                        {product.basePrice.toLocaleString("es-CO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-sm text-gray-500">
                        Impuesto: {product.taxRate}
                    </div>
                </div>
            )
        },
        {
            key: "actions",
            header: "Acciones",
            cell: (product: any) => (
                <TableActionsDropdown
                    onView={() => handleViewProduct(product)}
                    onEdit={() => handleEditProduct(product)}
                    onDelete={() => handleDeleteProduct(product)}
                />
            ),
        },
    ];
};

// Función para traducir categorías (si es necesario)
const getCategoryLabel = (category: string): string => {
    const labels: Record<string, string> = {
        // Añade aquí las categorías si las tienes definidas
    };
    return labels[category] || category;
};