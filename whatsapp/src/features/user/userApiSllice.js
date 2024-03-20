import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Get All Permission
export const getAllUsers = createAsyncThunk("user/getAllUsers", async () => {
  try {
    const response = await axios.get(`http://localhost:5050/api/v1/user`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
});
// Get All Permission
export const getAllChatUsers = createAsyncThunk(
  "user/getAllChatUsers",
  async () => {
    try {
      const response = await axios.get(
        `http://localhost:5050/api/v1/user/chat-user`,
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

// User Search
export const userSearch = createAsyncThunk("user/userSearch", async (query) => {
  try {
    const response = await axios.get(
      `http://localhost:5050/api/v1/user/search?q=${query}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
});
