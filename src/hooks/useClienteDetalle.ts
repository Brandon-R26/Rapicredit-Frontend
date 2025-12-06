"use client";

import { useEffect, useState } from "react";

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

// Mock por ahora; luego se cambia a apiFetch(`/clientes/${id}`)
export function useClienteDetalle(id: string) {
  const [data, setData] = useState<ClienteDetalle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const timeout = setTimeout(() => {
      const hoy = new Date();
      const fecha = (offsetDias: number) => {
        const d = new Date(hoy);
        d.setDate(d.getDate() + offsetDias);
        return d.toISOString();
      };

      const mock: ClienteDetalle = {
        id,
        codigoCliente: "CL-001",
        identidadCliente: "0801199912345",
        RTN: "",
        nombres: "Juan",
        apellidos: "Pérez",
        telefono: "9999-9999",
        direccion: "Col. Centro, Tegucigalpa",
        correo: "juan.perez@example.com",
        estado: "ACTIVO",
        fechaRegistro: fecha(-120),

        totalPrestamos: 3,
        prestamosActivos: 2,
        prestamosEnMora: 1,
        saldoTotal: 18500,

        prestamos: [
          {
            id: "F0001",
            codigoFinanciamiento: "F0001",
            producto: "Crédito personal",
            estadoFinanciamiento: "VIGENTE",
            capitalInicial: 10000,
            saldoCapital: 8500,
            fechaDesembolso: fecha(-30),
            fechaVencimiento: fecha(335),
          },
          {
            id: "F0002",
            codigoFinanciamiento: "F0002",
            producto: "Crédito rápido",
            estadoFinanciamiento: "EN_MORA",
            capitalInicial: 8000,
            saldoCapital: 7000,
            fechaDesembolso: fecha(-60),
            fechaVencimiento: fecha(305),
          },
          {
            id: "F0003",
            codigoFinanciamiento: "F0003",
            producto: "Crédito línea",
            estadoFinanciamiento: "PAGADO",
            capitalInicial: 5000,
            saldoCapital: 0,
            fechaDesembolso: fecha(-365),
            fechaVencimiento: fecha(-10),
          },
        ],
        abonosRecientes: [
          {
            id: "AB001",
            fecha: fecha(-5),
            monto: 500,
            codigoFinanciamiento: "F0001",
            metodoPago: "Efectivo",
          },
          {
            id: "AB002",
            fecha: fecha(-2),
            monto: 700,
            codigoFinanciamiento: "F0002",
            metodoPago: "Transferencia",
          },
          {
            id: "AB003",
            fecha: fecha(-1),
            monto: 300,
            codigoFinanciamiento: "F0001",
            metodoPago: "Efectivo",
          },
        ],
      };

      setData(mock);
      setLoading(false);
    }, 400);

    return () => clearTimeout(timeout);
  }, [id]);

  return { data, loading };
}
