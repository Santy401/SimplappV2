"use client";

import { useEffect } from "react";
import { useLoading } from "../contexts/LoadingContext";

/**
 * Hook para registrar un componente en el sistema de carga global.
 * Al montarse el componente, se inicia el estado de carga.
 * Al desmontarse, se detiene.
 *
 * @param id Identificador único del componente
 * @param condition Condición opcional para activar la carga
 */
export const useComponentLoading = (id: string, condition: boolean = true) => {
  const { startLoading, stopLoading } = useLoading();

  useEffect(() => {
    if (condition) {
      startLoading(id);
    } else {
      stopLoading(id);
    }

    return () => {
      stopLoading(id);
    };
  }, [id, condition, startLoading, stopLoading]);
};
