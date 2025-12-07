'use client';

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Snackbar,
  Alert,
  Autocomplete,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../../../lib/api';
import { useClientes, Cliente } from '../../../hooks/useClientes';
import { useCobradores, Cobrador } from '../../../hooks/useCobradores';

type EstadoInicial = 'REGISTRADA';

// Campos esenciales del esquema

const NuevoSolicitudPage: React.FC = () => {
  const router = useRouter();

  const hoy = new Date().toISOString().slice(0, 10);

  const [form, setForm] = useState({
    capitalSolicitado: '',
    plazoCuotas: '',
    finalidadCredito: '',
    fechaSolicitud: hoy,
    observaciones: '',
    tasInteresId: '',
    frecuenciaPagoId: '',
    datosNegocio: '', // JSON opcional
    datosConyuge: '', // JSON opcional
    referenciasPersonales: '', // JSON array opcional
    garantias: '', // JSON array opcional
    tablaAmortizacion: '', // JSON array opcional
    cuotaEstimadaComision: '', // JSON opcional
  });

  // Cargar opciones de clientes y cobradores
  const { data: clientes, loading: loadingClientes } = useClientes({
    busqueda: '',
    tipoDoc: 'TODOS',
    estado: 'ACTIVO',
  });
  const { data: cobradores, loading: loadingCobradores } = useCobradores({ busqueda: '', estado: 'ACTIVO', zona: '' });

  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [selectedCobrador, setSelectedCobrador] = useState<Cobrador | null>(null);

  // Etiquetas de opción
  const getClienteLabel = (c: Cliente | null) => {
    if (!c) return '';
    const nombre = [c.nombres, c.apellidos].filter(Boolean).join(' ');
    return [c.codigoCliente, nombre, c.identidadCliente].filter(Boolean).join(' • ');
  };
  const getCobradorLabel = (v: Cobrador | null) => {
    if (!v) return '';
    return [v.nombreCompleto, v.correo].filter(Boolean).join(' • ');
  };

  const [saving, setSaving] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<'success' | 'error'>('success');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!selectedCliente?._id) {
      setSnackbarSeverity('error');
      setSnackbarMsg('Debes seleccionar un cliente.');
      setSnackbarOpen(true);
      return false;
    }

    if (!selectedCobrador?._id) {
      setSnackbarSeverity('error');
      setSnackbarMsg('Debes seleccionar un cobrador.');
      setSnackbarOpen(true);
      return false;
    }

    if (!form.capitalSolicitado.trim() || Number(form.capitalSolicitado) <= 0) {
      setSnackbarSeverity('error');
      setSnackbarMsg('El capital solicitado debe ser mayor a cero.');
      setSnackbarOpen(true);
      return false;
    }

    // Validar JSONs si fueron ingresados
    const jsonFields = [
      'datosNegocio',
      'datosConyuge',
      'referenciasPersonales',
      'garantias',
      'tablaAmortizacion',
      'cuotaEstimadaComision',
    ] as const;
    for (const key of jsonFields) {
      const val = (form as any)[key] as string;
      if (val && val.trim()) {
        try {
          JSON.parse(val);
        } catch {
          setSnackbarSeverity('error');
          setSnackbarMsg(`El campo ${key} debe ser JSON válido.`);
          setSnackbarOpen(true);
          return false;
        }
      }
    }

    return true;
    
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);

    try {
      const payload = {
        // Enviar IDs directos según el esquema
        clienteId: selectedCliente?._id,
        cobradorId: selectedCobrador?._id,
        capitalSolicitado: Number(form.capitalSolicitado),
        plazoCuotas: form.plazoCuotas ? Number(form.plazoCuotas) : null,
        finalidadCredito: form.finalidadCredito || null,
        fechaSolicitud: form.fechaSolicitud,
        observaciones: form.observaciones || '',
        tasInteresId: form.tasInteresId || null,
        frecuenciaPagoId: form.frecuenciaPagoId || null,
        datosNegocio: form.datosNegocio ? JSON.parse(form.datosNegocio) : undefined,
        datosConyuge: form.datosConyuge ? JSON.parse(form.datosConyuge) : undefined,
        referenciasPersonales: form.referenciasPersonales ? JSON.parse(form.referenciasPersonales) : undefined,
        garantias: form.garantias ? JSON.parse(form.garantias) : undefined,
        tablaAmortizacion: form.tablaAmortizacion ? JSON.parse(form.tablaAmortizacion) : undefined,
        cuotaEstimadaComision: form.cuotaEstimadaComision ? JSON.parse(form.cuotaEstimadaComision) : undefined,
        estadoSolicitud: 'REGISTRADA' as EstadoInicial,
      };

      // POST real al backend
      await apiFetch('/solicitudes', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      setSnackbarSeverity('success');
      setSnackbarMsg('Solicitud registrada correctamente.');
      setSnackbarOpen(true);
      router.push('/solicitudes');
    } catch (err: unknown) {
      console.error(err);
      setSnackbarSeverity('error');
      setSnackbarMsg('Error al registrar la solicitud.');
      setSnackbarOpen(true);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push('/solicitudes');
  };

  const handleCloseSnackbar = (
    _: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  return (
    <>
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
            <Typography variant="h6">Nueva solicitud</Typography>
            <Typography variant="caption" color="text.secondary">
              Registra la solicitud de crédito antes de generar un préstamo.
            </Typography>
          </Box>
        </Box>

        {/* Formulario */}
        <Paper sx={{ p: 2 }}>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <Grid container spacing={2}>
              {/* Cliente y cobrador */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Autocomplete
                  size="small"
                  options={clientes}
                  loading={loadingClientes}
                  value={selectedCliente}
                  onChange={(_, val) => setSelectedCliente(val as Cliente | null)}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : getClienteLabel(option as Cliente))}
                  isOptionEqualToValue={(opt, val) => (opt as Cliente)._id === (val as Cliente)._id}
                  renderInput={(params) => (
                    <TextField {...params} label="Cliente" placeholder="Buscar cliente…" required />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Autocomplete
                  size="small"
                  options={cobradores}
                  loading={loadingCobradores}
                  value={selectedCobrador as unknown}
                  onChange={(_, val) => setSelectedCobrador(val as Cobrador | null)}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : getCobradorLabel(option as Cobrador))}
                  isOptionEqualToValue={(opt, val) => (opt as Cobrador)._id === (val as Cobrador)._id}
                  renderInput={(params) => (
                    <TextField {...params} label="Cobrador" placeholder="Buscar cobrador…" required />
                  )}
                />
              </Grid>

              {/* Capital y plazo */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  label="Capital solicitado"
                  name="capitalSolicitado"
                  value={form.capitalSolicitado}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  inputProps={{ inputMode: 'decimal' }}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  label="Plazo en cuotas"
                  name="plazoCuotas"
                  value={form.plazoCuotas}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  inputProps={{ inputMode: 'numeric' }}
                  placeholder="Opcional"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  label="Finalidad del crédito"
                  name="finalidadCredito"
                  value={form.finalidadCredito}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  placeholder="Crédito personal, capital de trabajo…"
                />
              </Grid>

              {/* Fecha y comentario */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  label="Fecha de solicitud"
                  type="date"
                  name="fechaSolicitud"
                  value={form.fechaSolicitud}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Observaciones (opcional)"
                  name="observaciones"
                  value={form.observaciones}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  multiline
                  minRows={2}
                  placeholder="Notas internas sobre la solicitud…"
                />
              </Grid>
            </Grid>

            {/* Parámetros financieros */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle2">Parámetros financieros</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Tasa de interés (ID)"
                      name="tasInteresId"
                      value={form.tasInteresId}
                      onChange={handleChange}
                      fullWidth
                      size="small"
                      placeholder="ObjectId o identificador de tasa"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Frecuencia de pago (ID)"
                      name="frecuenciaPagoId"
                      value={form.frecuenciaPagoId}
                      onChange={handleChange}
                      fullWidth
                      size="small"
                      placeholder="ObjectId o identificador de frecuencia"
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            {/* Datos adicionales */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle2">Datos adicionales (JSON)</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      label="Datos del negocio (objeto JSON)"
                      name="datosNegocio"
                      value={form.datosNegocio}
                      onChange={handleChange}
                      fullWidth
                      size="small"
                      multiline
                      minRows={3}
                      placeholder={'{ "ingresos": 0, "direccion": "..." }'}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      label="Datos del cónyuge (objeto JSON)"
                      name="datosConyuge"
                      value={form.datosConyuge}
                      onChange={handleChange}
                      fullWidth
                      size="small"
                      multiline
                      minRows={3}
                      placeholder={'{ "nombre": "...", "identidad": "..." }'}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      label="Referencias personales (array JSON)"
                      name="referenciasPersonales"
                      value={form.referenciasPersonales}
                      onChange={handleChange}
                      fullWidth
                      size="small"
                      multiline
                      minRows={3}
                      placeholder={'[{ "nombre": "...", "telefono": "..." }]'}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      label="Garantías (array JSON)"
                      name="garantias"
                      value={form.garantias}
                      onChange={handleChange}
                      fullWidth
                      size="small"
                      multiline
                      minRows={3}
                      placeholder={'[{ "tipo": "prendaria", "valor": 0 }]'}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      label="Tabla de amortización (array JSON)"
                      name="tablaAmortizacion"
                      value={form.tablaAmortizacion}
                      onChange={handleChange}
                      fullWidth
                      size="small"
                      multiline
                      minRows={3}
                      placeholder={'[{ "cuota": 1, "capital": 0, "interes": 0 }]'}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      label="Cuota estimada y comisión (objeto JSON)"
                      name="cuotaEstimadaComision"
                      value={form.cuotaEstimadaComision}
                      onChange={handleChange}
                      fullWidth
                      size="small"
                      multiline
                      minRows={3}
                      placeholder={'{ "cuota": 0, "comision": 0 }'}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            {/* Botones */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 1.5,
                mt: 1,
              }}
            >
              <Button onClick={handleCancel} disabled={saving}>
                Cancelar
              </Button>
              <Button type="submit" variant="contained" disabled={saving}>
                {saving ? 'Guardando…' : 'Guardar solicitud'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2500}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </>
  );
};

export default NuevoSolicitudPage;
