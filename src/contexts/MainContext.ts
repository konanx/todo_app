import { createContext } from "react";
import { Socket } from "socket.io-client";

const DataContext = createContext<Socket[] | any>(null);
export { DataContext };
