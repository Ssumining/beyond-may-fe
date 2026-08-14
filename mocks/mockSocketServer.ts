import { Server } from "socket.io";

const io = new Server(4000, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("connected:", socket.id);

  socket.onAny((event: string, payload: unknown) => {
    console.log("received:", event, payload);
    socket.emit(event, payload);
  });

  socket.on("disconnect", () => {
    console.log("disconnected:", socket.id);
  });
});

console.log("mock socket server on :4000");
