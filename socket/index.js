import { Server } from "socket.io";

const io = new Server(9000, {
  cors: "*",
});

let activeUsers = [];

io.on("connection", (socket) => {
  console.log("user connected");

  socket.on("setActiveUser", (data) => {
    const checkActiveUser = activeUsers.some((d) => d._id === data._id);
    if (!checkActiveUser) {
      activeUsers.push({
        userId: data._id,
        socketId: socket.id,
        user: data,
      });
    }
    io.emit("getActiveUser", activeUsers);
  });
  socket.on("removeLogoutUser", (id) => {
    console.log(id);
    activeUsers = activeUsers.filter((data) => data.userId !== id);
    io.emit("getActiveUser", activeUsers);
  });
  // Real time chating
  socket.on("sentRealTimeMsg", (msg) => {
    const checkActiveUser = activeUsers.find(
      (d) => d.userId === msg.receiverId
    );

    if (checkActiveUser) {
      socket.to(checkActiveUser.socketId).emit("sentRealTimeMsgGet", msg);
    }
  });
  // Typing... Message
  socket.on("typing", (data) => {
    io.emit("getTyping", data);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
    activeUsers = activeUsers.filter((data) => data.socketId !== socket.id);
    io.emit("getActiveUser", activeUsers);
  });
});
