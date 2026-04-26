"use client";

import React from "react";
import { Upload, Hash, User, Calendar } from "lucide-react";
import { SectionCard, FieldLabel, StyledSelect, StyledInput } from "./FormAtoms";
import { Client } from "@domain/entities/Client.entity";
import { BillStatus } from "@domain/entities/Bill.entity";

interface BillDetailsSectionProps {
  formData: any;
  isEditable: boolean;
  clients: Client[];
  initialBillNumber?: string | number;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClientSelect: (clientId: string) => void;
  onFormDataChange: (updates: any) => void;
}

function getBillTypeLabel(paymentMethod: string): string {
  if (paymentMethod === "CREDIT") {
    return "Factura de Venta - Crédito";
  }
  return "Factura de Venta";
}

export function BillDetailsSection({
  formData,
  isEditable,
  clients,
  initialBillNumber,
  fileInputRef,
  onLogoChange,
  onClientSelect,
  onFormDataChange,
}: BillDetailsSectionProps) {
  return (
    <SectionCard>
      {/* ── Document Header (Logo + Number) ── */}
      <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-6">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          className="hidden"
          onChange={onLogoChange}
        />
        <button
          type="button"
          onClick={() => isEditable && fileInputRef.current?.click()}
          className={`group relative flex items-center justify-center border-2 border-dashed
            border-slate-200 dark:border-slate-700 rounded-xl transition-colors overflow-hidden
            w-36 h-20 shrink-0
            ${isEditable ? "hover:border-[#6C47FF]/50 cursor-pointer" : "cursor-default"}
            ${formData.logo ? "border-none" : ""}`}
        >
          {formData.logo ? (
            <>
              <img src={formData.logo} alt="Logo empresa" className="w-full h-full object-contain" />
              {isEditable && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
                  <Upload className="w-4 h-4 text-white" />
                </div>
              )}
            </>
          ) : (
            <div className={`flex flex-col items-center gap-1 text-slate-400 transition-colors ${isEditable ? "group-hover:text-[#6C47FF]" : ""}`}>
              <Upload className="w-5 h-5" />
              <span className="text-xs font-medium">Logo empresa</span>
              <span className="text-xs text-slate-300">.jpg o .png</span>
            </div>
          )}
        </button>

        <div className="flex-1 text-center">
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Simplapp</p>
          <p className="text-xs text-slate-400 mt-0.5">{getBillTypeLabel(formData.paymentMethod)}</p>
        </div>

        <div className="text-right shrink-0">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-1">Número</p>
          <div className="inline-flex items-center gap-1.5 bg-[#6C47FF]/8 border border-[#6C47FF]/20 rounded-lg px-3 py-1.5">
            <Hash className="w-3.5 h-3.5 text-[#6C47FF]" />
            <span className="text-lg font-bold text-[#6C47FF]">{initialBillNumber || "Auto"}</span>
          </div>
        </div>
      </div>

      {/* ── Client + Dates grid ── */}
      <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Client Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#6C47FF]" />
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Información del cliente
            </span>
          </div>

          <div>
            <FieldLabel required>Nombre o razón social</FieldLabel>
            <StyledSelect
              value={formData.selectedClientId || ""}
              onChange={(e) => onClientSelect(e.target.value)}
              disabled={!isEditable || clients.length === 0}
            >
              <option value="">
                {clients.length === 0 ? "No hay clientes disponibles" : "Seleccionar cliente"}
              </option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.firstName} {client.firstLastName} - {client.identificationNumber}
                </option>
              ))}
            </StyledSelect>
          </div>

          <div className="flex gap-2">
            <div className="w-28">
              <FieldLabel>Tipo ID</FieldLabel>
              <StyledSelect
                value={formData.clientType}
                onChange={(e) => onFormDataChange({ clientType: e.target.value })}
                disabled={!isEditable}
              >
                <option value="CC">CC</option>
                <option value="NIT">NIT</option>
                <option value="CE">CE</option>
                <option value="PASSPORT">Pasaporte</option>
              </StyledSelect>
            </div>
            <div className="flex-1">
              <FieldLabel>Número de ID</FieldLabel>
              <StyledInput
                placeholder="Ej: 10234567"
                value={formData.clientId}
                onChange={(e) => onFormDataChange({ clientId: e.target.value })}
                disabled={!isEditable}
              />
            </div>
          </div>

          <div>
            <FieldLabel>Correo electrónico</FieldLabel>
            <StyledInput
              type="email"
              placeholder="correo@ejemplo.com"
              value={formData.email}
              onChange={(e) => onFormDataChange({ email: e.target.value })}
              disabled={!isEditable}
            />
          </div>
        </div>

        {/* Dates & Status */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#6C47FF]" />
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Fechas y estado
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel required>Fecha</FieldLabel>
              <StyledInput
                type="date"
                value={formData.date}
                onChange={(e) => onFormDataChange({ date: e.target.value })}
                disabled={!isEditable}
              />
            </div>
            <div>
              <FieldLabel required>Vencimiento</FieldLabel>
              <StyledInput
                type="date"
                value={formData.dueDate}
                onChange={(e) => onFormDataChange({ dueDate: e.target.value })}
                disabled={!isEditable}
              />
            </div>
          </div>

          <div>
            <FieldLabel>Estado</FieldLabel>
            <StyledSelect
              value={formData.status}
              onChange={(e) => onFormDataChange({ status: e.target.value as BillStatus })}
              disabled={!isEditable}
            >
              <option value="DRAFT">Borrador</option>
              <option value="ISSUED">Emitida</option>
              <option value="PAID">Pagada</option>
              <option value="PARTIALLY_PAID">Pago Parcial</option>
              <option value="CANCELLED">Cancelada</option>
              <option value="TO_PAY">Por Pagar</option>
            </StyledSelect>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
