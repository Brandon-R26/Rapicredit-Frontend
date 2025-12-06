'use client';

import { Box, Grid, Paper, Typography } from '@mui/material';

export default function ReportesPage() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2">Cartera actual</Typography>
            <Typography variant="caption" color="text.secondary">
              Resumen por estado y producto desde <code>/api/reportes/cartera-actual</code>.
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2">Mora por días</Typography>
            <Typography variant="caption" color="text.secondary">
              Datos de <code>/api/reportes/mora?dias=30</code>.
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2">Colocación mensual</Typography>
            <Typography variant="caption" color="text.secondary">
              Datos de <code>/api/reportes/colocacion-mensual</code>.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
