import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState, useContext, useEffect } from "react";
import logo from "../img/todo_app.svg";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { setAuthData } from "../features/authSlice";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { DataContext } from "../contexts/MainContext";
const navItems = [
  { path: "/listy-zadan", name: "ZADANIA" },
  { path: "/statystyki", name: "STATYSTYKI" },
  { path: "/przywroc", name: "PRZYWRÓĆ" },
];

function NavBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [dataSocket] = useContext(DataContext);
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const dispatch = useDispatch();
  const { login, id } = useSelector((state: RootState) => state.auth);
  useEffect(() => {
    if (!dataSocket || !id) return;
    dataSocket.emit("getAvatar", id);
    dataSocket.on("getAvatarResponse", (data: string | null) => {
      setAvatarSrc(data);
    });
    return () => {
      dataSocket.off("getAvatarResponse");
    };
  }, [dataSocket, id]);
  useEffect(() => {
    if (pathname === "/") navigate("/listy-zadan");
  }, []);
  const logOut = () => {
    localStorage.removeItem("id");
    localStorage.removeItem("login");
    dispatch(setAuthData({ login: "", id: null }));
  };

  return (
    <Box>
      <AppBar
        position="sticky"
        sx={{ p: 1 }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Link to="/listy-zadan">
              <img
                src={logo}
                width={200}
                height={60}
              />
            </Link>
            <Box
              sx={{
                ml: 3,
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              {navItems.map((item, index) => {
                return (
                  <Link
                    to={item.path}
                    key={index}
                  >
                    <Button>
                      <Typography
                        variant="h6"
                        sx={{
                          color: pathname.includes(item.path) ? "red" : "white",
                        }}
                      >
                        {item.name}
                      </Typography>
                    </Button>
                  </Link>
                );
              })}
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant="h6">{login}</Typography>
              <Tooltip title="Zmień avatar">
                <Link to="/avatar-change">
                  <IconButton sx={{ p: 0 }}>
                    <Avatar src={avatarSrc ?? ""}>
                      {login?.charAt(0)?.toUpperCase() ?? ""}
                    </Avatar>
                  </IconButton>
                </Link>
              </Tooltip>

              <Link to="/">
                <Button
                  color="error"
                  variant="outlined"
                  onClick={logOut}
                >
                  <Typography variant="subtitle1">WYLOGUJ</Typography>
                </Button>
              </Link>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
}

export default NavBar;
