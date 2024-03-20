import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import Chat from "../models/Chat.js";
import { sendPhoto } from "../utils/multer.js";
import { cloudUpload } from "../utils/cloudinary.js";

/**
 * @DESC Get all users data
 * @ROUTE /api/v1/user
 * @method GET
 * @access public
 */
export const getAllChat = asyncHandler(async (req, res) => {
  const senderId = req.me._id;
  const receiverId = req.params.id;
  const chats = await Chat.find({
    $or: [
      { senderId: senderId, receiverId: receiverId },
      { senderId: receiverId, receiverId: senderId },
    ],
  });

  if (chats.length > 0) {
    res.status(200).json({ chats });
  }
});

/**
 * User Find or Query
 */
export const createMessage = asyncHandler(async (req, res) => {
  const senderId = req.params.senderId;
  const receiverId = req.params.receiverId;
  const { text } = req.body;

  let fileLink;
  if (req.file) {
    fileLink = (await cloudUpload(req.file.path)).secure_url;
  }

  const chatMessage = await Chat.create({
    senderId,
    receiverId,
    message: {
      text: text === "undefined" || !text ? null : text,
      img: fileLink ? fileLink : null,
    },
  });

  const updateSenderUser = await User.findByIdAndUpdate(
    senderId,
    {
      $addToSet: { chatUser: receiverId },
    },
    { new: true }
  );
  const updateReceiverUser = await User.findByIdAndUpdate(
    receiverId,
    {
      $addToSet: { chatUser: senderId },
    },
    { new: true }
  );

  return res.status(200).json({ chatMessage, message: "Changed info!" });
});
/**
 * Set Emoji on Single Chat through Editing
 */
export const setEmojiOnSingleChat = asyncHandler(async (req, res) => {
  const singleChatId = req.params.id;
  const { emoji } = req.body;

  const setEmoji = await Chat.findByIdAndUpdate(
    singleChatId,
    { emoji },
    { new: true }
  );

  return res.status(200).json({ chatMessage, message: "Changed info!" });
});

// /**
//  * @DESC Get Single users data
//  * @ROUTE /api/v1/user/:id
//  * @method GET
//  * @access public
//  */
// export const getSingleUser = asyncHandler(async (req, res) => {
//   const { id } = req.params;

//   const user = await User.findById(id);

//   if (!user) {
//     return res.status(404).json({ message: "User data not found" });
//   }

//   res.status(200).json(user);
// });

// /**
//  * @DESC Create new User
//  * @ROUTE /api/v1/user
//  * @method POST
//  * @access public
//  */
// export const createUser = asyncHandler(async (req, res) => {
//   const { name, email, password, role } = req.body;

//   if (!name || !email || !password) {
//     return res.status(400).json({ message: "All fields are required" });
//   }

//   // check user email
//   const userEmailCheck = await User.findOne({ email });

//   if (userEmailCheck) {
//     return res.status(400).json({ message: "Email already exists" });
//   }

//   // password hash
//   const hashPass = await bcrypt.hash(password, 10);

//   // create new user
//   const user = await User.create({
//     name,
//     email,
//     password: hashPass,
//     role,
//   });

//   // send user access to email
//   sendMail({
//     to: email,
//     sub: "Account Access Info",
//     msg: `Your account login access is email : ${email} & password : ${password}`,
//   });

//   res.status(200).json({ user, message: `${name} user created successful` });
// });

// /**
//  * @DESC Delete User
//  * @ROUTE /api/v1/user/:id
//  * @method DELETE
//  * @access public
//  */
// export const deleteUser = asyncHandler(async (req, res) => {
//   const { id } = req.params;

//   const user = await User.findByIdAndDelete(id);

//   res.status(200).json(user);
// });
