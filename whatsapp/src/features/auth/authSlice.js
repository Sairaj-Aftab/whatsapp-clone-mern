import { createSlice } from "@reduxjs/toolkit";
import {
  activateUserAccountByLink,
  activateUserAccountByOTP,
  changeProfileInfo,
  changeProfilePhoto,
  createUser,
  getLogedInUser,
  loginUser,
  logoutUser,
  resendActivateLinkOTP,
  setNewPassword,
  updateUser,
  verifyUserSetNewPassword,
} from "./authApiSlice";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null,
    message: null,
    success: false,
    error: null,
    loader: false,
  },
  reducers: {
    setMessageEmpty: (state, action) => {
      state.message = null;
      state.error = null;
      state.success = false;
    },
    setLogoutUser: (state, action) => {
      state.message = null;
      state.error = null;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createUser.pending, (state, action) => {
        state.loader = true;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loader = false;
        state.error = action.error.message;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.message = action.payload.message;
        state.loader = false;
      })
      .addCase(activateUserAccountByOTP.pending, (state, action) => {
        state.loader = true;
      })
      .addCase(activateUserAccountByOTP.rejected, (state, action) => {
        state.loader = false;
        state.error = action.error.message;
      })
      .addCase(activateUserAccountByOTP.fulfilled, (state, action) => {
        state.message = action.payload.message;
        state.loader = false;
      })
      .addCase(activateUserAccountByLink.pending, (state, action) => {
        state.loader = true;
      })
      .addCase(activateUserAccountByLink.rejected, (state, action) => {
        state.loader = false;
        state.error = action.error.message;
      })
      .addCase(activateUserAccountByLink.fulfilled, (state, action) => {
        state.message = action.payload.message;
        state.loader = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loader = false;
        state.error = action.error.message;
      })
      .addCase(loginUser.pending, (state, action) => {
        state.loader = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.message = action.payload.message;
        state.user = action.payload.user;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        state.loader = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.user = null;
        localStorage.removeItem("user");
        state.message = action.payload.message;
      })
      .addCase(getLogedInUser.rejected, (state, action) => {
        state.user = null;
      })
      .addCase(getLogedInUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(resendActivateLinkOTP.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(resendActivateLinkOTP.fulfilled, (state, action) => {
        state.message = action.payload.message;
      })
      .addCase(verifyUserSetNewPassword.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(verifyUserSetNewPassword.fulfilled, (state, action) => {
        state.success = true;
      })
      .addCase(setNewPassword.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(setNewPassword.fulfilled, (state, action) => {
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(changeProfilePhoto.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(changeProfilePhoto.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(changeProfileInfo.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(changeProfileInfo.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.message = action.payload.message;
      });
  },
});

// Export Selector
export const userData = (state) => state.auth;

// Actions
export const { setMessageEmpty, setLogoutUser } = authSlice.actions;

// exports
export default authSlice.reducer;
