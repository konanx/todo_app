import React from "react";
import { CssBaseline, Container, Typography, Box } from "@mui/material";
import AppRoutes from "../routes/AppRoutes";
import useMediaQuery from "@mui/material/useMediaQuery";
function App() {
  const mobile = useMediaQuery("(max-width:1100px)");
  if (mobile)
    return (
      <Container maxWidth="xl">
        <Typography
          variant="h5"
          mt={3}
          textAlign="center"
        >
          Aplikacja w fazie rozwojowej, wersja mobilna w budowie
        </Typography>
        <Typography
          mt={2}
          textAlign="center"
          variant="h6"
        >
          Za utrudnienia przepraszamy
        </Typography>
      </Container>
    );
  return (
    <>
      <AppRoutes />
    </>
  );
}

export default App;
