import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React, { useState, useEffect, useContext } from "react";
import { DataContext } from "../contexts/MainContext";
import { Socket } from "socket.io-client";

function ListDeleteConfirm(props: {
  func: {
    openConfirm: boolean;
    setOpenConfirm: React.Dispatch<React.SetStateAction<boolean>>;
    _id: string;
  };
}) {
  const { openConfirm, setOpenConfirm, _id } = props.func;
  const [dataSocket] = useContext(DataContext);
  const confirmDelete = () => {
    setOpenConfirm(false);
    dataSocket.emit("deleteList", _id);
  };
  return (
    <Dialog
      open={openConfirm}
      onClose={() => setOpenConfirm(false)}
    >
      <DialogTitle>Potwierdz usunięcie listy zadań</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Usunięcie listy zadań spowoduje skasowanie wszystkich zadań w tej
          liście bez możliwości przywrócenia, czy chcesz kontynuować?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setOpenConfirm(false);
          }}
        >
          ANULUJ
        </Button>
        <Button
          autoFocus
          onClick={() => {
            confirmDelete();
          }}
        >
          POTWIERDZ
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ListDeleteConfirm;
