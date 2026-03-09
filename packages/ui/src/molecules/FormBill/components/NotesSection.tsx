"use client";

import React from "react";
import { SectionCard, FieldLabel, StyledTextarea, StyledInput } from "./FormAtoms";

interface NotesSectionProps {
  formData: any;
  isEditable: boolean;
  onFormDataChange: (updates: any) => void;
}

export function NotesSection({
  formData,
  isEditable,
  onFormDataChange,
}: NotesSectionProps) {
  return (
    <SectionCard>
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Notas y condiciones
        </span>
      </div>
      <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <FieldLabel>Términos y condiciones</FieldLabel>
          <StyledTextarea
            rows={4}
            placeholder="Este documento se asimila en todos sus efectos a una letra de cambio..."
            value={formData.terms}
            onChange={(e) => onFormDataChange({ terms: e.target.value })}
            disabled={!isEditable}
          />
        </div>
        <div>
          <FieldLabel>Notas</FieldLabel>
          <StyledTextarea
            rows={4}
            placeholder="Notas adicionales para la factura..."
            value={formData.notes}
            onChange={(e) => onFormDataChange({ notes: e.target.value })}
            disabled={!isEditable}
          />
        </div>
      </div>
      <div className="px-6 pb-5">
        <FieldLabel>Pie de factura</FieldLabel>
        <StyledInput
          placeholder="Visible en la impresión del documento"
          value={formData.footerNote}
          onChange={(e) => onFormDataChange({ footerNote: e.target.value })}
          disabled={!isEditable}
        />
      </div>
    </SectionCard>
  );
}
