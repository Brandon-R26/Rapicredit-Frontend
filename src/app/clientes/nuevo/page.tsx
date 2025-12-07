"use client";

import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../../lib/api";

type EstadoCliente = "ACTIVO" | "INACTIVO";

const NuevoClientePage: React.FC = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    identidadCliente: "",
    RTN: "",
    telefono: "",
    correo: "",
    direccion: "",
    estado: "ACTIVO" as EstadoCliente,
  });

  const [saving, setSaving] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!form.nombres.trim() || !form.apellidos.trim()) {
      setSnackbarSeverity("error");
      setSnackbarMsg("Nombre y apellido son obligatorios.");
      setSnackbarOpen(true);
      return false;
    }

    if (!form.identidadCliente.trim() && !form.RTN.trim()) {
      setSnackbarSeverity("error");
      setSnackbarMsg("Debes ingresar identidad o RTN.");
      setSnackbarOpen(true);
      return false;
    }

    if (form.correo && !form.correo.includes("@")) {
      setSnackbarSeverity("error");
      setSnackbarMsg("El correo no parece válido.");
      setSnackbarOpen(true);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);

    try {
      await apiFetch("/clientes", {
        method: "POST",
        body: JSON.stringify(form),
      });

      setSnackbarSeverity("success");
      setSnackbarMsg("Cliente registrado correctamente.");
      setSnackbarOpen(true);
      router.push("/clientes");
    } catch (err: any) {
      setSnackbarSeverity("error");
      setSnackbarMsg("Error al registrar el cliente.");
      setSnackbarOpen(true);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push("/clientes");
  };

  const handleCloseSnackbar = (
    _: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 1,
          }}
        >
          <Box>
            <Typography variant="h6">Nuevo cliente</Typography>
            <Typography variant="caption" color="text.secondary">
              Registra un nuevo cliente para poder asociarle préstamos.
            </Typography>
          </Box>
        </Box>

        <Paper sx={{ p: 2 }}>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <Grid container spacing={2}>
              {/* Nombres y apellidos */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Nombres"
                  name="nombres"
                  value={form.nombres}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Apellidos"
                  name="apellidos"
                  value={form.apellidos}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  required
                />
              </Grid>

              {/* Identidad y RTN */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Identidad"
                  name="identidadCliente"
                  value={form.identidadCliente}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  placeholder="0801-1999-XXXXX"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="RTN"
                  name="RTN"
                  value={form.RTN}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  placeholder="Si aplica"
                />
              </Grid>

              {/* Contacto */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Teléfono"
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  placeholder="9999-9999"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Correo electrónico"
                  name="correo"
                  value={form.correo}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  placeholder="correo@ejemplo.com"
                />
              </Grid>

              {/* Dirección */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Dirección"
                  name="direccion"
                  value={form.direccion}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  multiline
                  minRows={2}
                  placeholder="Colonia, ciudad, referencias…"
                />
              </Grid>

              {/* Estado */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  select
                  label="Estado"
                  name="estado"
                  value={form.estado}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                >
                  <MenuItem value="ACTIVO">Activo</MenuItem>
                  <MenuItem value="INACTIVO">Inactivo</MenuItem>
                </TextField>
              </Grid>
            </Grid>

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 1.5,
                mt: 1,
              }}
            >
              <Button onClick={handleCancel} disabled={saving}>
                Cancelar
              </Button>
              <Button type="submit" variant="contained" disabled={saving}>
                {saving ? "Guardando…" : "Guardar cliente"}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>

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

export default NuevoClientePage;
