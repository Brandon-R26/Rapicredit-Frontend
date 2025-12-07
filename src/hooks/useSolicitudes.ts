'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';

export type EstadoSolicitudFiltro =
  | 'TODAS'
  | 'REGISTRADA'
  | 'EN_REVISION'
  | 'APROBADA'
  | 'RECHAZADA';

export interface SolicitudResumen {
  id: string;
  codigoSolicitud: string;
  fechaSolicitud?: string;
  clienteNombre: string;
  clienteIdentidad?: string;
  capitalSolicitado: number;
  estadoSolicitud: string;
}

export interface SolicitudesFilters {
  busqueda: string;
  estado: EstadoSolicitudFiltro;
}

interface SolicitudApiListItem {
  _id?: string | number;
  id?: string | number;
  codigoSolicitud?: string;
  fechaSolicitud?: string;
  clienteId?: any;
  cliente?: any;
  capitalSolicitado?: number;
  estadoSolicitud?: string;
}

export function useSolicitudes(filters: SolicitudesFilters) {
  const [data, setData] = useState<SolicitudResumen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await apiFetch<SolicitudApiListItem[]>('/solicitudes');
        if (cancelled) return;

        const mapped: SolicitudResumen[] = (res || []).map((s) => {
          const cliente = (s.clienteId as any) || (s.cliente as any) || {};
          const nombreCliente =
            cliente.nombreCompleto ||
            [cliente.nombres, cliente.apellidos].filter(Boolean).join(' ') ||
            'Cliente';

          return {
            id: String(s._id ?? s.id ?? ''),
            codigoSolicitud: s.codigoSolicitud ?? '',
            fechaSolicitud: s.fechaSolicitud,
            clienteNombre: nombreCliente,
            clienteIdentidad:
              cliente.identidadCliente ?? cliente.identidad ?? undefined,
            capitalSolicitado: s.capitalSolicitado ?? 0,
            estadoSolicitud: s.estadoSolicitud ?? 'REGISTRADA',
          };
        });

        setData(mapped);
      } catch (err: unknown) {
        console.error('Error cargando solicitudes:', err);
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Error al cargar solicitudes';
          setError(message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  // Filtros en memoria
  let filtradas = [...data];

  if (filters.estado !== 'TODAS') {
    filtradas = filtradas.filter(
      (s) => s.estadoSolicitud.toUpperCase() === filters.estado,
    );
  }

  if (filters.busqueda.trim()) {
    const q = filters.busqueda.trim().toLowerCase();
    filtradas = filtradas.filter((s) => {
      return (
        s.codigoSolicitud.toLowerCase().includes(q) ||
        s.clienteNombre.toLowerCase().includes(q) ||
        (s.clienteIdentidad || '').toLowerCase().includes(q)
      );
    });
  }

  // Ordenar por fecha desc si viene
  filtradas.sort((a, b) => {
    const da = a.fechaSolicitud ? new Date(a.fechaSolicitud).getTime() : 0;
    const db = b.fechaSolicitud ? new Date(b.fechaSolicitud).getTime() : 0;
    return db - da;
  });

  return { data: filtradas, loading, error };
}
