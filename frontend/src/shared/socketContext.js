import socketIOClient from "socket.io-client";
import React from 'react';

const SOCKET_SERVER_URL = process.env.REACT_APP_SOCKT_HOST;

export const MessageSocket = {
    NEW_ORDER: 'order.new',
    ORDER_CHANGED_STATUS: `order.status.changed`,
}

export const socket = socketIOClient(SOCKET_SERVER_URL);
export const SocketContext = React.createContext();
