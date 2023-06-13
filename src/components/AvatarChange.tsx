import {
  Box,
  Button,
  Container,
  IconButton,
  Input,
  Typography,
} from "@mui/material";
import React, { ChangeEvent, useEffect, useState, useContext } from "react";
import { SnackbarProvider, enqueueSnackbar, VariantType } from "notistack";
import { PhotoCamera } from "@mui/icons-material";
import { DataContext } from "../contexts/MainContext";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
function AvatarChange() {
  const id = useSelector((state: RootState) => state.auth.id);
  const [dataSocket] = useContext(DataContext);
  const handleFileUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
    let files = event.target.files;
    let filetype = event?.target?.value?.split(".").pop();
    if (!filetype) {
      enqueueSnackbar("Nieprawidłowy plik", {
        variant: "error",
      });
      return;
    }
    if (!["png", "jpg", "jpeg"].includes(filetype)) {
      enqueueSnackbar("Akceptowane rozszerzenia: .png .jpg .jpeg", {
        variant: "error",
      });
      return;
    }
    if (files && files.length === 1) {
      const file = files[0];
      let size = file.size / 1024;
      if (size > 20000) {
        enqueueSnackbar("Maksymalny rozmiar pliku 20MB", {
          variant: "error",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e?.target?.result) {
          const fileData = e.target.result;
          dataSocket.emit("changeAvatar", { id, buffer: fileData });
        }
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <Box
      mt={4}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Typography variant="h4">ZMIEŃ AVATAR</Typography>
      <input
        accept="image/png, image/jpeg, image/jpg"
        type="file"
        hidden
        id="upload-new-avatar"
        onChange={(e) => handleFileUpdate(e)}
      />
      <Box mt={6}>
        <Button variant="contained">
          <label htmlFor="upload-new-avatar">
            <Box
              sx={{
                gap: 1,
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <Typography variant="h6">DODAJ ZDJĘCIE</Typography>
              <PhotoCamera sx={{ fontSize: 48 }} />
            </Box>
          </label>
        </Button>
      </Box>
    </Box>
  );
}

export default AvatarChange;
