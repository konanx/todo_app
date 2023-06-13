import React, { useState, useEffect, useContext, SetStateAction } from "react";
import { listSettingsIE, listSettingsResponseIE } from "./ZadaniaInterfaces";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  FormControlLabel,
  Input,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import ListDeleteConfirm from "./ListDeleteConfirm";
import { DataContext } from "../contexts/MainContext";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
function ListSettingsModal(props: {
  settings: listSettingsIE;
  func: {
    setSettings: React.Dispatch<
      React.SetStateAction<listSettingsIE | undefined>
    >;
  };
}) {
  const { id } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [dataSocket] = useContext(DataContext);
  const [editName, setEditName] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [displayCompleted, setDisplayCompleted] = useState<boolean>(false);
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);

  const { open, _id, name } = props.settings;
  const { setSettings } = props.func;
  useEffect(() => {
    if (!dataSocket) return;

    dataSocket.on(
      "getListSettingsModalResponse",
      (data: listSettingsResponseIE) => {
        setDisplayCompleted(data.displayCompleted);
      }
    );
    dataSocket.on("updateListSettingsResponse", () => {
      setIsSubmitting(false);
      navigate("/listy-zadan");
      dataSocket.emit("getTaskLists", id);
      setSettings(
        (prev: listSettingsIE | undefined) =>
          ({ ...prev, open: false } as listSettingsIE | undefined)
      );
    });
    return () => {
      dataSocket.off("getListSettingsModalResponse");
      dataSocket.off("updateListSettingsResponse");
    };
  }, [dataSocket]);
  useEffect(() => {
    if (!props.settings.open) return;
    setEditName(false);
    dataSocket.emit("getListSettingsModal", _id);
  }, [props.settings]);

  const submitChanges = () => {
    if (editName && !newName) {
      enqueueSnackbar("Nazwa nie może być pusta", {
        variant: "error",
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
      });
      return;
    }
    setIsSubmitting(true);
    dataSocket.emit("updateListSettings", {
      _id,
      newName: editName ? newName : name,
      displayCompleted,
    });
  };

  return (
    <>
      <Dialog
        keepMounted={false}
        open={open}
        onClose={() =>
          setSettings(
            (prev: listSettingsIE | undefined) =>
              ({ ...prev, open: false } as listSettingsIE | undefined)
          )
        }
        maxWidth="md"
        fullWidth
      >
        <Box
          sx={{
            p: 2,
          }}
        >
          <Typography
            variant="h5"
            noWrap
          >
            Ustawienia listy: {name}
          </Typography>
          <Box>
            <FormControlLabel
              sx={{ mt: 2 }}
              control={
                <Switch
                  checked={displayCompleted}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setDisplayCompleted(e.target.checked)
                  }
                />
              }
              label="Wyświetlanie ukończonych zadań?"
              labelPlacement="end"
            />
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <FormControlLabel
              control={
                <Switch
                  checked={editName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEditName(e.target.checked)
                  }
                />
              }
              label="Edytować nazwę?"
              labelPlacement="end"
            />
            {editName && (
              <Input
                placeholder="Nowa nazwa"
                fullWidth={false}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            )}
          </Box>
          <Stack
            spacing={2}
            direction="row"
            justifyContent="space-between"
            mt={4}
          >
            <Stack
              spacing={1}
              direction="row"
            >
              {isSubmitting ? (
                <LoadingButton
                  loading
                  variant="outlined"
                />
              ) : (
                <Button
                  variant="contained"
                  color="success"
                  onClick={submitChanges}
                >
                  Zapisz
                </Button>
              )}
              <Button
                variant="contained"
                color="info"
                onClick={() =>
                  setSettings(
                    (prev: listSettingsIE | undefined) =>
                      ({ ...prev, open: false } as listSettingsIE | undefined)
                  )
                }
              >
                ZAMKNIJ
              </Button>
            </Stack>
            <Button
              variant="contained"
              color="error"
              onClick={() => setOpenConfirm(true)}
            >
              Usuń listę
            </Button>
          </Stack>
        </Box>
        <ListDeleteConfirm func={{ openConfirm, setOpenConfirm, _id }} />
      </Dialog>
    </>
  );
}

export default ListSettingsModal;
