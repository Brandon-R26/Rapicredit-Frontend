"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";

export type EstadoFiltro = "TODOS" | "VIGENTE" | "EN_MORA" | "PAGADO";
export type OrdenarPor =
  | "MAS_RECIENTES"
  | "MONTO_MAYOR"
  | "MONTO_MENOR"
  | "MAYOR_ATRASO";

export interface ClienteResumen {
  _id?: string;
  codigoCliente?: string;
  identidadCliente?: string;
  RTN?: string;
  nombres?: string;
  apellidos?: string;
}

export interface CobradorResumen {
  _id?: string;
  nombreCompleto?: string;
}

export interface SolicitudResumen {
  _id?: string;
  finalidadCredito?: string;
}

export interface Prestamo {
  _id: string;
  codigoFinanciamiento?: string;
  clienteId?: ClienteResumen | null;
  cobradorAsignadoId?: CobradorResumen | null;
  solicitudId?: SolicitudResumen | null;
  capitalInicial?: number;
  saldoCapital?: number;
  estadoFinanciamiento?: string;
  fechaDesembolso?: string;
  fechaVencimiento?: string;
  totalMoraPlan?: number;
  totalPagado?: number;
}

export interface PrestamosFilters {
  estado: EstadoFiltro;
  ordenarPor: OrdenarPor;
  busqueda: string;
}

export function usePrestamos(filters: PrestamosFilters) {
  const [data, setData] = useState<Prestamo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        // 🔹 Traemos TODO de /financiamientos y filtramos en el front
        const res = await apiFetch<Prestamo[]>("/financiamientos");
        if (!cancelled) {
          setData(res || []);
        }
      } catch (err: any) {
        if (!cancelled) {
          console.error("Error cargando préstamos:", err);
          setError(err.message || "Error al cargar préstamos");
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
  }, []); // 👈 solo se llama una vez, filtros se aplican en memoria

  // 🔹 Aplicamos filtros y orden en el cliente
  let filtrados = [...data];

  // Filtro por estado
  if (filters.estado !== "TODOS") {
    filtrados = filtrados.filter(
      (p) => (p.estadoFinanciamiento || "").toUpperCase() === filters.estado
    );
  }

  // Filtro por búsqueda (código, identidad, nombre)
  if (filters.busqueda.trim()) {
    const q = filters.busqueda.trim().toLowerCase();
    filtrados = filtrados.filter((p) => {
      const codigo = p.codigoFinanciamiento || "";
      const cli = p.clienteId || {};
      const identidad = cli.identidadCliente || "";
      const codCliente = cli.codigoCliente || "";
      const nombre = [cli.nombres, cli.apellidos].filter(Boolean).join(" ");
      return (
        codigo.toLowerCase().includes(q) ||
        identidad.toLowerCase().includes(q) ||
        codCliente.toLowerCase().includes(q) ||
        nombre.toLowerCase().includes(q)
      );
    });
  }

  // Ordenamiento
  filtrados.sort((a, b) => {
    const montoA = a.capitalInicial ?? 0;
    const montoB = b.capitalInicial ?? 0;

    const fechaDesA = a.fechaDesembolso
      ? new Date(a.fechaDesembolso).getTime()
      : 0;
    const fechaDesB = b.fechaDesembolso
      ? new Date(b.fechaDesembolso).getTime()
      : 0;

    switch (filters.ordenarPor) {
      case "MONTO_MAYOR":
        return montoB - montoA;
      case "MONTO_MENOR":
        return montoA - montoB;
      case "MAYOR_ATRASO": {
        // muy simple: en mora primero, luego vigentes, luego pagados
        const ordenEstado = (estado?: string) => {
          const e = (estado || "").toUpperCase();
          if (e === "EN_MORA") return 0;
          if (e === "VIGENTE") return 1;
          if (e === "PAGADO") return 2;
          return 3;
        };
        return (
          ordenEstado(a.estadoFinanciamiento) -
          ordenEstado(b.estadoFinanciamiento)
        );
      }
      case "MAS_RECIENTES":
      default:
        return fechaDesB - fechaDesA;
    }
  });

  return { data: filtrados, loading, error };
}