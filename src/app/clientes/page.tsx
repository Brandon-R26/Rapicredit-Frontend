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
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  CircularProgress,
} from "@mui/material";
import Link from "next/link";
import {
  useClientes,
  TipoDocFiltro,
  EstadoClienteFiltro,
} from "../../hooks/useClientes";

const ClientesPage: React.FC = () => {
  const [busqueda, setBusqueda] = useState("");
  const [tipoDoc, setTipoDoc] = useState<TipoDocFiltro>("TODOS");
  const [estado, setEstado] = useState<EstadoClienteFiltro>("TODOS");

  const { data, loading, error } = useClientes({
    busqueda,
    tipoDoc,
    estado,
  });

  const handleBusquedaChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setBusqueda(e.target.value);
  };

  const handleTipoDocChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setTipoDoc(e.target.value as TipoDocFiltro);
  };

  const handleEstadoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEstado(e.target.value as EstadoClienteFiltro);
  };

  const renderEstadoChip = (estado?: string) => {
    const val = (estado || "").toUpperCase();
    let color: "default" | "success" | "warning" | "error" = "default";
    let label = val || "—";

    if (val === "ACTIVO") color = "success";
    else if (val === "INACTIVO") color = "warning";
    else if (val === "MOROSO") color = "error";

    return <Chip size="small" label={label} color={color} variant="outlined" />;
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Filtros */}
      <Grid container spacing={1}>
        <Grid size={{ xs: 12, sm: 4, md: 4 }}>
          <TextField
            fullWidth
            size="small"
            label="Buscar"
            placeholder="Nombre, identidad, RTN, código…"
            value={busqueda}
            onChange={handleBusquedaChange}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 3 }}>
          <TextField
            select
            fullWidth
            size="small"
            label="Tipo documento"
            value={tipoDoc}
            onChange={handleTipoDocChange}
          >
            <MenuItem value="TODOS">Todos</MenuItem>
            <MenuItem value="IDENTIDAD">Identidad</MenuItem>
            <MenuItem value="RTN">RTN</MenuItem>
          </TextField>
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 3 }}>
          <TextField
            select
            fullWidth
            size="small"
            label="Estado"
            value={estado}
            onChange={handleEstadoChange}
          >
            <MenuItem value="TODOS">Todos</MenuItem>
            <MenuItem value="ACTIVO">Activos</MenuItem>
            <MenuItem value="INACTIVO">Inactivos</MenuItem>
          </TextField>
        </Grid>
        <Grid
          size={{ xs: 12, sm: 12, md: 2 }}
          sx={{ display: "flex", justifyContent: { md: "flex-end" } }}
        >
          <Button
            variant="contained"
            fullWidth
            sx={{ borderRadius: 999, mt: { xs: 1, md: 0 } }}
            component={Link}
            href="/clientes/nuevo"
          >
            + Nuevo cliente
          </Button>
        </Grid>
      </Grid>

      {/* Estado de carga / error */}
      {loading && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CircularProgress size={18} />
          <Typography variant="caption" color="text.secondary">
            Cargando clientes…
          </Typography>
        </Box>
      )}
      {error && (
        <Typography variant="caption" color="error">
          {error}
        </Typography>
      )}

      {/* Tabla de clientes */}
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="subtitle2">Listado de clientes</Typography>
          <Chip size="small" label={`Total: ${data.length}`} />
        </Box>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Código</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Identidad / RTN</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell>Correo</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Fecha registro</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!loading &&
                data &&
                data.length > 0 &&
                data.map((c) => {
                  const nombre =
                    [c.nombres, c.apellidos].filter(Boolean).join(" ") ||
                    "Cliente";

                  const doc =
                    c.identidadCliente || c.RTN || c.codigoCliente || "—";

                  const fechaReg =
                    c.fechaRegistro &&
                    new Date(c.fechaRegistro).toLocaleDateString("es-HN");

                  return (
                    <TableRow key={c._id}>
                      <TableCell>{c.codigoCliente || "-"}</TableCell>
                      <TableCell>{nombre}</TableCell>
                      <TableCell>{doc}</TableCell>
                      <TableCell>{c.telefono || "—"}</TableCell>
                      <TableCell>{c.correo || "—"}</TableCell>
                      <TableCell>{renderEstadoChip(c.estado)}</TableCell>
                      <TableCell>{fechaReg || "-"}</TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          variant="text"
                          component={Link}
                          href={`/clientes/${c._id}`}
                        >
                          Ver
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}

              {!loading && (!data || data.length === 0) && (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No hay clientes que cumplan con los filtros actuales.
                  </TableCell>
                </TableRow>
              )}

              {loading && (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    Cargando…
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

export default ClientesPage;
