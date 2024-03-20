import express from "express";
import {
  deleteUser,
  getAllChatUser,
  getAllUser,
  getSingleUser,
  updateUser,
  userSearch,
} from "../controllers/userController.js";
import tokenVerify from "../middlewares/verifyToken.js";

const router = express.Router();

// use verify token
router.use(tokenVerify);

// create route

router.route("/").get(tokenVerify, getAllUser);
router.route("/chat-user").get(tokenVerify, getAllChatUser);
router.route("/search").get(tokenVerify, userSearch);
router.route("/:id").get(getSingleUser).delete(deleteUser).put(updateUser);

// export default router
export default router;
