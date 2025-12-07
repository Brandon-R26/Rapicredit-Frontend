"use client";

import { useEffect, useState } from "react";
// import { apiFetch } from "../lib/api";

export type TipoDocFiltro = "TODOS" | "IDENTIDAD" | "RTN";
export type EstadoClienteFiltro = "TODOS" | "ACTIVO" | "INACTIVO";

export interface Cliente {
  _id: string;
  codigoCliente?: string;
  identidadCliente?: string;
  RTN?: string;
  nombres?: string;
  apellidos?: string;
  telefono?: string;
  direccion?: string;
  correo?: string;
  estado?: string; // ACTIVO / INACTIVO / MOROSO etc.
  fechaRegistro?: string;
}

export interface ClientesFilters {
  busqueda: string;
  tipoDoc: TipoDocFiltro;
  estado: EstadoClienteFiltro;
}

export function useClientes(filters: ClientesFilters) {
  const [data, setData] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        // Backend deshabilitado: datos en duro
        const res: Cliente[] = [
          {
            _id: "cl1",
            codigoCliente: "CL-001",
            identidadCliente: "0801-1990-00000",
            nombres: "Juan",
            apellidos: "Pérez",
            estado: "ACTIVO",
          },
          {
            _id: "cl2",
            codigoCliente: "CL-002",
            identidadCliente: "0801-1992-11111",
            nombres: "María",
            apellidos: "López",
            estado: "ACTIVO",
          },
        ];
        if (!cancelled) setData(res);
      } catch (err: any) {
        if (!cancelled) {
          console.error("Error cargando clientes:", err);
          setError(err.message || "Error al cargar clientes");
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

  // 🔹 Filtros en memoria
  let filtrados = [...data];

  // Filtro por tipo de documento
  if (filters.tipoDoc === "IDENTIDAD") {
    filtrados = filtrados.filter((c) => c.identidadCliente);
  } else if (filters.tipoDoc === "RTN") {
    filtrados = filtrados.filter((c) => c.RTN);
  }

  // Filtro por estado
  if (filters.estado !== "TODOS") {
    filtrados = filtrados.filter(
      (c) => (c.estado || "").toUpperCase() === filters.estado
    );
  }

  // Búsqueda por nombre, código, identidad, RTN
  if (filters.busqueda.trim()) {
    const q = filters.busqueda.trim().toLowerCase();
    filtrados = filtrados.filter((c) => {
      const nombre = [c.nombres, c.apellidos].filter(Boolean).join(" ");
      return (
        (c.codigoCliente || "").toLowerCase().includes(q) ||
        (c.identidadCliente || "").toLowerCase().includes(q) ||
        (c.RTN || "").toLowerCase().includes(q) ||
        nombre.toLowerCase().includes(q)
      );
    });
  }

  // Orden simple: por nombre
  filtrados.sort((a, b) => {
    const nombreA = [a.nombres, a.apellidos].filter(Boolean).join(" ");
    const nombreB = [b.nombres, b.apellidos].filter(Boolean).join(" ");
    return nombreA.localeCompare(nombreB, "es");
  });

  return { data: filtrados, loading, error };
}
