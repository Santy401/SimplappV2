"use client";

import React from "react";
import { Tag } from "lucide-react";
import { SectionCard, SectionHeader, FieldLabel, StyledSelect } from "./FormAtoms";
import { ListPrice } from "@domain/entities/ListPrice.entity";
import { Seller } from "@domain/entities/Seller.entity";
import { PaymentMethod } from "@domain/entities/Bill.entity";

interface ConfigSectionProps {
  priceList: string;
  seller: string;
  paymentMethod: PaymentMethod;
  isEditable: boolean;
  listPrices: ListPrice[];
  sellers: Seller[];
  onFormDataChange: (updates: any) => void;
}

export function ConfigSection({
  priceList,
  seller,
  paymentMethod,
  isEditable,
  listPrices,
  sellers,
  onFormDataChange,
}: ConfigSectionProps) {
  return (
    <SectionCard>
      <SectionHeader icon={Tag} title="Configuración" />
      <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-3 gap-5">
        <div>
          <FieldLabel>Lista de precios</FieldLabel>
          <StyledSelect
            value={priceList}
            onChange={(e) => onFormDataChange({ priceList: e.target.value })}
            disabled={!isEditable}
          >
            <option value="">Seleccionar precio</option>
            {listPrices.map((lp) => (
              <option key={lp.id} value={lp.id}>{lp.name}</option>
            ))}
            {listPrices.length === 0 && (
              <option value="" disabled>No hay listas disponibles</option>
            )}
          </StyledSelect>
        </div>

        <div>
          <FieldLabel>Vendedor</FieldLabel>
          <StyledSelect
            value={seller}
            onChange={(e) => onFormDataChange({ seller: e.target.value })}
            disabled={!isEditable}
          >
            <option value="">Seleccionar vendedor</option>
            {sellers.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
            {sellers.length === 0 && (
              <option value="" disabled>No hay vendedores disponibles</option>
            )}
          </StyledSelect>
        </div>

        <div>
          <FieldLabel required>Forma de pago</FieldLabel>
          <StyledSelect
            value={paymentMethod}
            onChange={(e) =>
              onFormDataChange({ paymentMethod: e.target.value as PaymentMethod })
            }
            disabled={!isEditable}
          >
            <option value="CASH">Contado</option>
            <option value="CREDIT">Crédito</option>
            <option value="TRANSFER">Transferencia</option>
            <option value="CREDIT_CARD">Tarjeta de Crédito</option>
            <option value="DEBIT_CARD">Tarjeta Débito</option>
            <option value="CHECK">Cheque</option>
          </StyledSelect>
        </div>
      </div>
    </SectionCard>
  );
}
