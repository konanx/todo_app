import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import { CssBaseline, createTheme } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import AppRoutes from "./routes/AppRoutes";
import { store } from "./app/store";
import { Provider } from "react-redux";
import "./index.scss";
const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
  typography: {
    fontFamily: ["Montserrat"].join(","),
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <ThemeProvider theme={darkTheme}>
    <Provider store={store}>
      <CssBaseline />
      <App />
    </Provider>
  </ThemeProvider>
);
