import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import { Link } from "react-router-dom";
function DoesntExist() {
  const { login = "użytknowniku" } = useSelector(
    (state: RootState) => state.auth
  );
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
        mt: 8,
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h1"
            textAlign="center"
          >
            Witaj,
          </Typography>
          <Typography
            variant="h1"
            sx={{
              background: "linear-gradient(to right, #3f51b5, #9c27b0)",
              "-webkit-background-clip": "text",
              "-webkit-text-fill-color": "transparent",
              fontWeight: "bold",
              fontFamily: "Arial, sans-serif",
            }}
          >
            {login}
          </Typography>
        </Box>
      </Box>

      <Typography
        mt={2}
        variant="h6"
      >
        Niestety wyszukiwana strona nie istnieje :(
      </Typography>
      <Link to="/listy-zadan">
        <Button
          variant="outlined"
          color="primary"
          sx={{ mt: 4 }}
        >
          <Typography variant="h5">Wróć do zadań</Typography>
        </Button>
      </Link>
    </Box>
  );
}

export default DoesntExist;
