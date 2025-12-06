"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Chip,
  Button,
  Divider,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import { usePrestamoDetalle } from "../../../hooks/usePrestamoDetalle";

const PrestamoDetallePage: React.FC = () => {
  const params = useParams();
  const id = params?.id as string;
  const { data, loading, setData } = usePrestamoDetalle(id);

  // Estado para el modal de registrar abono
  const [openAbono, setOpenAbono] = useState(false);
  const [savingAbono, setSavingAbono] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const today = new Date().toISOString().slice(0, 10);

  const [abonoForm, setAbonoForm] = useState({
    fecha: today,
    monto: "",
    numeroCuota: "",
    metodoPago: "EFECTIVO",
    observaciones: "",
  });

  const handleOpenAbono = () => setOpenAbono(true);
  const handleCloseAbono = () => {
    if (savingAbono) return;
    setOpenAbono(false);
  };

  const handleChangeAbono = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setAbonoForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitAbono = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;

    const montoNum = Number(abonoForm.monto);
    if (isNaN(montoNum) || montoNum <= 0) {
      setSnackbarSeverity("error");
      setSnackbarMsg("El monto debe ser un número mayor a cero.");
      setSnackbarOpen(true);
      return;
    }

    setSavingAbono(true);

    // DEMO: simulamos que se guarda el abono y actualizamos el estado local
    setTimeout(() => {
      setData((prev) => {
        if (!prev) return prev;

        const nuevoAbonoId = `AB-${Date.now()}`;

        const nuevoAbono = {
          id: nuevoAbonoId,
          fecha: new Date(abonoForm.fecha).toISOString(),
          monto: montoNum,
          numeroCuota: abonoForm.numeroCuota
            ? Number(abonoForm.numeroCuota)
            : undefined,
          metodoPago: abonoForm.metodoPago || undefined,
          observaciones: abonoForm.observaciones || undefined,
        };

        return {
          ...prev,
          historialAbonos: [nuevoAbono, ...prev.historialAbonos],
          totalPagado: prev.totalPagado + montoNum,
          // si quisieras, podrías ajustar saldoCapital aquí
          // saldoCapital: Math.max(0, prev.saldoCapital - montoNum),
        };
      });

      setSnackbarSeverity("success");
      setSnackbarMsg("Abono registrado (demo, sin backend aún).");
      setSnackbarOpen(true);

      setSavingAbono(false);
      setOpenAbono(false);
      setAbonoForm({
        fecha: today,
        monto: "",
        numeroCuota: "",
        metodoPago: "EFECTIVO",
        observaciones: "",
      });
    }, 600);
  };

  const handleCloseSnackbar = (
    _: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  if (loading || !data) {
    return (
      <Box
        sx={{
          display: "flex",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress size={28} />
      </Box>
    );
  }

  const {
    codigoFinanciamiento,
    estadoFinanciamiento,
    capitalInicial,
    saldoCapital,
    tasaInteresAnual,
    frecuenciaPago,
    cuota,
    fechaDesembolso,
    fechaVencimiento,
    totalInteresesPlan,
    totalMoraPlan,
    totalPagado,
    observaciones,
    cliente,
    cobrador,
    planCuotas,
    historialAbonos,
  } = data;

  const formatDate = (iso?: string) =>
    iso ? new Date(iso).toLocaleDateString("es-HN") : "-";

  const formatMoney = (v?: number) =>
    v != null
      ? `L. ${v.toLocaleString("es-HN", { minimumFractionDigits: 2 })}`
      : "L. 0.00";

  const renderEstadoChip = () => {
    const val = (estadoFinanciamiento || "").toUpperCase();
    let color: "default" | "error" | "success" | "info" = "default";

    if (val === "EN_MORA") color = "error";
    else if (val === "PAGADO") color = "success";
    else if (val === "VIGENTE") color = "info";

    return (
      <Chip size="small" label={val || "—"} color={color} variant="outlined" />
    );
  };

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 1,
          }}
        >
          <Box>
            <Typography variant="h6">
              Préstamo {codigoFinanciamiento || ""}
            </Typography>
            <Box
              sx={{ display: "flex", gap: 1, alignItems: "center", mt: 0.5 }}
            >
              {renderEstadoChip()}
              <Typography variant="caption" color="text.secondary">
                Desembolso: {formatDate(fechaDesembolso)} · Vence:{" "}
                {formatDate(fechaVencimiento)}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Button size="small" variant="contained" onClick={handleOpenAbono}>
              Registrar abono
            </Button>
            <Button size="small" variant="outlined">
              Ver plan de pagos
            </Button>
            <Button size="small" color="error" variant="outlined">
              Marcar como pagado
            </Button>
          </Box>
        </Box>

        <Grid container spacing={2}>
          {/* Resumen del préstamo */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Resumen del préstamo
              </Typography>
              <Grid container spacing={1}>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    Capital inicial
                  </Typography>
                  <Typography>{formatMoney(capitalInicial)}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    Saldo actual
                  </Typography>
                  <Typography>{formatMoney(saldoCapital)}</Typography>
                </Grid>

                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    Tasa de interés anual
                  </Typography>
                  <Typography>{tasaInteresAnual}%</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    Frecuencia de pago
                  </Typography>
                  <Typography>{frecuenciaPago}</Typography>
                </Grid>

                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    Cuota
                  </Typography>
                  <Typography>{formatMoney(cuota)}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    Intereses planificados
                  </Typography>
                  <Typography>{formatMoney(totalInteresesPlan)}</Typography>
                </Grid>

                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    Total mora planificada
                  </Typography>
                  <Typography>{formatMoney(totalMoraPlan)}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    Total pagado
                  </Typography>
                  <Typography>{formatMoney(totalPagado)}</Typography>
                </Grid>
              </Grid>

              {observaciones && (
                <>
                  <Divider sx={{ my: 1.5 }} />
                  <Typography variant="caption" color="text.secondary">
                    Observaciones
                  </Typography>
                  <Typography variant="body2">{observaciones}</Typography>
                </>
              )}
            </Paper>
          </Grid>

          {/* Cliente y cobrador */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Cliente
              </Typography>
              <Typography variant="body2">
                {[cliente.nombres, cliente.apellidos]
                  .filter(Boolean)
                  .join(" ") || "Cliente"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Código: {cliente.codigoCliente || "—"}
              </Typography>
              <br />
              <Typography variant="caption" color="text.secondary">
                Identidad: {cliente.identidadCliente || "—"}
              </Typography>
              <br />
              <Typography variant="caption" color="text.secondary">
                Teléfono: {cliente.telefono || "—"}
              </Typography>
              <br />
              <Typography variant="caption" color="text.secondary">
                Dirección: {cliente.direccion || "—"}
              </Typography>
            </Paper>

            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Cobrador asignado
              </Typography>
              <Typography variant="body2">
                {cobrador?.nombreCompleto || "Sin asignar"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Teléfono: {cobrador?.telefono || "—"}
              </Typography>
              <br />
              <Typography variant="caption" color="text.secondary">
                Zona: {cobrador?.zona || "—"}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Plan de pagos y historial de abonos */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Plan de pagos
              </Typography>
              <TableContainer sx={{ maxHeight: 320 }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Fecha</TableCell>
                      <TableCell>Cuota</TableCell>
                      <TableCell>Capital</TableCell>
                      <TableCell>Interés</TableCell>
                      <TableCell>Saldo</TableCell>
                      <TableCell>Estado</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {planCuotas.map((c) => (
                      <TableRow key={c.numeroCuota}>
                        <TableCell>{c.numeroCuota}</TableCell>
                        <TableCell>{formatDate(c.fechaPago)}</TableCell>
                        <TableCell>{formatMoney(c.montoCuota)}</TableCell>
                        <TableCell>{formatMoney(c.capital)}</TableCell>
                        <TableCell>{formatMoney(c.interes)}</TableCell>
                        <TableCell>{formatMoney(c.saldoRestante)}</TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={c.estado}
                            color={
                              c.estado === "PAGADA"
                                ? "success"
                                : c.estado === "VENCIDA"
                                ? "error"
                                : "default"
                            }
                            variant="outlined"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                    {planCuotas.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          No hay plan de pagos configurado.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Paper sx={{ p: 2, height: "100%" }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Historial de abonos
              </Typography>
              <TableContainer sx={{ maxHeight: 320 }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Fecha</TableCell>
                      <TableCell>Monto</TableCell>
                      <TableCell>Cuota</TableCell>
                      <TableCell>Método</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {historialAbonos.map((a) => (
                      <TableRow key={a.id}>
                        <TableCell>{formatDate(a.fecha)}</TableCell>
                        <TableCell>{formatMoney(a.monto)}</TableCell>
                        <TableCell>{a.numeroCuota ?? "—"}</TableCell>
                        <TableCell>{a.metodoPago || "—"}</TableCell>
                      </TableRow>
                    ))}
                    {historialAbonos.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          No hay abonos registrados.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Modal Registrar Abono */}
      <Dialog
        open={openAbono}
        onClose={handleCloseAbono}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Registrar abono</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            onSubmit={handleSubmitAbono}
            sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Fecha del abono"
              type="date"
              name="fecha"
              value={abonoForm.fecha}
              onChange={handleChangeAbono}
              InputLabelProps={{ shrink: true }}
              fullWidth
              size="small"
            />
            <TextField
              label="Monto"
              name="monto"
              value={abonoForm.monto}
              onChange={handleChangeAbono}
              fullWidth
              size="small"
              inputProps={{ inputMode: "decimal" }}
            />
            <TextField
              label="Número de cuota (opcional)"
              name="numeroCuota"
              value={abonoForm.numeroCuota}
              onChange={handleChangeAbono}
              fullWidth
              size="small"
            />
            <TextField
              select
              label="Método de pago"
              name="metodoPago"
              value={abonoForm.metodoPago}
              onChange={handleChangeAbono}
              fullWidth
              size="small"
            >
              <MenuItem value="EFECTIVO">Efectivo</MenuItem>
              <MenuItem value="TRANSFERENCIA">Transferencia</MenuItem>
              <MenuItem value="DEPOSITO">Depósito</MenuItem>
              <MenuItem value="OTRO">Otro</MenuItem>
            </TextField>
            <TextField
              label="Observaciones (opcional)"
              name="observaciones"
              value={abonoForm.observaciones}
              onChange={handleChangeAbono}
              fullWidth
              size="small"
              multiline
              minRows={2}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseAbono} disabled={savingAbono}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmitAbono}
            variant="contained"
            disabled={savingAbono}
          >
            {savingAbono ? "Guardando…" : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2500}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </>
  );
};

export default PrestamoDetallePage;
