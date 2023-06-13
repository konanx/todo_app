import React, { useEffect, useState } from "react";
import { Button, Typography, Box, TextField, Tabs, Tab } from "@mui/material";
import { io, Socket } from "socket.io-client";
import { SnackbarProvider, enqueueSnackbar, VariantType } from "notistack";
import { SHA256 } from "crypto-js";
import { useDispatch } from "react-redux";
import { setAuthData } from "../features/authSlice";
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function Login() {
  const dispatch = useDispatch();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [selectedTab, setSelectedTab] = useState(0);
  const [loginSocket, setLoginSocket] = useState<Socket>(
    io("http://83.144.97.227:3010")
  );
  useEffect(() => {
    if (!loginSocket) return;
    loginSocket.on("createTestAccountResponse", (id: string) => {
      localStorage.setItem("id", id);
      localStorage.setItem("login", "testowe");
      dispatch(setAuthData({ id, login: "testowe" }));
    });
    loginSocket.on(
      "createNewAccountResponse",
      (data: { login: string; id: "string" }) => {
        let { login, id } = data;
        localStorage.setItem("id", id);
        localStorage.setItem("login", login);
        dispatch(setAuthData({ id, login }));
      }
    );
    loginSocket.on(
      "loginToExistResponse",
      (data: { id: string; login: string }) => {
        localStorage.setItem("id", data.id);
        localStorage.setItem("login", data.login);
        dispatch(setAuthData({ id: data.id, login: data.login }));
      }
    );
    loginSocket.on(
      "alert",
      (data: { type: VariantType; message: "string" }) => {
        let { type, message } = data;
        enqueueSnackbar(message, { variant: type });
      }
    );
    return () => {
      loginSocket.off("createTestAccountResponse");
      loginSocket.off("createNewAccountResponse");
      loginSocket.off("loginToExistResponse");
    };
  }, [loginSocket]);
  const hashSHA256 = (value: string) => {
    return SHA256(value).toString();
  };
  const createTestAccount = () => loginSocket.emit("createTestAccount");
  const createNewAccount = () => {
    if (password.length < 4) {
      enqueueSnackbar("Zbyt krótkie hasło (WYMAGANE: 4 znaki)", {
        variant: "error",
      });
      return;
    }
    if (password !== password2) {
      enqueueSnackbar("Hasła nie pasują do siebie", { variant: "error" });
      return;
    }
    const hash_password = hashSHA256(password);
    loginSocket.emit("createNewAccount", { login, password: hash_password });
  };
  const loginToExist = () => {
    if (!login || !password) {
      enqueueSnackbar("Wymagane: Login i Hasło", { variant: "error" });
      return;
    }
    const hash_password = hashSHA256(password);
    loginSocket.emit("loginToExist", { login, password: hash_password });
  };
  // das
  return (
    <>
      <SnackbarProvider autoHideDuration={4000} />
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        gap={2}
        mt={3}
      >
        <Button
          variant="contained"
          sx={{ px: 3, py: 1.5 }}
          onClick={createTestAccount}
        >
          <Typography variant="h5">Stwórz testowe</Typography>
        </Button>
        <Tabs
          value={selectedTab}
          onChange={(e, val) => setSelectedTab(val)}
          sx={{ mb: 0, pb: 0 }}
        >
          <Tab
            value={0}
            label="Login"
          />
          <Tab
            value={1}
            label="Rejestracja"
          />
        </Tabs>
        <TextField
          size="small"
          label="Email"
          required
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />
        <TextField
          size="small"
          label="Hasło"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {selectedTab == 1 && (
          <div>
            <TextField
              size="small"
              label="Powtórz hasło"
              type="password"
              required
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
            />
          </div>
        )}
        <Button
          variant="outlined"
          onClick={selectedTab ? createNewAccount : loginToExist}
        >
          {selectedTab ? "UTWÓRZ KONTO" : "ZALOGUJ SIĘ"}
        </Button>
      </Box>
    </>
  );
}

export default Login;
