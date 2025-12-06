"use client";
import Link from "next/link";
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
import {
  usePrestamos,
  EstadoFiltro,
  OrdenarPor,
} from "../../hooks/usePrestamos";

const PrestamosPage: React.FC = () => {
  const [estado, setEstado] = useState<EstadoFiltro>("TODOS");
  const [ordenarPor, setOrdenarPor] = useState<OrdenarPor>("MAS_RECIENTES");
  const [busqueda, setBusqueda] = useState("");

  const { data, loading, error } = usePrestamos({
    estado,
    ordenarPor,
    busqueda,
  });

  const handleEstadoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEstado(e.target.value as EstadoFiltro);
  };

  const handleOrdenChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setOrdenarPor(e.target.value as OrdenarPor);
  };

  const handleBusquedaChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setBusqueda(e.target.value);
  };

  const renderEstadoChip = (estadoFin?: string) => {
    const val = (estadoFin || "").toUpperCase();
    let color: "default" | "error" | "success" | "info" = "default";
    let label = val || "—";

    if (val === "EN_MORA") {
      color = "error";
    } else if (val === "PAGADO") {
      color = "success";
    } else if (val === "VIGENTE" || val === "ACTIVO") {
      color = "info";
    }

    return <Chip size="small" label={label} color={color} variant="outlined" />;
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Filtros */}
      <Grid container spacing={1}>
        <Grid size={{ xs: 12, sm: 4, md: 3 }}>
          <TextField
            fullWidth
            size="small"
            select
            label="Estado"
            value={estado}
            onChange={handleEstadoChange}
          >
            <MenuItem value="TODOS">Todos</MenuItem>
            <MenuItem value="VIGENTE">Vigentes</MenuItem>
            <MenuItem value="EN_MORA">En mora</MenuItem>
            <MenuItem value="PAGADO">Pagados</MenuItem>
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 4, md: 3 }}>
          <TextField
            fullWidth
            size="small"
            select
            label="Ordenar por"
            value={ordenarPor}
            onChange={handleOrdenChange}
          >
            <MenuItem value="MAS_RECIENTES">Más recientes</MenuItem>
            <MenuItem value="MONTO_MAYOR">Monto mayor</MenuItem>
            <MenuItem value="MONTO_MENOR">Monto menor</MenuItem>
            <MenuItem value="MAYOR_ATRASO">Mayor atraso</MenuItem>
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 4, md: 4 }}>
          <TextField
            fullWidth
            size="small"
            label="Buscar"
            placeholder="Código, identidad, nombre…"
            value={busqueda}
            onChange={handleBusquedaChange}
          />
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
            href="/prestamos/nuevo"
          >
            + Nuevo préstamo
          </Button>
        </Grid>
      </Grid>

      {/* Estado de carga / error */}
      {loading && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CircularProgress size={18} />
          <Typography variant="caption" color="text.secondary">
            Cargando cartera de préstamos…
          </Typography>
        </Box>
      )}
      {error && (
        <Typography variant="caption" color="error">
          {error}
        </Typography>
      )}

      {/* Tabla */}
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="subtitle2">Listado de préstamos</Typography>
          <Chip size="small" label={`Total: ${data.length}`} />
        </Box>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Código</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Producto</TableCell>
                <TableCell>Monto</TableCell>
                <TableCell>Saldo</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Desembolso</TableCell>
                <TableCell>Vencimiento</TableCell>
                <TableCell>Oficial</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!loading &&
                data &&
                data.length > 0 &&
                data.map((f) => {
                  const cli = f.clienteId || {};
                  const clienteNombre =
                    cli.codigoCliente ||
                    cli.identidadCliente ||
                    cli.RTN ||
                    [cli.nombres, cli.apellidos].filter(Boolean).join(" ") ||
                    "Cliente";

                  const producto = f.solicitudId?.finalidadCredito || "Crédito";

                  const fechaDes =
                    f.fechaDesembolso &&
                    new Date(f.fechaDesembolso).toLocaleDateString("es-HN");
                  const fechaVen =
                    f.fechaVencimiento &&
                    new Date(f.fechaVencimiento).toLocaleDateString("es-HN");

                  const monto =
                    f.capitalInicial != null
                      ? `L. ${f.capitalInicial.toLocaleString("es-HN", {
                          minimumFractionDigits: 2,
                        })}`
                      : "-";

                  const saldo =
                    f.saldoCapital != null
                      ? `L. ${f.saldoCapital.toLocaleString("es-HN", {
                          minimumFractionDigits: 2,
                        })}`
                      : "L. 0.00";

                  return (
                    <TableRow key={f._id}>
                      <TableCell>{f.codigoFinanciamiento || "-"}</TableCell>
                      <TableCell>{clienteNombre}</TableCell>
                      <TableCell>{producto}</TableCell>
                      <TableCell>{monto}</TableCell>
                      <TableCell>{saldo}</TableCell>
                      <TableCell>
                        {renderEstadoChip(f.estadoFinanciamiento)}
                      </TableCell>
                      <TableCell>{fechaDes || "-"}</TableCell>
                      <TableCell>{fechaVen || "-"}</TableCell>
                      <TableCell>
                        {f.cobradorAsignadoId?.nombreCompleto || "-"}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          variant="text"
                          component={Link}
                          href={`/prestamos/${f._id}`}
                        >
                          Ver
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}

              {!loading && (!data || data.length === 0) && (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    No hay préstamos que cumplan con los filtros actuales.
                  </TableCell>
                </TableRow>
              )}

              {loading && (
                <TableRow>
                  <TableCell colSpan={10} align="center">
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

export default PrestamosPage;
