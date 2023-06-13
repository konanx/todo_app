import { Box, CircularProgress, Typography } from "@mui/material";
import React from "react";

function LoadingBarNormal() {
  return (
    <Box
      mt={24}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Typography variant="h5">Ładowanie danych...</Typography>
      <CircularProgress
        sx={{ mt: 3 }}
        color="inherit"
      />
    </Box>
  );
}

export default LoadingBarNormal;
