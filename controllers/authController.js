import asyncHandler from "express-async-handler";
import bcrypt, { genSalt } from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import {
  createOTP,
  dotsToHyphens,
  hyphensToDots,
  isEmail,
  isMobile,
} from "../helpers/helpers.js";
import { sendSMS } from "../utils/sendSMS.js";
import { AccountActivationEmail } from "../mails/AccountActivationEmail.js";
import { cloudDelete, cloudUpload } from "../utils/cloudinary.js";

/**
 * @DESC User Login
 * @ROUTE /api/v1/auth/login
 * @method POST
 * @access public
 */
export const login = asyncHandler(async (req, res) => {
  const { auth, password } = req.body;

  // validation
  if (!auth || !password)
    return res.status(404).json({ message: "All fields are required" });

  // find login user by email
  let findUser = null;
  if (isEmail(auth)) {
    findUser = await User.findOne({ email: auth });
    if (!findUser) {
      return res.status(404).json({ message: "User not found" });
    }
  } else if (isMobile(auth)) {
    findUser = await User.findOne({ phone: auth });
    if (!findUser) {
      return res.status(404).json({ message: "User not found" });
    }
  } else {
    return res.status(404).json({ message: "Auth unauthenticate" });
  }

  // password check
  const passwordCheck = await bcrypt.compare(password, findUser.password);

  // password check
  if (!passwordCheck)
    return res.status(404).json({ message: "Wrong password" });

  if (findUser.verify === false) {
    // create a access token for account activation
    const activationCode = createOTP();
    if (isEmail(auth)) {
      await User.findOneAndUpdate(
        { email: auth },
        { accessToken: activationCode },
        {
          new: true,
        }
      );
      // create verification token
      const verifyToken = jwt.sign(
        { auth: auth },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "15m",
        }
      );
      res.cookie("verifyToken", verifyToken);

      // activation link
      const activationLink = `http://localhost:5173/activation/${dotsToHyphens(
        verifyToken
      )}`;
      // send ativation link to email
      await AccountActivationEmail(auth, {
        name: findUser.name,
        code: activationCode,
        link: activationLink,
      });
    } else if (isMobile(auth)) {
      await User.findOneAndUpdate(
        { phone: auth },
        { accessToken: activationCode },
        {
          new: true,
        }
      );
      // create verification token
      const verifyToken = jwt.sign(
        { auth: auth },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "15m",
        }
      );
      res.cookie("verifyToken", verifyToken);

      // send OTP to user mobile
      await sendSMS(
        auth,
        `Hello ${findUser.name}, Your account activation code is : ${activationCode}`
      );
    }
  }

  // create access token
  const token = jwt.sign({ auth: auth }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN,
  });

  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: process.env.APP_ENV == "Development" ? false : true,
    sameSite: "strict",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    token,
    user: findUser,
    message: "User Login Successful",
  });
});

/**
 * @DESC User Login
 * @ROUTE /api/v1/auth/login
 * @method POST
 * @access public
 */
export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("accessToken");
  res.status(200).json({ message: "Logout successful" });
});

/**
 * @DESC Create new User
 * @ROUTE /api/v1/user
 * @method POST
 * @access public
 */
export const register = asyncHandler(async (req, res) => {
  const { name, auth, password } = req.body;

  if (!name || !auth || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // auth value manage
  let authEmail = null;
  let authPhone = null;

  // create a access token for account activation
  const activationCode = createOTP();

  if (isMobile(auth)) {
    authPhone = auth;

    // check mobile exists or not
    const isMobileExists = await User.findOne({ phone: auth });

    if (isMobileExists) {
      return res.status(400).json({
        message: "Phone Number already exists",
      });
    }

    // create verification token
    const verifyToken = jwt.sign(
      { auth: auth },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m",
      }
    );
    res.cookie("verifyToken", verifyToken);

    // send OTP to user mobile
    await sendSMS(
      auth,
      `Hello ${name}, Your account activation code is : ${activationCode}`
    );
  } else if (isEmail(auth)) {
    authEmail = auth;

    // check mobile exists or not
    const isEmailExists = await User.findOne({ email: auth });

    if (isEmailExists) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    // create verification token
    const verifyToken = jwt.sign(
      { auth: auth },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m",
      }
    );
    res.cookie("verifyToken", verifyToken);

    // activation link
    const activationLink = `http://localhost:5173/activation/${dotsToHyphens(
      verifyToken
    )}`;
    // send ativation link to email
    await AccountActivationEmail(auth, {
      name,
      code: activationCode,
      link: activationLink,
    });
  } else {
    return res.status(400).json({
      message: "You must use mobile Number or Email address",
    });
  }

  // password hash
  const hashPass = await bcrypt.hash(password, 10);

  // create new user
  const user = await User.create({
    name,
    email: authEmail,
    phone: authPhone,
    password: hashPass,
    accessToken: activationCode,
  });

  res.status(200).json({
    user,
    message: "User created successfully",
  });
});

