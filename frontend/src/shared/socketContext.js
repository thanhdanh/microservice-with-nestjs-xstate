import socketIOClient from "socket.io-client";
import React from 'react';

const SOCKET_SERVER_URL = process.env.REACT_APP_SOCKT_HOST;

export const MessageSocket = {
    NEW_ORDER: 'order.new',
    ORDER_CHANGED_STATUS: `order.status.changed`,
}

export const socket = socketIOClient.io(SOCKET_SERVER_URL);
export const SocketContext = React.createContext();


// const useSocket = () => {
//     const socketRef = useRef();

//     useEffect(() => {
//         // Creates a WebSocket connection
//         socketRef.current = socketIOClient(SOCKET_SERVER_URL);

//         socketRef.current.on('connect', function () {
//             console.log('Connected');
//         });

//         socketRef.current.on('order.new', function (data) {
//             console.log('New order', data);
//         });

//         return () => {
//             socketRef.current.disconnect();
//         };
//     })

//     const onOrderStatusChange = (cb) => {
//         socketRef.current && socketRef.current.on(Message.ORDER_CHANGED_STATUS, cb);
//     };

//     return { onOrderStatusChange, instance: socketRef.current }
// }

// export default useSocket;
