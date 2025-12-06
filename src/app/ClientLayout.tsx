"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, Box } from "@mui/material";
import theme from "../theme/theme";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

type Props = {
  children: ReactNode;
};

export default function ClientLayout({ children }: Props) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        suppressHydrationWarning
        sx={{
          display: "flex",
          height: "100vh",
          bgcolor: "background.default",
        }}
      >
        <Sidebar />
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Topbar />
          <Box
            component="main"
            sx={{
              flex: 1,
              overflow: "auto",
              p: 2,
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
