const express = require("express"); // using express framework
const http = require("http"); // using to wrap express
const { Server } = require("socket.io"); //imports the socket.io server class to handle real time communications
const cors = require("cors"); // using for communication between frontend and backend

const app = express(); // creating an app
app.use(cors()); // applying middleware to connect

app.get("/", (_req, res) => res.send("Chat Server is up .")); //

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`${socket.id} joined ${room}`);
  });

  socket.on("send_message", (data) => {
    io.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on ${PORT}`));
