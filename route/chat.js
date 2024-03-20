import express from "express";
import { createMessage, getAllChat } from "../controllers/chatController.js";
import tokenVerify from "../middlewares/verifyToken.js";
import { sendPhoto } from "../utils/multer.js";

const router = express.Router();

// use verify token
router.use(tokenVerify);

// create route

router.route("/:id").get(tokenVerify, getAllChat);
router.route("/:senderId/:receiverId").post(sendPhoto, createMessage);
// router.route("/search").get(tokenVerify, userSearch);
// router.route("/:id").get(getSingleUser).delete(deleteUser).put(updateUser);

// export default router
export default router;
