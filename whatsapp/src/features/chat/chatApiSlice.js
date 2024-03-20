import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Get All Permission
export const getAllChats = createAsyncThunk(
  "chat/getAllChats",
  async (receiverId) => {
    try {
      const response = await axios.get(
        `http://localhost:5050/api/v1/chat/${receiverId}`,
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
export const createMessage = createAsyncThunk(
  "chat/createMessage",
  async ({ senderId, receiverId, body }) => {
    try {
      const response = await axios.post(
        `http://localhost:5050/api/v1/chat/${senderId}/${receiverId}`,
        body,
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
