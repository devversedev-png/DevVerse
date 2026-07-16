import { io } from "socket.io-client";

const SOCKET_URL = "https://devverse-s609.onrender.com";

const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ["websocket", "polling"],
});

export default socket;