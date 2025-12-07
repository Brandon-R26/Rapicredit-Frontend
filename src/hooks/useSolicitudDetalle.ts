'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';

export interface SolicitudDetalle {
  id: string;
  codigoSolicitud: string;
  fechaSolicitud?: string;
  montoSolicitado: number;
  plazoMeses?: number;
  producto?: string;
  origen?: string;
  estadoSolicitud: string;
  comentario?: string;

  cliente: {
    id: string;
    nombreCompleto: string;
    identidadCliente?: string;
    codigoCliente?: string;
  } | null;

  // Por si más adelante guardas historial de cambios / evaluaciones
  historial?: {
    id: string;
    fecha: string;
    accion: string;
    usuario?: string;
    comentario?: string;
  }[];
}

// Tipo de respuesta esperado desde la API para una solicitud
interface SolicitudApiResponse {
  _id?: string | number;
  id?: string | number;
  codigoSolicitud?: string;
  fechaSolicitud?: string;
  montoSolicitado?: number;
  plazoMeses?: number;
  plazo?: number;
  producto?: string;
  tipoProducto?: string;
  origen?: string;
  canal?: string;
  estadoSolicitud?: string;
  comentario?: string;
  observaciones?: string;
  clienteId?: unknown;
  cliente?: unknown;
  historial?: Array<{
    _id?: string | number;
    id?: string | number;
    fecha?: string;
    accion?: string;
    evento?: string;
    usuario?: string;
    usuarioRegistro?: string;
    comentario?: string;
    observaciones?: string;
  }>;
}

export function useSolicitudDetalle(id: string) {
  const [data, setData] = useState<SolicitudDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    // Evita llamar a la API si el id no es válido
    if (!id) {
      setLoading(false);
      setError('Id de solicitud inválido');
      setData(null);
      return () => {
        cancelled = true;
      };
    }

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const res = await apiFetch<SolicitudApiResponse>(`/solicitudes/${id}`);

        if (cancelled || !res) return;

        const clienteRaw = (res.clienteId as any) || (res.cliente as any) || null;
        const cliente =
          clienteRaw &&
          (clienteRaw._id || clienteRaw.id || clienteRaw.codigoCliente)
            ? {
                id: String(clienteRaw._id ?? clienteRaw.id ?? ''),
                nombreCompleto:
                  clienteRaw.nombreCompleto ||
                  [clienteRaw.nombres, clienteRaw.apellidos]
                    .filter(Boolean)
                    .join(' ') ||
                  'Cliente',
                identidadCliente:
                  clienteRaw.identidadCliente ?? clienteRaw.identidad,
                codigoCliente: clienteRaw.codigoCliente,
              }
            : null;

        const historialApi = Array.isArray(res.historial)
          ? res.historial
          : [];

        const historial = historialApi.map((h) => ({
          id: String(h._id ?? h.id ?? ''),
          fecha: h.fecha ?? new Date().toISOString(),
          accion: h.accion ?? h.evento ?? '',
          usuario: h.usuario ?? h.usuarioRegistro ?? undefined,
          comentario: h.comentario ?? h.observaciones ?? undefined,
        }));

        const detalle: SolicitudDetalle = {
          id: String(res._id ?? res.id ?? id),
          codigoSolicitud: res.codigoSolicitud ?? '',
          fechaSolicitud: res.fechaSolicitud,
          montoSolicitado: (res as any).montoSolicitado ?? (res as any).capitalSolicitado ?? 0,
          plazoMeses: (res as any).plazoMeses ?? (res as any).plazoCuotas ?? (res as any).plazo ?? undefined,
          producto: (res as any).producto ?? (res as any).finalidadCredito ?? (res as any).tipoProducto ?? undefined,
          origen: res.origen ?? res.canal ?? undefined,
          estadoSolicitud: res.estadoSolicitud ?? 'PENDIENTE',
          comentario: (res as any).comentario ?? (res as any).observaciones ?? undefined,
          cliente,
          historial,
        };

        if (!cancelled) {
          setData(detalle);
        }
      } catch (err: unknown) {
        console.error('Error cargando detalle de solicitud:', err);
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Error al cargar la solicitud';
          setError(message);
          setData(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { data, loading, error };
}
