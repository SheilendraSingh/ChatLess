const express = require("express"); // using express framework
const http = require("http"); // using to wrap express
const { Server } = require("socket.io"); //imports the socket.io server class to handle real time communications
const cors = require("cors"); // using for communication between frontend and backend

const app = express(); // creating an app
app.use(cors()); // applying middleware to connect

app.get("/", (_req, res) => res.send("Chat Server is up .")); //

const server = http.createServer(app);
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});
const rooms = {};

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  socket.on("join-room", (room) => {
    socket.join(room);
    console.log(`${socket.id} joined ${room}`);

    if (!rooms[room]) {
      rooms[room] = [];
    }
    socket.emit("room-messages", rooms[room]);
  });

  socket.on("send-message", (msgData) => {
    const { room } = msgData;
    if (!rooms[room]) return;
    const message = { text, id: socket.id };
    rooms[room].push(msgData);
    io.to(room).emit("receive-room-message", msgData);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on ${PORT}`));
