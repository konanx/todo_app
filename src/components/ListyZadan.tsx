import React, { useState, useEffect, useContext, useRef } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { enqueueSnackbar } from "notistack";
import { DataContext } from "../contexts/MainContext";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import { ListaZadanIE, listSettingsIE } from "./ZadaniaInterfaces";
import { Link, useNavigate, useParams } from "react-router-dom";
import SettingsIcon from "@mui/icons-material/Settings";
import ListSettingsModal from "./ListSettingsModal";
const SingleList = (props: {
  item: ListaZadanIE;
  func: {
    setSettings: React.Dispatch<
      React.SetStateAction<listSettingsIE | undefined>
    >;
  };
}) => {
  const { id } = useParams();
  const { item, func } = props;
  const { setSettings } = func;
  const { name, _id } = item;
  return (
    <Box>
      <Link to={_id}>
        <Paper
          sx={{
            p: 1,
            cursor: "pointer",
            mt: 1,
            width: "100%",
            display: "flex",
            flexShrink: 0,
            alignItems: "center",
            backgroundColor: id === _id ? "#975ab6" : "",
            "&:hover": {
              opacity: id === _id ? 1 : "0.8",
              transition: ".2s",
            },
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ flexGrow: 1 }}
            noWrap
          >
            {name}
          </Typography>
          <Box sx={{ flexGrow: 1 }}></Box>

          <Tooltip
            title="Ustawienia"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setSettings({ _id, name, open: true });
            }}
          >
            <IconButton>
              <SettingsIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </Paper>
      </Link>
    </Box>
  );
};

function ListyZadan() {
  const navigate = useNavigate();
  const { id } = useSelector((state: RootState) => state.auth);
  const [newListName, setNewListName] = useState("");
  const [dataSocket] = useContext(DataContext);
  const [listyZadan, setListyZadan] = useState<ListaZadanIE[]>([]);
  const [settings, setSettings] = useState<listSettingsIE>();
  let inputNewTask = useRef<HTMLDivElement>(null);
  const createNewList = () => {
    if (!newListName) {
      enqueueSnackbar("Nazwa listy nie może być pusta", {
        variant: "error",
        anchorOrigin: { horizontal: "right", vertical: "bottom" },
      });
      return;
    }
    dataSocket.emit("createNewList", { id, name: newListName });
  };
  useEffect(() => {
    if (!dataSocket) return;
    dataSocket.emit("getTaskLists", id);
    dataSocket.on("createNewListResponse", () => {
      setNewListName("");
      setTimeout(() => {
        inputNewTask.current?.focus();
      }, 100);
      dataSocket.emit("getTaskLists", id);
    });
    dataSocket.on("getTaskListsResponse", (lists: ListaZadanIE[]) => {
      setListyZadan(lists);
    });
    dataSocket.on("deleteListResponse", (list_id: string) => {
      setSettings(
        (prev: listSettingsIE | undefined) =>
          ({ ...prev, open: false } as listSettingsIE | undefined)
      );
      navigate("/listy-zadan");
      dataSocket.emit("getTaskLists", id);
    });
    return () => {
      dataSocket.off("createNewListResponse");
      dataSocket.off("getTaskListsResponse");
      dataSocket.off("deleteListResponse");
    };
  }, [dataSocket]);
  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        open={true}
        variant="persistent"
        anchor="left"
        sx={{
          flexShrink: 0,
        }}
      >
        <Box
          mt={1}
          sx={{
            p: 1,
            width: "300px",
            height: "100%",
            maxWidth: "300px",
            display: "flex",
            flexWrap: "wrap",
            flexDirection: "column",
          }}
        >
          <Typography
            variant="h5"
            sx={{ px: 1 }}
          >
            Listy zadań:
          </Typography>
          <Box
            sx={{
              flexGrow: 1,
              maxHeight: "90%",
              width: "100%",
              overflow: "auto",
              "&::-webkit-scrollbar": { height: 10, WebkitAppearance: "none" },
              "&::-webkit-scrollbar-thumb": {
                borderRadius: 8,
                border: "2px solid",
                backgroundColor: "rgba(0 0 0 / 0.5)",
              },
            }}
          >
            {listyZadan.map((item: ListaZadanIE) => (
              <SingleList
                item={item}
                func={{ setSettings }}
                key={item._id}
              />
            ))}
          </Box>
          <Box
            mt={3}
            sx={{
              justifySelf: "flex-end",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TextField
              size="small"
              label="Nazwa nowej listy"
              variant="outlined"
              value={newListName}
              inputRef={inputNewTask}
              onChange={(e) => setNewListName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  createNewList();
                }
              }}
            />
            <Tooltip
              title="Dodaj nową listę"
              onClick={createNewList}
            >
              <IconButton>
                <SendRoundedIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Drawer>
      <ListSettingsModal
        settings={{
          name: settings?.name ?? "",
          _id: settings?._id ?? "",
          open: settings?.open ?? false,
        }}
        func={{ setSettings }}
      />
    </Box>
  );
}

export default ListyZadan;