/**
 * @DESC Create new User
 * @ROUTE /api/v1/user
 * @method POST
 * @access public
 */
export const loggedInUser = asyncHandler(async (req, res) => {
  if (!req.me) {
    return res.status(400).json({ message: "User not found" });
  }
  res.status(200).json(req.me);
});

/**
 * Account activate by OTP
 */
export const accountActivateByOTP = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { otp } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Token not found" });
  }

  if (!otp) {
    return res.status(400).json({ message: "OTP not found" });
  }

  const verifyToken = hyphensToDots(token);
  // verify token
  const tokenCheck = jwt.verify(verifyToken, process.env.ACCESS_TOKEN_SECRET);

  if (!tokenCheck) {
    return res.status(400).json({ message: "Invalid Activation request" });
  }

  let activateUser = null;
  if (isMobile(tokenCheck.auth)) {
    activateUser = await User.findOne({ phone: tokenCheck.auth });
    if (!activateUser) {
      return res.status(400).json({ message: "User not found!" });
    }
  } else if (isEmail(tokenCheck.auth)) {
    activateUser = await User.findOne({ email: tokenCheck.auth });
    if (!activateUser) {
      return res.status(400).json({ message: "User not found!" });
    }
  } else {
    return res.status(400).json({ message: "Email and phone is not matching" });
  }

  // Check OTP
  if (otp != activateUser.accessToken) {
    return res.status(400).json({ message: "Wrong OTP" });
  }

  activateUser.accessToken = null;
  activateUser.verify = true;
  activateUser.save();

  // Clear Cookie
  res.clearCookie("verifyToken");

  return res.status(200).json({ message: "User activation successful" });
});
/**
 * Account activate by Link
 */
export const accountActivateByLink = asyncHandler(async (req, res) => {
  const { token } = req.params;

  if (!token) {
    return res.status(400).json({ message: "Token not found" });
  }

  const verifyToken = hyphensToDots(token);

  // verify token
  const tokenCheck = jwt.verify(verifyToken, process.env.ACCESS_TOKEN_SECRET);

  if (!tokenCheck) {
    return res.status(400).json({ message: "Invalid Activation request" });
  }

  let activateUser = null;
  if (isMobile(tokenCheck.auth)) {
    activateUser = await User.findOne({ phone: tokenCheck.auth });
    if (!activateUser) {
      return res.status(400).json({ message: "User not found!" });
    }
  } else if (isEmail(tokenCheck.auth)) {
    activateUser = await User.findOne({ email: tokenCheck.auth });
    if (!activateUser) {
      return res.status(400).json({ message: "User not found!" });
    }
  } else {
    return res.status(400).json({ message: "Email and phone is not matching" });
  }

  activateUser.accessToken = null;
  activateUser.verify = true;
  activateUser.save();

  // Clear Cookie
  res.clearCookie("verifyToken");
  return res.status(200).json({ message: "User activation successful" });
});
/**
 * Resend Activation Link And OTP
 */
