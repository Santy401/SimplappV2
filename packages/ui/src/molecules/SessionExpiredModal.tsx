// components/SessionExpiredModal.tsx
"use client";

import { Button } from "@ui/atoms/Button/Button";
import { AlertTriangle } from "lucide-react";

interface SessionExpiredModalProps {
  isOpen: boolean;
  onLogin: () => void;
}

export const SessionExpiredModal = ({ isOpen, onLogin }: SessionExpiredModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop no clickeable */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative bg-card border border-sidebar-border rounded-xl shadow-2xl max-w-md w-full mx-4 p-6 animate-in fade-in zoom-in duration-300">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Sesión Expirada
          </h2>
          <p className="text-muted-foreground mb-6">
            Tu sesión ha expirado. Por favor, inicia sesión nuevamente para continuar.
          </p>
          <Button
            onClick={onLogin}
            className="w-full bg-primary hover:bg-primary/90 rounded py-1 cursor-pointer"
          >
            Iniciar Sesión
          </Button>
        </div>
      </div>
    </div>
  );
};