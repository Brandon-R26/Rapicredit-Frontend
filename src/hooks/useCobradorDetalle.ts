"use client";

import { useEffect, useState } from "react";

export interface PrestamoCobradorResumen {
  id: string;
  codigoFinanciamiento: string;
  clienteNombre: string;
  zona?: string;
  estadoFinanciamiento: string;
  saldoCapital: number;
  fechaDesembolso?: string;
  fechaVencimiento?: string;
}

export interface AbonoCobradorResumen {
  id: string;
  fecha: string;
  monto: number;
  codigoFinanciamiento: string;
  clienteNombre: string;
  metodoPago?: string;
}

export interface CobradorDetalle {
  id: string;
  codigo?: string;
  nombreCompleto: string;
  telefono?: string;
  correo?: string;
  zona?: string;
  estado?: string;
  fechaRegistro?: string;

  // resumen de cartera
  cantidadPrestamos: number;
  saldoCartera: number;
  saldoEnMora: number;

  prestamos: PrestamoCobradorResumen[];
  abonosRecientes: AbonoCobradorResumen[];
}

// Por ahora mock; luego se cambia a apiFetch(`/cobradores/${id}`)
export function useCobradorDetalle(id: string) {
  const [data, setData] = useState<CobradorDetalle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const timeout = setTimeout(() => {
      const hoy = new Date();
      const iso = (offsetDias: number) => {
        const d = new Date(hoy);
        d.setDate(d.getDate() + offsetDias);
        return d.toISOString();
      };

      const mock: CobradorDetalle = {
        id,
        codigo: "COB-001",
        nombreCompleto: "María López",
        telefono: "8888-8888",
        correo: "maria.lopez@example.com",
        zona: "Zona Centro",
        estado: "ACTIVO",
        fechaRegistro: iso(-90),

        cantidadPrestamos: 20,
        saldoCartera: 21000,
        saldoEnMora: 5500,

        prestamos: [
          {
            id: "F0001",
            codigoFinanciamiento: "F0001",
            clienteNombre: "Juan Pérez",
            zona: "Zona Centro",
            estadoFinanciamiento: "VIGENTE",
            saldoCapital: 8500,
            fechaDesembolso: iso(-40),
            fechaVencimiento: iso(325),
          },
          {
            id: "F0002",
            codigoFinanciamiento: "F0002",
            clienteNombre: "Ana Gómez",
            zona: "Zona Centro",
            estadoFinanciamiento: "EN_MORA",
            saldoCapital: 7000,
            fechaDesembolso: iso(-60),
            fechaVencimiento: iso(305),
          },
          {
            id: "F0003",
            codigoFinanciamiento: "F0003",
            clienteNombre: "Carlos Ramos",
            zona: "Zona Norte",
            estadoFinanciamiento: "VIGENTE",
            saldoCapital: 5500,
            fechaDesembolso: iso(-20),
            fechaVencimiento: iso(345),
          },
        ],
        abonosRecientes: [
          {
            id: "AB001",
            fecha: iso(-2),
            monto: 700,
            codigoFinanciamiento: "F0002",
            clienteNombre: "Ana Gómez",
            metodoPago: "Efectivo",
          },
          {
            id: "AB002",
            fecha: iso(-1),
            monto: 500,
            codigoFinanciamiento: "F0001",
            clienteNombre: "Juan Pérez",
            metodoPago: "Transferencia",
          },
          {
            id: "AB003",
            fecha: iso(0),
            monto: 450,
            codigoFinanciamiento: "F0003",
            clienteNombre: "Carlos Ramos",
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
