import React , { createContext, useMemo , useContext } from "react";
import { io } from "socket.io-client";
import API_ENDPOINTS from "../api/endpoints";

const SocketContext = createContext(null);

export const useSocket = () => {
    const socket = useContext(SocketContext);
    return socket;
};

export const SocketProvider = (props) => {
    const socket = useMemo( () => io(API_ENDPOINTS.BACK_ORIGIN) , []);

    return (
        <SocketContext.Provider value={socket}>
            {props.children}
        </SocketContext.Provider>
    )
}
