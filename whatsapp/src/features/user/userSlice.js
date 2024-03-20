import { createSlice } from "@reduxjs/toolkit";
import { getAllChatUsers, getAllUsers, userSearch } from "./userApiSllice";

const userSlice = createSlice({
  name: "users",
  initialState: {
    users: null,
    chatUsers: null,
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(getAllChatUsers.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(getAllChatUsers.fulfilled, (state, action) => {
        state.chatUsers = action.payload.users;
      })
      .addCase(userSearch.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(userSearch.fulfilled, (state, action) => {
        state.users = action.payload.user;
      });
  },
});

// Export Selector
export const getAllUsersData = (state) => state.users;

// Actions
export const { setMessageEmpty } = userSlice.actions;

// exports
export default userSlice.reducer;
