import {
  Box,
  Checkbox,
  CircularProgress,
  Container,
  FormControlLabel,
  IconButton,
  Input,
  Pagination,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState, useContext, useRef } from "react";
import { DataContext } from "../contexts/MainContext";
import { useParams } from "react-router-dom";
import LoadingBarNormal from "./LoadingBarNormal";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { enqueueSnackbar } from "notistack";
import { SingleTaskIE, listSettingsResponseIE } from "./ZadaniaInterfaces";
import SingleTask from "./SingleTask";
function ListaZadan() {
  const { id } = useParams();
  const [permissionError, setPermissionError] = useState(false);
  const [displayEnded, setDisplayEnded] = useState<boolean>(true);
  const [displayEndedLoading, setDisplayEndedLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [newTaskName, setNewTaskName] = useState("");
  const [listaZadan, setListaZadan] = useState<SingleTaskIE[]>([]);
  const [displayZadania, setDisplayZadania] = useState<SingleTaskIE[]>([]);
  const inputNewTask = useRef<HTMLDivElement>(null);
  const user_id = useSelector((state: RootState) => state.auth.id);
  const [isLoading, setIsLoading] = useState(true);
  const [dataSocket] = useContext(DataContext);
  useEffect(() => {
    if (!dataSocket) return;
    dataSocket.on("getListSettingsResponse", (data: listSettingsResponseIE) => {
      setDisplayEnded(data.displayCompleted);
      setDisplayEndedLoading(false);
    });
    dataSocket.on("getSingleListErrorResponse", () => {
      setPermissionError(true);
      setIsLoading(false);
    });
    dataSocket.on("getSingleListResponse", (data: SingleTaskIE[]) => {
      data.sort((a, b) => {
        if (a.done && !b.done) {
          return 1;
        } else if (!a.done && b.done) {
          return -1;
        } else if (a.fav && !b.fav) {
          return -1;
        } else if (!a.fav && b.fav) {
          return 1;
        } else {
          return 0;
        }
      });
      setListaZadan(data);
      setPermissionError(false);
      setIsLoading(false);
    });
    dataSocket.on("createSingleTaskResponse", () => {
      setNewTaskName("");
      inputNewTask.current?.focus();
      pobierzListe();
    });
    dataSocket.on("modifySingleTaskResponse", () => {
      pobierzListe();
    });
    return () => {
      dataSocket.off("getSingleListErrorResponse");
      dataSocket.off("getSingleListResponse");
      dataSocket.off("createSingleTaskResponse");
      dataSocket.off("modifySingleTaskResponse");
      dataSocket.off("getListSettingsResponse");
    };
  }, [dataSocket, id, displayEndedLoading]);
  useEffect(() => {
    setDisplayZadania(
      listaZadan.slice((currentPage - 1) * 8, (currentPage - 1) * 8 + 8)
    );
  }, [listaZadan, currentPage]);
  useEffect(() => {
    setDisplayEndedLoading(true);
    setIsLoading(true);
    dataSocket.emit("getListSettings", id);
    inputNewTask.current?.focus();
    setCurrentPage(1);
  }, [id]);
  useEffect(() => {
    if (!displayEndedLoading) pobierzListe();
  }, [displayEndedLoading]);
  const createNewTask = () => {
    if (!newTaskName) {
      enqueueSnackbar("Podaj nazwe dodawanego zadania", {
        variant: "error",
        anchorOrigin: { horizontal: "right", vertical: "bottom" },
      });
      inputNewTask.current?.focus();
      return;
    }
    dataSocket.emit("createSingleTask", { user_id, id, newTaskName });
  };
  const pobierzListe = () => {
    dataSocket.emit("getSingleList", {
      list_id: id,
      user_id,
      displayEnded: displayEnded,
    });
  };

  if (isLoading) return <LoadingBarNormal />;
  if (permissionError)
    return (
      <Typography
        variant="h4"
        textAlign="center"
        mt={3}
        color="red"
      >
        Brak uprawnień
      </Typography>
    );
  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        p: 4,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography
        textAlign="center"
        variant="h5"
      >
        ZADANIA DLA WYBRANEJ LISTY:
      </Typography>
      <Box
        mt={2}
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        {displayZadania.length === 0 && (
          <Box>
            <Typography
              variant="h2"
              textAlign="center"
            >
              Hurrra!
            </Typography>
            <Typography
              variant="h4"
              textAlign="center"
            >
              Wszystkie zadania ukończone :)
            </Typography>
          </Box>
        )}
        {displayZadania.map((item, index) => (
          <SingleTask
            key={item._id}
            item={item}
          />
        ))}
      </Box>
      {listaZadan.length > 0 && (
        <Pagination
          count={Math.ceil(listaZadan.length / 8)}
          page={currentPage}
          onChange={(e, t) => setCurrentPage(t)}
          variant="outlined"
          color="secondary"
          sx={{ alignSelf: "center", mt: 3 }}
        />
      )}
      {listaZadan.length > 0 && (
        <Typography
          mt={2}
          textAlign="center"
        >
          ILOŚĆ ZADAŃ: {listaZadan.length}
        </Typography>
      )}
      <Box sx={{ flexGrow: 1 }}></Box>
      <Box
        mt={3}
        sx={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
        }}
      >
        <Input
          sx={{ alignSelf: "flex-start", justifySelf: "flex-start" }}
          placeholder="Dodaj zadanie"
          value={newTaskName}
          inputRef={inputNewTask}
          onChange={(e) => setNewTaskName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              createNewTask();
            }
          }}
        />
        <Tooltip
          title="Dodaj nowe zadanie"
          onClick={createNewTask}
        >
          <IconButton>
            <SendRoundedIcon sx={{ fontSize: "18px" }} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}

export default ListaZadan;
