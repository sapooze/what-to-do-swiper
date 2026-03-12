import { io } from "socket.io-client";

const SERVER_URL =
  import.meta.env.VITE_SERVER_URL ||
  window.location.origin;

console.log("[socket] connecting to", SERVER_URL);

export const socket = io(SERVER_URL, {
  autoConnect: true,
});

socket.on("connect", () => console.log("[socket] connected", socket.id));
socket.on("connect_error", (err) => console.error("[socket] connect_error", err.message));
socket.on("disconnect", (reason) => console.warn("[socket] disconnected", reason));
