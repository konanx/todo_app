import React, { useContext, useState } from "react";
import { SingleTaskIE } from "./ZadaniaInterfaces";
import {
  Box,
  Checkbox,
  Icon,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import StarIcon from "@mui/icons-material/Star";
import { DataContext } from "../contexts/MainContext";
import DeleteIcon from "@mui/icons-material/Delete";
function SingleTask(props: { item: SingleTaskIE }) {
  const [dataSocket] = useContext(DataContext);

  const { item } = props;
  const { name = "", fav = false, _id, done = false } = item;

  const changeFav = () => {
    dataSocket.emit("modifySingleTaskFav", { id: _id, fav: !fav });
  };
  const deleteTask = () => {
    dataSocket.emit("deleteSingleTask", { id: _id });
  };
  const changeTaskStatus = () => {
    dataSocket.emit("changeSingleTaskStatus", { id: _id, done: !done });
  };
  return (
    <Paper
      elevation={3}
      sx={{ mt: 1, width: "800px", p: 1, opacity: done ? 0.2 : 1 }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Tooltip title="Zmień status">
          <Checkbox
            checked={done}
            onChange={changeTaskStatus}
          />
        </Tooltip>
        <Typography
          variant="subtitle1"
          noWrap
        >
          {name}
        </Typography>
        <Box sx={{ flexGrow: 1 }}></Box>
        <Box>
          <Tooltip
            title="Zmień priorytet"
            onClick={changeFav}
          >
            <IconButton>{fav ? <StarIcon /> : <StarOutlineIcon />}</IconButton>
          </Tooltip>
          <Tooltip
            title="Usuń"
            onClick={deleteTask}
          >
            <IconButton>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Paper>
  );
}

export default SingleTask;
