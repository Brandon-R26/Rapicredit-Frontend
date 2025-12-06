"use client";

import React from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Chip,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
} from "@mui/material";
import { useDashboardData } from "../../hooks/useDashboardData";

const DashboardPage: React.FC = () => {
  const { data, loading, error } = useDashboardData();

  const activos = data?.prestamosActivos ?? 0;
  const monto = data?.montoTotalColocado ?? 0;
  const mora = data?.prestamosEnMora ?? 0;
  const vencen7 = data?.vencenEn7Dias ?? 0;

  const distrib = data?.distribucionEstados || {};
  const totalEstados =
    (distrib.VIGENTE || 0) + (distrib.EN_MORA || 0) + (distrib.PAGADO || 0);

  const pct = (v?: number) =>
    totalEstados ? Math.round(((v || 0) / totalEstados) * 100) : 0;

  const pctVigente = pct(distrib.VIGENTE);
  const pctMora = pct(distrib.EN_MORA);
  const pctPagado = pct(distrib.PAGADO);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Loading / error arriba pequeño */}
      {loading && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <CircularProgress size={18} />
          <Typography variant="caption" color="text.secondary">
            Cargando resumen de dashboard…
          </Typography>
        </Box>
      )}
      {error && (
        <Typography variant="caption" color="error" sx={{ mb: 1 }}>
          {error}
        </Typography>
      )}

      {/* Métricas principales */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper
            sx={{
              p: 2,
              background:
                "radial-gradient(circle at top, rgba(56,189,248,0.10), rgba(15,23,42,1))",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Préstamos activos
            </Typography>
            <Typography variant="h5" sx={{ mt: 0.5 }}>
              {loading ? "—" : activos}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Total vigentes
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper
            sx={{
              p: 2,
              background:
                "radial-gradient(circle at top, rgba(56,189,248,0.10), rgba(15,23,42,1))",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Monto total colocado
            </Typography>
            <Typography variant="h5" sx={{ mt: 0.5 }}>
              {loading
                ? "—"
                : `L. ${monto.toLocaleString("es-HN", {
                    minimumFractionDigits: 2,
                  })}`}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Capital inicial acumulado
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper
            sx={{
              p: 2,
              background:
                "radial-gradient(circle at top, rgba(56,189,248,0.10), rgba(15,23,42,1))",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Préstamos en mora
            </Typography>
            <Typography variant="h5" sx={{ mt: 0.5 }}>
              {loading ? "—" : mora}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Con atraso registrado
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper
            sx={{
              p: 2,
              background:
                "radial-gradient(circle at top, rgba(56,189,248,0.10), rgba(15,23,42,1))",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Vencen en 7 días
            </Typography>
            <Typography variant="h5" sx={{ mt: 0.5 }}>
              {loading ? "—" : vencen7}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Próximos vencimientos
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Tabla de préstamos recientes + pagos del día */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ p: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Typography variant="subtitle2">Préstamos recientes</Typography>
              <Chip size="small" label="Últimos 10" />
            </Box>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Código</TableCell>
                    <TableCell>Cliente</TableCell>
                    <TableCell>Monto</TableCell>
                    <TableCell>Saldo</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Desembolso</TableCell>
                    <TableCell>Vencimiento</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading && (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        Cargando…
                      </TableCell>
                    </TableRow>
                  )}

                  {!loading &&
                    data?.prestamosRecientes &&
                    data.prestamosRecientes.length > 0 &&
                    data.prestamosRecientes.map((p) => {
                      const clienteNombre =
                        p.cliente?.codigoCliente ||
                        p.cliente?.identidadCliente ||
                        "Cliente";

                      const fechaDes =
                        p.fechaDesembolso &&
                        new Date(p.fechaDesembolso).toLocaleDateString("es-HN");
                      const fechaVen =
                        p.fechaVencimiento &&
                        new Date(p.fechaVencimiento).toLocaleDateString(
                          "es-HN"
                        );

                      const montoPrestamo =
                        p.monto != null
                          ? `L. ${p.monto.toLocaleString("es-HN", {
                              minimumFractionDigits: 2,
                            })}`
                          : "-";

                      const saldoPrestamo =
                        p.saldo != null
                          ? `L. ${p.saldo.toLocaleString("es-HN", {
                              minimumFractionDigits: 2,
                            })}`
                          : "—";

                      return (
                        <TableRow key={p.id || p.codigo}>
                          <TableCell>{p.codigo || "-"}</TableCell>
                          <TableCell>{clienteNombre}</TableCell>
                          <TableCell>{montoPrestamo}</TableCell>
                          <TableCell>{saldoPrestamo}</TableCell>
                          <TableCell>{p.estado || "-"}</TableCell>
                          <TableCell>{fechaDes || "-"}</TableCell>
                          <TableCell>{fechaVen || "-"}</TableCell>
                        </TableRow>
                      );
                    })}

                  {!loading &&
                    (!data?.prestamosRecientes ||
                      data.prestamosRecientes.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          No hay préstamos recientes para mostrar.
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
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Typography variant="subtitle2">Pagos del día</Typography>
              <Chip size="small" label="Hoy" />
            </Box>
            <TableContainer sx={{ maxHeight: 260 }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Hora</TableCell>
                    <TableCell>Préstamo</TableCell>
                    <TableCell>Cliente</TableCell>
                    <TableCell>Monto</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading && (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        Cargando…
                      </TableCell>
                    </TableRow>
                  )}

                  {!loading &&
                    data?.pagosHoy &&
                    data.pagosHoy.length > 0 &&
                    data.pagosHoy.map((a) => {
                      const hora =
                        a.fechaAbono &&
                        new Date(a.fechaAbono).toLocaleTimeString("es-HN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        });

                      const codFin = a.codigoFinanciamiento || "-";

                      const clienteNombre =
                        a.cliente?.codigoCliente ||
                        a.cliente?.identidadCliente ||
                        "Cliente";

                      const monto =
                        a.monto != null
                          ? `L. ${a.monto.toLocaleString("es-HN", {
                              minimumFractionDigits: 2,
                            })}`
                          : "L. 0.00";

                      return (
                        <TableRow key={a.id || `${codFin}-${a.fechaAbono}`}>
                          <TableCell>{hora || "-"}</TableCell>
                          <TableCell>{codFin}</TableCell>
                          <TableCell>{clienteNombre}</TableCell>
                          <TableCell>{monto}</TableCell>
                        </TableRow>
                      );
                    })}

                  {!loading &&
                    (!data?.pagosHoy || data.pagosHoy.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          No hay pagos registrados hoy.
                        </TableCell>
                      </TableRow>
                    )}
                </TableBody>
              </Table>
            </TableContainer>
            {!loading && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1, display: "block" }}
              >
                Datos en vivo desde <code>/api/dashboard/resumen</code>.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
