const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

io.on("connection", (socket) => {
  socket.on("join-frequency", (freq) => {
    socket.join(freq);
    socket.frequency = freq;
    socket.to(freq).emit("user-joined", socket.id);
  });

  socket.on("signal", (data) => {
    socket.to(data.frequency).emit("signal", data);
  });

  socket.on("disconnect", () => {
    if (socket.frequency) {
      socket.to(socket.frequency).emit("user-left", socket.id);
    }
  });
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
