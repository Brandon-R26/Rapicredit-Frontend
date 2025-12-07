"use client";

import { useEffect, useState } from "react";
// import { apiFetch } from "../lib/api";

export type EstadoCobradorFiltro = "TODOS" | "ACTIVO" | "INACTIVO";

export interface Cobrador {
  _id: string;
  codigo?: string;
  nombreCompleto: string;
  telefono?: string;
  correo?: string;
  zona?: string;
  estado?: string; // ACTIVO / INACTIVO
  fechaRegistro?: string;
  // opcionalmente: cantidadPrestamos, saldoCartera, saldoEnMora
  cantidadPrestamos?: number;
  saldoCartera?: number;
  saldoEnMora?: number;
}

export interface CobradoresFilters {
  busqueda: string;
  estado: EstadoCobradorFiltro;
  zona: string;
}

export function useCobradores(filters: CobradoresFilters) {
  const [data, setData] = useState<Cobrador[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        // Backend deshabilitado: datos en duro
        const res: Cobrador[] = [
          { _id: "cb1", nombreCompleto: "Carlos Gómez", correo: "carlos@demo.com", estado: "ACTIVO" },
          { _id: "cb2", nombreCompleto: "Ana Rivera", correo: "ana@demo.com", estado: "ACTIVO" },
        ];
        if (!cancelled) setData(res);
      } catch (err: any) {
        if (!cancelled) {
          console.error("Error cargando cobradores:", err);
          setError(err.message || "Error al cargar cobradores");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  let filtrados = [...data];

  // Filtro por estado
  if (filters.estado !== "TODOS") {
    filtrados = filtrados.filter(
      (c) => (c.estado || "").toUpperCase() === filters.estado
    );
  }

  // Filtro por zona
  if (filters.zona.trim()) {
    const q = filters.zona.trim().toLowerCase();
    filtrados = filtrados.filter((c) =>
      (c.zona || "").toLowerCase().includes(q)
    );
  }

  // Búsqueda por nombre, código, teléfono, correo
  if (filters.busqueda.trim()) {
    const q = filters.busqueda.trim().toLowerCase();
    filtrados = filtrados.filter((c) => {
      return (
        (c.nombreCompleto || "").toLowerCase().includes(q) ||
        (c.codigo || "").toLowerCase().includes(q) ||
        (c.telefono || "").toLowerCase().includes(q) ||
        (c.correo || "").toLowerCase().includes(q)
      );
    });
  }

  // Orden por nombre
  filtrados.sort((a, b) =>
    (a.nombreCompleto || "").localeCompare(b.nombreCompleto || "", "es")
  );

  return { data: filtrados, loading, error };
}
