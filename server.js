import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./route/user.js";
import authRouter from "./route/auth.js";
import chatRouter from "./route/chat.js";
import { errorHandler } from "./middlewares/errorhandler.js";
import { mongoBDConnect } from "./config/db.js";
import { Server } from "socket.io";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// initialization
const app = express();
dotenv.config();

const server = createServer(app);
const io = new Server(server);
// set middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Socket.io event handlers
io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
});

// set environment vars
const PORT = process.env.PORT || 9090;

// routing
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/chat", chatRouter);

// static folder
app.use(express.static(path.join(__dirname, "/whatsapp/dist")));

app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/whatsapp/dist/index.html"))
);

// app listen
app.listen(PORT, () => {
  mongoBDConnect();
  console.log(`server is running on port ${PORT}`.bgGreen.black);
});
