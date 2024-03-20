import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

// Register User
export const createUser = createAsyncThunk("auth/createUser", async (data) => {
  try {
    const response = await axios.post(`/api/v1/auth/register`, data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
});
// Verify User accoutn
export const activateUserAccountByOTP = createAsyncThunk(
  "auth/activateUserAccountByOTP",
  async (data) => {
    try {
      const response = await axios.post(
        `/api/v1/auth/activation-by-otp/${data.token}`,
        { otp: data.otp },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);
// Verify User accoutn
export const activateUserAccountByLink = createAsyncThunk(
  "auth/activateUserAccountByLink",
  async (data) => {
    try {
      const response = await axios.post(
        `/api/v1/auth/activation-by-link/${data}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

// Login User
export const loginUser = createAsyncThunk("auth/loginUser", async (data) => {
  try {
    const response = await axios.post(`/api/v1/auth/login`, data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
});

// Get LogedIn User
export const getLogedInUser = createAsyncThunk("auth/logedInUser", async () => {
  try {
    const response = await axios.get(`/api/v1/auth/me`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
});
// Logout User
export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  try {
    const response = await axios.post(`/api/v1/auth/logout`, "", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
});
// Resend otp and link to user
export const resendActivateLinkOTP = createAsyncThunk(
  "auth/resendActivateLinkOTP",
  async (auth) => {
    try {
      const response = await axios.post(
        `/api/v1/auth/resend-link-otp`,
        { auth },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);
// Verify user for set new password through OTP
export const verifyUserSetNewPassword = createAsyncThunk(
  "auth/verifyUserSetNewPassword",
  async (data) => {
    try {
      const response = await axios.post(
        `/api/v1/auth/verify-user/${data.token}`,
        { otp: data.otp },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);
// Set new password
export const setNewPassword = createAsyncThunk(
  "auth/setNewPassword",
  async (data) => {
    try {
      const response = await axios.post(
        `/api/v1/auth/new-password/${data.token}`,
        { password: data.password },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

// Change profile Photo
export const changeProfilePhoto = createAsyncThunk(
  "auth/changeProfilePhoto",
  async ({ id, data }) => {
    try {
      const response = await axios.put(
        `/api/v1/auth/change-profile-photo/${id}`,
        data,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);
// Change Profile Info
export const changeProfileInfo = createAsyncThunk(
  "auth/changeProfileInfo",
  async ({ id, data }) => {
    try {
      const response = await axios.put(
        `/api/v1/auth/change-profile-info/${id}`,
        data,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

// Update User
export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async ({ id, data }) => {
    try {
      const response = await axios.put(`/api/v1/auth/update/${id}`, data, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);
