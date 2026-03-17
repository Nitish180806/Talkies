// redux/UserSlice.js
import { createSlice } from "@reduxjs/toolkit";

const UserSlice = createSlice({
  name: "User",
  initialState: {
    userData: null,
    otherUsers: [], // ✅ Default empty array
    selectedUser: JSON.parse(localStorage.getItem("selectedUser")) || null,
    socket: null,
    onlineUsers: [], // ✅ Default empty array
  },

  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },

    setOtherUser: (state, action) => {
      // ✅ Always ensure it's an array
      if (!Array.isArray(action.payload)) {
        console.error("❌ setOtherUser: payload is not array", action.payload);
        state.otherUsers = [];
        return;
      }

      state.otherUsers = action.payload.map((user) => ({
        _id: user._id,
        userName: user.userName?.replace(/\s*\(.*?\)\s*$/, "") || "",
        image: user.image || "",
      }));
    },

    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
      if (action.payload) {
        localStorage.setItem("selectedUser", JSON.stringify(action.payload));
      } else {
        localStorage.removeItem("selectedUser");
      }
    },

    setSocket: (state, action) => {
      state.socket = action.payload;
    },

    setOnlineUsers: (state, action) => {
      // ✅ Handle both function and direct value
      if (typeof action.payload === "function") {
        state.onlineUsers = action.payload(state.onlineUsers);
      } else if (Array.isArray(action.payload)) {
        state.onlineUsers = action.payload;
      } else {
        state.onlineUsers = [];
      }
    },
  },
});

export const {
  setUserData,
  setOtherUser,
  setSelectedUser,
  setSocket,
  setOnlineUsers,
} = UserSlice.actions;

export default UserSlice.reducer;