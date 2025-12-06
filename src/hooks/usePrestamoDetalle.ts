"use client";

import { useEffect, useState } from "react";

export interface PlanCuota {
  numeroCuota: number;
  fechaPago: string;
  montoCuota: number;
  capital: number;
  interes: number;
  saldoRestante: number;
  estado: "PENDIENTE" | "PAGADA" | "VENCIDA";
}

export interface AbonoHistorial {
  id: string;
  fecha: string;
  monto: number;
  numeroCuota?: number;
  metodoPago?: string;
  observaciones?: string;
}

export interface PrestamoDetalle {
  id: string;
  codigoFinanciamiento: string;
  estadoFinanciamiento: string;
  capitalInicial: number;
  saldoCapital: number;
  tasaInteresAnual: number;
  frecuenciaPago: string;
  cuota: number;
  fechaDesembolso: string;
  fechaVencimiento: string;
  totalInteresesPlan: number;
  totalMoraPlan: number;
  totalPagado: number;
  observaciones?: string;
  cliente: {
    id: string;
    codigoCliente?: string;
    identidadCliente?: string;
    nombres?: string;
    apellidos?: string;
    telefono?: string;
    direccion?: string;
    correo?: string;
  };
  cobrador?: {
    id: string;
    nombreCompleto: string;
    telefono?: string;
    zona?: string;
  };
  planCuotas: PlanCuota[];
  historialAbonos: AbonoHistorial[];
}

// Mock por ahora, luego se cambia a llamada real al backend
export function usePrestamoDetalle(id: string) {
  const [data, setData] = useState<PrestamoDetalle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const timeout = setTimeout(() => {
      const hoy = new Date();
      const fecha = (offsetMeses: number) => {
        const d = new Date(hoy);
        d.setMonth(d.getMonth() + offsetMeses);
        return d.toISOString();
      };

      const mock: PrestamoDetalle = {
        id,
        codigoFinanciamiento: "F0001",
        estadoFinanciamiento: "VIGENTE",
        capitalInicial: 10000,
        saldoCapital: 8500,
        tasaInteresAnual: 24,
        frecuenciaPago: "MENSUAL",
        cuota: 500,
        fechaDesembolso: fecha(-1),
        fechaVencimiento: fecha(11),
        totalInteresesPlan: 600,
        totalMoraPlan: 0,
        totalPagado: 1500,
        observaciones: "Prueba inicial de financiamiento.",
        cliente: {
          id: "CL001",
          codigoCliente: "CL-001",
          identidadCliente: "0801199912345",
          nombres: "Juan",
          apellidos: "Pérez",
          telefono: "9999-9999",
          direccion: "Col. Centro, Tegucigalpa",
          correo: "juan.perez@example.com",
        },
        cobrador: {
          id: "COB001",
          nombreCompleto: "María López",
          telefono: "8888-8888",
          zona: "Zona Centro",
        },
        planCuotas: Array.from({ length: 12 }).map((_, i) => {
          const pagada = i < 3;
          const vencida = !pagada && i === 3;
          const estado = pagada ? "PAGADA" : vencida ? "VENCIDA" : "PENDIENTE";

          return {
            numeroCuota: i + 1,
            fechaPago: fecha(i),
            montoCuota: 500,
            capital: 400,
            interes: 100,
            saldoRestante: 10000 - 400 * (i + 1),
            estado,
          };
        }),
        historialAbonos: [
          {
            id: "AB001",
            fecha: fecha(-1),
            monto: 500,
            numeroCuota: 1,
            metodoPago: "Efectivo",
            observaciones: "Pago puntual",
          },
          {
            id: "AB002",
            fecha: fecha(0),
            monto: 500,
            numeroCuota: 2,
            metodoPago: "Transferencia",
          },
          {
            id: "AB003",
            fecha: fecha(0),
            monto: 500,
            numeroCuota: 3,
            metodoPago: "Efectivo",
          },
        ],
      };

      setData(mock);
      setLoading(false);
    }, 400);

    return () => clearTimeout(timeout);
  }, [id]);

  // devolvemos setData para poder actualizar el detalle localmente (cuando se registre un abono)
  return { data, loading, setData };
}
