import { createSlice } from "@reduxjs/toolkit";
import { createMessage, getAllChats } from "./chatApiSlice";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: [],
    error: null,
    message: null,
    success: false,
  },
  reducers: {
    setMessageEmpty: (state, action) => {
      state.error = null;
      state.message = null;
      state.success = false;
    },
    realTimeChat: (state, action) => {
      state.chats.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createMessage.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(createMessage.fulfilled, (state, action) => {
        state.chats.push(action.payload.chatMessage);
        state.success = action.payload.chatMessage;
      })
      .addCase(getAllChats.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(getAllChats.fulfilled, (state, action) => {
        state.chats = action.payload.chats;
      });
  },
});

// Export Selector
export const getChats = (state) => state.chats;

// Actions
export const { setMessageEmpty, realTimeChat } = chatSlice.actions;

// exports
export default chatSlice.reducer;
