const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const server = http.createServer(app);
const socketio = require("socket.io");
const io = socketio(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  socket.on("send-location", (value) => {
    // console.log({ id: socket.id, ...value });
    io.emit("recieve-location", { id: socket.id, ...value });
  });
  console.log("connected1");
  socket.on("disconnect", () => {
    io.emit("user-disconnected", socket.id);
  });
});

app.get("/", (req, res) => {
  res.render("page");
});

server.listen(3000, () => console.log("Listening in the port"));
