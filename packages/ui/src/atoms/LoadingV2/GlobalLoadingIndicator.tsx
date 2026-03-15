"use client";

import { useLoading, notify } from "@simplapp/interfaces";
import { useEffect, useRef } from "react";
import { toast, Id } from "react-toastify";

/**
 * Controlador de Carga Global
 * Escucha el LoadingContext y dispara un toast de carga sincronizado.
 * No renderiza UI propia, usa el sistema de notificaciones.
 */
export const GlobalLoadingIndicator = () => {
  const { isLoading, activeLoaders } = useLoading();
  const toastId = useRef<Id | null>(null);

  useEffect(() => {
    if (isLoading) {
      // Si ya hay un toast, no creamos otro, pero podríamos actualizar el texto
      if (!toastId.current) {
        const message = activeLoaders.length > 0 
          ? `Cargando ${activeLoaders[0]}...` 
          : "Procesando...";
          
        toastId.current = notify.loading(message);
      }
    } else {
      // Cuando deja de cargar, cerramos el toast
      if (toastId.current) {
        toast.dismiss(toastId.current);
        toastId.current = null;
      }
    }
  }, [isLoading, activeLoaders]);

  return null; // Componente lógico, no renderiza nada en el DOM
};
