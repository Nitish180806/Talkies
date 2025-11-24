import { createSlice } from "@reduxjs/toolkit";

const MessageSlice = createSlice({
  name: "message",
  initialState: {
    messages: []
  },
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    // NEW: push a single message (keeps reducer logic safe)
    addMessage: (state, action) => {
      // ensure message is not nested { messageData: {...} }
      const incoming = action.payload;
      const msg = incoming?.messageData ? incoming.messageData : incoming;

      // normalize createdAt to ISO string if present
      if (msg && msg.createdAt) {
        try {
          msg.createdAt = new Date(msg.createdAt).toISOString();
        } catch (e) {
          // fallback: leave as-is
        }
      } else if (msg && !msg.createdAt) {
        // If createdAt missing, set client time as fallback
        msg.createdAt = new Date().toISOString();
      }

      state.messages.push(msg);
    },
    // If you ever need to reset
    clearMessages: (state) => {
      state.messages = [];
    }
  },
});

export const { setMessages, addMessage, clearMessages } = MessageSlice.actions;
export default MessageSlice.reducer;
