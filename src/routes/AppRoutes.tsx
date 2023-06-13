import React, { useState, useEffect, useContext, Context } from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import {
  Login,
  NavBar,
  LoadingBar,
  AvatarChange,
  Statystyki,
  ListyZadan,
  ListaZadan,
  Restore,
  DoesntExist,
} from "./RoutesTree";
import { setAuthData } from "../features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { DataContext } from "../contexts/MainContext";
import { Socket, io } from "socket.io-client";
import {
  SnackbarProvider,
  enqueueSnackbar,
  VariantType,
  SnackbarOrigin,
} from "notistack";
import { Box, CssBaseline } from "@mui/material";
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Box>
        <NavBar />
        <Outlet />
      </Box>
    ),
    children: [
      {
        path: "avatar-change",
        element: <AvatarChange />,
      },

      {
        path: "statystyki",
        element: <Statystyki />,
      },
      {
        path: "przywroc",
        element: <Restore />,
      },
    ],
  },

  {
    path: "/listy-zadan",
    element: (
      <Box sx={{ display: "flex", height: "100vh", width: "100%" }}>
        <Box
          sx={{
            ml: "300px",
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <NavBar />
          <ListyZadan />
          <Outlet />
        </Box>
      </Box>
    ),
    children: [
      {
        path: ":id",
        element: <ListaZadan />,
      },
    ],
  },
  {
    path: "*",
    element: (
      <Box>
        <NavBar />
        <DoesntExist />
      </Box>
    ),
  },
]);

function AppRoutes() {
  const [dataSocket, setDataSocket] = useState<Socket>();
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const { id } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (localStorage.getItem("id")) {
      dispatch(
        setAuthData({
          login: localStorage.getItem("login") ?? "",
          id: localStorage.getItem("id") ?? "",
        })
      );
    }
    setIsLoading(false);
  }, []);
  useEffect(() => {
    let data_socket_ip: string = import.meta.env.VITE_DATA_SOCKET_IP;
    setDataSocket(io(data_socket_ip));
  }, []);
  useEffect(() => {
    if (!dataSocket) return;
    dataSocket.on(
      "alert",
      (data: {
        type: VariantType;
        message: "string";
        anchor: "left" | "center" | "right";
      }) => {
        let { type, message, anchor } = data;
        enqueueSnackbar(message, {
          variant: type,
          anchorOrigin: { vertical: "bottom", horizontal: anchor },
        });
      }
    );

    return () => {
      dataSocket.off("alert");
    };
  }, [dataSocket]);
  if (isLoading) return <LoadingBar />;
  if (!id) return <Login />;
  return (
    <DataContext.Provider value={[dataSocket]}>
      <SnackbarProvider autoHideDuration={4000} />
      <RouterProvider router={router} />
    </DataContext.Provider>
  );
}

export default AppRoutes;
