import express from "express";
import {
  login,
  logout,
  register,
  loggedInUser,
  accountActivateByOTP,
  accountActivateByLink,
  resendActivationLinkOTP,
  verifyUserForChangePassword,
  setNewPassword,
  changeProfilePicture,
  changeProfileInfo,
} from "../controllers/authController.js";
import tokenVerify from "../middlewares/verifyToken.js";
import { profilePhoto } from "../utils/multer.js";

const router = express.Router();

// create route
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/register").post(register);
router.route("/activation-by-otp/:token").post(accountActivateByOTP);
router.route("/activation-by-link/:token").post(accountActivateByLink);
router.route("/resend-link-otp").post(resendActivationLinkOTP);
router.route("/verify-user/:token").post(verifyUserForChangePassword);
router.route("/new-password/:token").post(setNewPassword);
router
  .route("/change-profile-photo/:id")
  .put(profilePhoto, changeProfilePicture);
router.route("/change-profile-info/:id").put(changeProfileInfo);

router.get("/me", tokenVerify, loggedInUser);

// export default router
export default router;
