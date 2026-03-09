"use client";

import React from "react";
import { Package, X, Plus } from "lucide-react";
import { SectionCard, SectionHeader, StyledSelect, StyledInput, fmt } from "./FormAtoms";
import { Product } from "@domain/entities/Product.entity";
import { Store } from "@domain/entities/Store.entity";
import { FormBillItem } from "../FormBill";

interface ItemsTableProps {
  items: FormBillItem[];
  products: Product[];
  stores: Store[];
  isEditable: boolean;
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
  onItemChange: (id: string, field: keyof FormBillItem, value: any) => void;
  onProductSelect: (itemId: string, productId: string) => void;
}

export function ItemsTable({
  items,
  products,
  stores,
  isEditable,
  onAddItem,
  onRemoveItem,
  onItemChange,
  onProductSelect,
}: ItemsTableProps) {
  return (
    <SectionCard>
      <SectionHeader
        icon={Package}
        title="Productos y servicios"
        badge={
          <span className="text-xs font-semibold text-[#6C47FF] bg-[#6C47FF]/10 px-2 py-0.5 rounded-full ml-1">
            {items.length}
          </span>
        }
      />

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-800/40">
              {["Producto / Servicio", "Descripción", "Cant.", "Precio", "Imp.", "Bodega", "Desc %", "Total", ""].map((h, i) => (
                <th
                  key={i}
                  className={`px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400
                    ${i >= 2 && i <= 7 ? "text-right" : "text-left"}
                    ${i === 8 ? "w-10" : ""}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {items.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-8 text-center text-slate-400 text-sm">
                  No hay ítems en esta factura
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr
                  key={item.id}
                  className="group hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                >
                  {/* Producto */}
                  <td className="px-4 py-3">
                    <StyledSelect
                      value={item.productId || ""}
                      onChange={(e) => onProductSelect(item.id, e.target.value)}
                      disabled={!isEditable || products.length === 0}
                      className="min-w-[180px]"
                    >
                      <option value="">
                        {products.length === 0 ? "No hay productos" : "Buscar ítem..."}
                      </option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id!}>
                          {product.name} - ${product.basePrice}
                        </option>
                      ))}
                    </StyledSelect>
                  </td>
                  {/* Descripción */}
                  <td className="px-4 py-3">
                    <StyledInput
                      placeholder="Descripción"
                      value={item.description}
                      onChange={(e) => onItemChange(item.id, "description", e.target.value)}
                      disabled={!isEditable}
                      className="min-w-[140px]"
                    />
                  </td>
                  {/* Cantidad */}
                  <td className="px-4 py-3">
                    <StyledInput
                      type="number"
                      min="0"
                      step="any"
                      placeholder="0"
                      value={item.quantity || ""}
                      onChange={(e) =>
                        onItemChange(item.id, "quantity", parseFloat(e.target.value) || 0)
                      }
                      disabled={!isEditable}
                      className="w-20 text-right"
                    />
                  </td>
                  {/* Precio */}
                  <td className="px-4 py-3">
                    <StyledInput
                      type="number"
                      min="0"
                      placeholder="0"
                      value={item.price || ""}
                      onChange={(e) =>
                        onItemChange(item.id, "price", parseFloat(e.target.value) || 0)
                      }
                      disabled={!isEditable}
                      className="w-28 text-right"
                    />
                  </td>
                  {/* Impuesto */}
                  <td className="px-4 py-3">
                    <StyledSelect
                      value={item.taxRate.toString()}
                      onChange={(e) =>
                        onItemChange(item.id, "taxRate", parseFloat(e.target.value))
                      }
                      disabled={!isEditable}
                      className="w-24"
                    >
                      <option value="0">0%</option>
                      <option value="5">5%</option>
                      <option value="10.5">10.5%</option>
                      <option value="19">19%</option>
                      <option value="21">21%</option>
                    </StyledSelect>
                  </td>
                  {/* Bodega */}
                  <td className="px-4 py-3">
                    <StyledSelect
                      value={item.storeId || ""}
                      onChange={(e) => onItemChange(item.id, "storeId", e.target.value)}
                      disabled={!isEditable}
                      className="w-28"
                    >
                      <option value="">Bodega</option>
                      {stores.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </StyledSelect>
                  </td>
                  {/* Descuento */}
                  <td className="px-4 py-3">
                    <StyledInput
                      type="number"
                      min="0"
                      max="100"
                      step="any"
                      placeholder="%"
                      value={item.discount || ""}
                      onChange={(e) =>
                        onItemChange(item.id, "discount", parseFloat(e.target.value) || 0)
                      }
                      disabled={!isEditable}
                      className="w-16 text-right"
                    />
                  </td>
                  {/* Total */}
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      $ {fmt(item.total)}
                    </span>
                  </td>
                  {/* Remove */}
                  <td className="px-4 py-3">
                    {isEditable && (
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.id)}
                        disabled={items.length === 1}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400
                          hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20
                          transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isEditable && (
        <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onAddItem}
            className="flex items-center gap-1.5 text-sm font-medium text-[#6C47FF] hover:text-[#5835E8] transition-colors"
          >
            <div className="w-5 h-5 rounded-md bg-[#6C47FF]/10 flex items-center justify-center">
              <Plus className="w-3 h-3" />
            </div>
            Agregar línea
          </button>
        </div>
      )}
    </SectionCard>
  );
}
