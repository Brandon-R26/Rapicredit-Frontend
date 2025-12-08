"use client";

import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useRouter } from "next/navigation";

const NuevoEmpleadoPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    codigo: "",
    usuario: "",
    nombreCompleto: "",
    rol: "",
    email: "",
    telefono: "",
    password: "",
    estado: "ACTIVO",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 🔹 Llamada al backend para crear empleado
      // await apiFetch("/empleados", {
      //   method: "POST",
      //   body: JSON.stringify(formData),
      // });

      // Simulación
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Crear empleado:", formData);

      router.push("/empleados");
    } catch (err: any) {
      console.error("Error creando empleado:", err);
      setError(err.message || "Error al crear empleado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Paper
        sx={{
          p: 3,
          borderRadius: 2,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Nuevo Empleado
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Complete la información para registrar un nuevo empleado
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                variant="outlined"
                label="Código"
                name="codigo"
                value={formData.codigo}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                required
                variant="outlined"
                label="Usuario"
                name="usuario"
                value={formData.usuario}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                required
                variant="outlined"
                label="Nombre Completo"
                name="nombreCompleto"
                value={formData.nombreCompleto}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                required
                variant="outlined"
                label="Rol"
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="email"
                variant="outlined"
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                variant="outlined"
                label="Teléfono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                required
                type="password"
                variant="outlined"
                label="Contraseña"
                name="password"
                value={formData.password}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                select
                variant="outlined"
                label="Estado"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              >
                <MenuItem value="ACTIVO">Activo</MenuItem>
                <MenuItem value="INACTIVO">Inactivo</MenuItem>
              </TextField>
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ minWidth: 120 }}
            >
              {loading ? <CircularProgress size={24} /> : "Guardar"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default NuevoEmpleadoPage;
