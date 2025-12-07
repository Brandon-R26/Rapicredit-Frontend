"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";

export interface PrestamoClienteResumen {
  id: string;
  codigoFinanciamiento: string;
  producto?: string;
  estadoFinanciamiento: string;
  capitalInicial: number;
  saldoCapital: number;
  fechaDesembolso?: string;
  fechaVencimiento?: string;
}

export interface AbonoClienteResumen {
  id: string;
  fecha: string;
  monto: number;
  codigoFinanciamiento: string;
  metodoPago?: string;
}

export interface ClienteDetalle {
  id: string;
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

  // info financiera consolidada
  totalPrestamos: number;
  prestamosActivos: number;
  prestamosEnMora: number;
  saldoTotal: number;

  prestamos: PrestamoClienteResumen[];
  abonosRecientes: AbonoClienteResumen[];
}

/**
 * Este hook ahora:
 * - Llama al backend: GET /clientes/:id
 * - Intenta mapear la respuesta a la forma que el frontend ya usa
 * - Si el backend todavía no devuelve prestamos/abonos, simplemente caerán como [] y 0
 */
export function useClienteDetalle(id: string) {
  const [data, setData] = useState<ClienteDetalle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        // 👇 Ajusta si tu endpoint real es distinto (por ejemplo /clientes/:id/detalle)
        const res: any = await apiFetch<any>(`/clientes/${id}`);

        if (cancelled || !res) return;

        const prestamosApi = Array.isArray(res.prestamos) ? res.prestamos : [];
        const abonosApi = Array.isArray(res.abonosRecientes)
          ? res.abonosRecientes
          : [];

        const totalPrestamos = prestamosApi.length;
        const prestamosActivos = prestamosApi.filter(
          (p: any) => (p.estadoFinanciamiento || "").toUpperCase() === "VIGENTE"
        ).length;
        const prestamosEnMora = prestamosApi.filter(
          (p: any) => (p.estadoFinanciamiento || "").toUpperCase() === "EN_MORA"
        ).length;
        const saldoTotal = prestamosApi.reduce(
          (acc: number, p: any) => acc + (p.saldoCapital || 0),
          0
        );

        const prestamos: PrestamoClienteResumen[] = prestamosApi.map(
          (p: any) => ({
            id: String(p._id ?? p.id ?? ""),
            codigoFinanciamiento: p.codigoFinanciamiento ?? "",
            producto: p.producto ?? p.tipoProducto ?? undefined,
            estadoFinanciamiento: p.estadoFinanciamiento ?? "",
            capitalInicial: p.capitalInicial ?? 0,
            saldoCapital: p.saldoCapital ?? 0,
            fechaDesembolso: p.fechaDesembolso,
            fechaVencimiento: p.fechaVencimiento,
          })
        );

        const abonosRecientes: AbonoClienteResumen[] = abonosApi.map(
          (a: any) => ({
            id: String(a._id ?? a.id ?? ""),
            fecha: a.fechaAbono ?? a.fecha ?? new Date().toISOString(),
            monto: a.montoAbono ?? a.monto ?? 0,
            codigoFinanciamiento:
              a.financiamientoId?.codigoFinanciamiento ??
              a.codigoFinanciamiento ??
              "",
            metodoPago: a.metodoPago ?? a.formaPago ?? undefined,
          })
        );

        const detalle: ClienteDetalle = {
          id: String(res._id ?? res.id ?? id),
          codigoCliente: res.codigoCliente,
          identidadCliente: res.identidadCliente,
          RTN: res.RTN,
          nombres: res.nombres ?? res.nombre ?? undefined,
          apellidos: res.apellidos ?? undefined,
          telefono: res.telefono,
          direccion: res.direccion,
          correo: res.correo,
          estado: res.estado,
          fechaRegistro: res.fechaRegistro,

          totalPrestamos,
          prestamosActivos,
          prestamosEnMora,
          saldoTotal,
          prestamos,
          abonosRecientes,
        };

        if (!cancelled) {
          setData(detalle);
        }
      } catch (error) {
        console.error("Error cargando detalle de cliente:", error);
        if (!cancelled) {
          setData(null);
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
  }, [id]);

  return { data, loading };
}