export const resendActivationLinkOTP = asyncHandler(async (req, res) => {
  const { auth } = req.body;
  // create a access token for account activation
  const activationCode = createOTP();

  if (isEmail(auth)) {
    const user = await User.findOneAndUpdate(
      { email: auth },
      { accessToken: activationCode },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    // create verification token
    const verifyToken = jwt.sign(
      { auth: auth },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m",
      }
    );
    const expirationTime = new Date(Date.now() + 1000 * 60 * 5); // 5 minutes from now

    // res.cookie(
    //   "verifyToken",
    //   JSON.stringify({ token: verifyToken, expires: expirationTime }),
    //   { maxAge: expirationTime }
    // );

    res.cookie("verifyToken", verifyToken, { maxAge: 1000 * 60 * 5 });

    // activation link
    const activationLink = `http://localhost:5173/activation/${dotsToHyphens(
      verifyToken
    )}`;
    // send ativation link to email
    await AccountActivationEmail(auth, {
      name: user.name,
      code: activationCode,
      link: activationLink,
    });
  } else if (isMobile(auth)) {
    const user = await User.findOneAndUpdate(
      { phone: auth },
      { accessToken: activationCode },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    // create verification token
    const verifyToken = jwt.sign(
      { auth: auth },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m",
      }
    );
    res.cookie("verifyToken", verifyToken, { maxAge: 1000 * 60 * 5 });

    // send OTP to user mobile
    await sendSMS(
      auth,
      `Hello ${user.name}, Your account activation code is : ${activationCode}`
    );
  }

  return res.status(200).json({ message: `Successfully sent to ${auth}` });
});

/**
 * Verify user account for changing password
 */
export const verifyUserForChangePassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { otp } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Token not found" });
  }

  if (!otp) {
    return res.status(400).json({ message: "OTP not found" });
  }

  const verifyToken = hyphensToDots(token);
  // verify token
  const tokenCheck = jwt.verify(verifyToken, process.env.ACCESS_TOKEN_SECRET);

  if (!tokenCheck) {
    return res.status(400).json({ message: "Invalid Activation request" });
  }

  let activateUser = null;
  if (isMobile(tokenCheck.auth)) {
    activateUser = await User.findOne({ phone: tokenCheck.auth });
    if (!activateUser) {
      return res.status(400).json({ message: "User not found!" });
    }
  } else if (isEmail(tokenCheck.auth)) {
    activateUser = await User.findOne({ email: tokenCheck.auth });
    if (!activateUser) {
      return res.status(400).json({ message: "User not found!" });
    }
  } else {
    return res.status(400).json({ message: "Email and phone is not matching" });
  }

  // Check OTP
  if (otp != activateUser.accessToken) {
    return res.status(400).json({ message: "Wrong OTP" });
  }

  // create verification token
  const signingToken = jwt.sign(
    { auth: tokenCheck.auth },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "5m",
    }
  );
  res.cookie("verifyToken", signingToken, { maxAge: 1000 * 60 * 5 });

  activateUser.accessToken = null;
  activateUser.save();

  // Clear Cookie
  // res.clearCookie("verifyToken");

  return res.status(200).json({ message: "Okay" });
});
/**
 * Set new Password
 */
export const setNewPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Token not found" });
  }

  const verifyToken = hyphensToDots(token);
  // verify token
  const tokenCheck = jwt.verify(verifyToken, process.env.ACCESS_TOKEN_SECRET);

  if (!tokenCheck) {
    return res.status(400).json({ message: "Invalid Activation request" });
  }

  let activateUser = null;
  if (isMobile(tokenCheck.auth)) {
    activateUser = await User.findOne({ phone: tokenCheck.auth });
    if (!activateUser) {
      return res.status(400).json({ message: "User not found!" });
    }
  } else if (isEmail(tokenCheck.auth)) {
    activateUser = await User.findOne({ email: tokenCheck.auth });
    if (!activateUser) {
      return res.status(400).json({ message: "User not found!" });
    }
  } else {
    return res.status(400).json({ message: "Email and phone is not matching" });
  }

  // password hash
  const salt = await bcrypt.genSalt(10);
  activateUser.password = await bcrypt.hash(password, salt);
  await activateUser.save();

  // Clear Cookie
  res.clearCookie("verifyToken");

  return res.status(200).json({ message: "Changed password!" });
});
/**
 * Change profile picture
 */
export const changeProfilePicture = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const userData = await User.findById(id);

  let profilePhoto = userData.photo;
  if (req.file) {
    if (userData.photo) {
      cloudDelete(userData.photo);
    }
    profilePhoto = (await cloudUpload(req.file.path)).secure_url;
  }

  const user = await User.findByIdAndUpdate(
    id,
    {
      photo: profilePhoto,
    },
    { new: true }
  );

  return res.status(200).json({ user, message: "Changed photo!" });
});
/**
 * Change Profile Info
 */
export const changeProfileInfo = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findByIdAndUpdate(id, { ...req.body }, { new: true });

  return res.status(200).json({ user, message: "Changed info!" });
});
