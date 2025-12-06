"use client";

import { useEffect, useState } from "react";

export interface ReportesResumen {
  totalCartera: number;
  carteraVigente: number;
  carteraEnMora: number;
  carteraPagada: number;
}

export interface ReporteMoraRango {
  rango: string; // "0-7 días", "8-30 días", etc.
  cantidadPrestamos: number;
  saldo: number;
}

export interface ReportePagosDiarios {
  fecha: string; // ISO
  cantidadPagos: number;
  totalMonto: number;
}

export interface ReporteCarteraCobrador {
  cobrador: string;
  cantidadPrestamos: number;
  saldo: number;
  saldoEnMora: number;
}

export interface ReportesData {
  resumen: ReportesResumen;
  moraPorRango: ReporteMoraRango[];
  pagosDiarios: ReportePagosDiarios[];
  carteraPorCobrador: ReporteCarteraCobrador[];
}

// Por ahora es mock; luego se reemplaza por llamadas reales al backend
export function useReportes(fechaInicio?: string, fechaFin?: string) {
  const [data, setData] = useState<ReportesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Simulación de llamada async y uso de rango de fechas
    const timeout = setTimeout(() => {
      try {
        const hoy = new Date();
        const iso = (offsetDias: number) => {
          const d = new Date(hoy);
          d.setDate(d.getDate() + offsetDias);
          return d.toISOString();
        };

        const mock: ReportesData = {
          resumen: {
            totalCartera: 28000,
            carteraVigente: 18000,
            carteraEnMora: 8000,
            carteraPagada: 2000,
          },
          moraPorRango: [
            { rango: "0-7 días", cantidadPrestamos: 5, saldo: 2500 },
            { rango: "8-30 días", cantidadPrestamos: 8, saldo: 3500 },
            { rango: "31-60 días", cantidadPrestamos: 3, saldo: 1200 },
            { rango: "61+ días", cantidadPrestamos: 1, saldo: 800 },
          ],
          pagosDiarios: [
            {
              fecha: iso(-6),
              cantidadPagos: 4,
              totalMonto: 2200,
            },
            {
              fecha: iso(-5),
              cantidadPagos: 6,
              totalMonto: 3100,
            },
            {
              fecha: iso(-4),
              cantidadPagos: 3,
              totalMonto: 1500,
            },
            {
              fecha: iso(-3),
              cantidadPagos: 7,
              totalMonto: 3800,
            },
            {
              fecha: iso(-2),
              cantidadPagos: 5,
              totalMonto: 2600,
            },
            {
              fecha: iso(-1),
              cantidadPagos: 8,
              totalMonto: 4100,
            },
            {
              fecha: iso(0),
              cantidadPagos: 2,
              totalMonto: 900,
            },
          ],
          carteraPorCobrador: [
            {
              cobrador: "María López",
              cantidadPrestamos: 15,
              saldo: 12000,
              saldoEnMora: 3000,
            },
            {
              cobrador: "Carlos Díaz",
              cantidadPrestamos: 10,
              saldo: 9000,
              saldoEnMora: 2500,
            },
            {
              cobrador: "Sin asignar",
              cantidadPrestamos: 4,
              saldo: 7000,
              saldoEnMora: 500,
            },
          ],
        };

        setData(mock);
      } catch (err: any) {
        console.error("Error en reportes mock:", err);
        setError("Error al cargar reportes");
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [fechaInicio, fechaFin]);

  return { data, loading, error };
}
