'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Chip,
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Link from 'next/link';
import { useSolicitudDetalle } from '../../../hooks/useSolicitudDetalle';

const SolicitudDetallePage: React.FC = () => {
  const params = useParams();
  const id = params?.id as string;
  const { data, loading, error } = useSolicitudDetalle(id);

  const formatMoney = (v?: number) =>
    v != null
      ? `L. ${v.toLocaleString('es-HN', { minimumFractionDigits: 2 })}`
      : 'L. 0.00';

  const formatDate = (iso?: string) =>
    iso ? new Date(iso).toLocaleDateString('es-HN') : '-';

  const renderEstadoChip = (estado: string) => {
    const val = estado.toUpperCase();
    let color: 'default' | 'success' | 'warning' | 'error' | 'info' = 'info';

    if (val === 'REGISTRADA') color = 'info';
    else if (val === 'EN_REVISION') color = 'warning';
    else if (val === 'APROBADA') color = 'success';
    else if (val === 'RECHAZADA') color = 'error';

    return (
      <Chip size="small" label={val || '—'} color={color} variant="outlined" />
    );
  };

  if (loading && !data) {
    return (
      <Box
        sx={{
          display: 'flex',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress size={28} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body2">
          No se pudo cargar la información de la solicitud.
        </Typography>
      </Box>
    );
  }

  const {
    codigoSolicitud,
    fechaSolicitud,
    montoSolicitado,
    plazoMeses,
    producto,
    estadoSolicitud,
    comentario,
    cliente,
    historial,
  } = data;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 1,
        }}
      >
        <Box>
          <Typography variant="h6">
            Solicitud {codigoSolicitud || ''}
          </Typography>
          <Box
            sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 0.5 }}
          >
            {renderEstadoChip(estadoSolicitud)}
            <Typography variant="caption" color="text.secondary">
              Fecha: {formatDate(fechaSolicitud)}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {cliente && (
            <Button
              size="small"
              variant="outlined"
              component={Link}
              href={`/clientes/${cliente.id}`}
            >
              Ver cliente
            </Button>
          )}
          <Button size="small" variant="outlined" component={Link} href="/solicitudes">
            Volver a lista
          </Button>
        </Box>
      </Box>

      {/* Datos principales */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Datos de la solicitud
            </Typography>
            <Grid container spacing={1}>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  Capital solicitado
                </Typography>
                <Typography>{formatMoney(montoSolicitado)}</Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  Finalidad del crédito
                </Typography>
                <Typography>{producto || '—'}</Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  Plazo (cuotas)
                </Typography>
                <Typography>{plazoMeses ?? '—'}</Typography>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="caption" color="text.secondary">
                  Observaciones
                </Typography>
                <Typography>{comentario || '—'}</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Datos del cliente
            </Typography>
            {cliente ? (
              <Grid container spacing={1}>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    Nombre
                  </Typography>
                  <Typography>{cliente.nombreCompleto}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    Identidad
                  </Typography>
                  <Typography>
                    {cliente.identidadCliente || 'No registrada'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    Código cliente
                  </Typography>
                  <Typography>{cliente.codigoCliente || '—'}</Typography>
                </Grid>
              </Grid>
            ) : (
              <Typography variant="body2">
                La solicitud no tiene cliente asociado.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Historial */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Historial de cambios
        </Typography>
        <TableContainer sx={{ maxHeight: 280 }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Fecha</TableCell>
                <TableCell>Acción</TableCell>
                <TableCell>Usuario</TableCell>
                <TableCell>Comentario</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {historial && historial.length > 0 ? (
                historial.map((h) => (
                  <TableRow key={h.id}>
                    <TableCell>{formatDate(h.fecha)}</TableCell>
                    <TableCell>{h.accion}</TableCell>
                    <TableCell>{h.usuario || '—'}</TableCell>
                    <TableCell>{h.comentario || '—'}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No hay historial registrado para esta solicitud.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default SolicitudDetallePage;
