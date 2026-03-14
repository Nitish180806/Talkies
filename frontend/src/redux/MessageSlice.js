import { createSlice } from "@reduxjs/toolkit";

const MessageSlice = createSlice({
  name: "message",
  initialState: {
    messages: [],
  },
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      const incoming = action.payload;
      const msg = incoming?.messageData ? incoming.messageData : incoming;

      if (msg && msg.createdAt) {
        try {
          msg.createdAt = new Date(msg.createdAt).toISOString();
        } catch (e) {}
      } else if (msg && !msg.createdAt) {
        msg.createdAt = new Date().toISOString();
      }

      state.messages.push(msg);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
});

export const { setMessages, addMessage, clearMessages } = MessageSlice.actions;
export default MessageSlice.reducer;
