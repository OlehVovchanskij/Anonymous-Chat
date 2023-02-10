const express = require("express");
const app = express();
const http = require("http").createServer(app);

const io = require("socket.io")(http);

const PORT = 3000;

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
  app.use(express.static(__dirname + "/public"));
});

let userCount = 0;

io.on("connection", function (socket) {
  console.log("user connected");
  userCount++;
  io.emit("getStatus", userCount);

  socket.on("chat message", function (props) {
    console.log(props);
    io.emit("chat message", props);
  });
  socket.on("login", function (props) {
    io.emit("login", props);
  });
  socket.on("disconnect", function () {
    console.log("user disconnect");
    userCount--;
    io.emit("getStatus", userCount);
  });
});

http.listen(PORT, function () {
  console.log(`server work on port: ${PORT}`);
});
