import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "../contexts/MainContext";
import { Container, Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import { statsIE } from "./ZadaniaInterfaces";
import moment from "moment";
function Statystyki() {
  const { id } = useSelector((state: RootState) => state.auth);
  const [dataSocket] = useContext(DataContext);
  const [stats, setStats] = useState<statsIE>();
  useEffect(() => {
    if (!dataSocket) return;
    dataSocket.emit("getStats", id);
    dataSocket.on("getStatsResponse", (data: statsIE) => {
      setStats(data);
    });
    return () => {
      dataSocket.off("getStatsResponse");
    };
  }, [dataSocket]);

  return (
    <Container
      maxWidth="xl"
      sx={{ mt: 2 }}
    >
      <Grid
        container
        spacing={3}
      >
        <Grid lg={4}>
          <Paper
            elevation={4}
            sx={{ p: 2, height: "100%" }}
          >
            <Typography
              variant="h4"
              textAlign="center"
              fontFamily="Bebas Neue"
            >
              INFORMACJE
            </Typography>
            <Typography
              variant="subtitle1"
              mt={2}
            >
              Utworzone zadania: {stats?.created_tasks}
            </Typography>
            <Typography variant="subtitle1">
              Ukończone zadania: {stats?.completed_tasks}
            </Typography>
            <Typography variant="subtitle1">
              Stworzone listy zadań: {stats?.created_lists}
            </Typography>
            <Typography variant="subtitle1">
              Usunięte zadania: {stats?.deleted_tasks}
            </Typography>
            <Typography variant="subtitle1">
              Dni od dołączenia do TODO_app: {stats?.account_createdAt}
            </Typography>
          </Paper>
        </Grid>
        <Grid lg={4}>
          <Paper
            elevation={4}
            sx={{ p: 2, height: "100%" }}
          >
            <Typography
              variant="h4"
              textAlign="center"
              fontFamily="Bebas Neue"
            >
              PLANY
            </Typography>
            <Typography
              variant="subtitle1"
              mt={2}
            >
              Zadania do zrobienia: {stats?.current_tasks}
            </Typography>
            <Typography variant="subtitle1">
              Ulubione nieukończone zadania: {stats?.fav_current_tasks}
            </Typography>
            {/* <Typography variant="subtitle1">
              Wykonane zadania: 50/200 (LVL. 2)
            </Typography> */}
          </Paper>
        </Grid>
        <Grid lg={4}>
          <Paper
            elevation={4}
            sx={{ p: 2, height: "100%" }}
          >
            <Typography
              variant="h4"
              textAlign="center"
              fontFamily="Bebas Neue"
            >
              SKUTECZNOŚĆ
            </Typography>
            <Typography
              variant="subtitle1"
              mt={2}
            >
              Wykonane zadania (DZIŚ): {stats?.today_done_tasks}
            </Typography>
            <Typography variant="subtitle1">
              Utworzone zadania (DZIŚ): {stats?.today_created_tasks}
            </Typography>
            <Typography variant="subtitle1">
              Wykonane zadania: {stats?.completed_tasks_percent ?? 0}%
            </Typography>
            <Typography variant="subtitle1">
              Usunięte zadania: {stats?.deleted_tasks_percent ?? 0}%
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      <Typography
        mt={7}
        variant="h3"
        textAlign="center"
        fontFamily="Bebas Neue"
      >
        NAGRODY I TROFEA:
      </Typography>
      <Typography
        textAlign="center"
        variant="h6"
      >
        Wkrótce :)
      </Typography>
    </Container>
  );
}

export default Statystyki;
