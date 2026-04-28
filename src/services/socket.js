import { io } from "socket.io-client";

const resolveAuth = () => ({
  token: localStorage.getItem("token") || undefined
});

export const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", {
  autoConnect: true,
  auth: resolveAuth()
});

export const syncSocketAuth = () => {
  socket.auth = resolveAuth();
  socket.disconnect().connect();
};
