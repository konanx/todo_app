import {
  Box,
  Checkbox,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState, useEffect, useContext } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import { DataContext } from "../contexts/MainContext";
import { SingleTaskIE } from "./ZadaniaInterfaces";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import moment from "moment";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import StarIcon from "@mui/icons-material/Star";
import RestoreIcon from "@mui/icons-material/Restore";
import LoadingBarNormal from "./LoadingBarNormal";
function Restore() {
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useSelector((state: RootState) => state.auth);
  const [dataSocket] = useContext(DataContext);
  const [restoreItems, setRestoreItems] = useState<SingleTaskIE[]>([]);

  const SingleRestoreItem = (props: { item: SingleTaskIE }) => {
    const { item } = props;
    const { name, fav, done, created, _id } = item;
    const restoreTask = () => {
      dataSocket.emit("restoreSingleTask", _id);
    };
    return (
      <Paper
        sx={{
          mt: 1,
          px: 2,
          p: 1,
          width: "600px",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Tooltip
          title={
            done ? "wykonane przed usunięciem" : "NIE wykonane przed usunięciem"
          }
        >
          {done ? (
            <DoneIcon sx={{ color: "green" }} />
          ) : (
            <CloseIcon sx={{ color: "red" }} />
          )}
        </Tooltip>
        <Tooltip
          title={
            fav
              ? "dodane do ulubionych przed usunięciem"
              : "NIE dodane do ulubionych przed usunięciem"
          }
        >
          {fav ? <StarIcon /> : <StarOutlineIcon />}
        </Tooltip>
        <Tooltip title="Data utworzenia zadania">
          <Typography
            variant="h6"
            sx={{ cursor: "pointer" }}
          >
            {moment(created).format("HH:MM DD.MM.YYYY")}
          </Typography>
        </Tooltip>
        <Tooltip title="Nazwa usuniętego zadania">
          <Typography
            variant="h6"
            sx={{ cursor: "pointer" }}
          >
            {name}
          </Typography>
        </Tooltip>
        <Box sx={{ flexGrow: 1 }}></Box>
        <Box sx={{ display: "flex" }}>
          <Tooltip
            title="Przywróć zadanie"
            onClick={restoreTask}
          >
            <IconButton>
              <RestoreIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>
    );
  };

  useEffect(() => {
    if (!dataSocket) return;
    dataSocket.emit("getDeletedTask", id);
    dataSocket.on("getDeletedTaskResponse", (data: SingleTaskIE[]) => {
      setRestoreItems(data);
      setIsLoading(false);
    });
    dataSocket.on("restoreSingleTaskResponse", () => {
      dataSocket.emit("getDeletedTask", id);
    });
    return () => {
      dataSocket.off("getDeletedTaskResponse");
      dataSocket.off("restoreSingleTaskResponse");
    };
  }, [dataSocket]);
  if (isLoading) return <LoadingBarNormal />;
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Typography
        mt={3}
        variant="subtitle2"
        sx={{ width: "100%", px: 2 }}
        textAlign="right"
      >
        Zadania do przywrócenia: {restoreItems.length}
      </Typography>
      <Typography
        variant="h5"
        textAlign="center"
      >
        Przywróć usunięte zadania:
      </Typography>

      {restoreItems.length === 0 && (
        <Typography
          mt={8}
          variant="h4"
        >
          Brak skasowanych zadań :)
        </Typography>
      )}
      {restoreItems.map((item, index) => {
        return (
          <SingleRestoreItem
            key={item._id}
            item={item}
          />
        );
      })}
    </Box>
  );
}

export default Restore;
