// redux/Store.js
import { configureStore } from "@reduxjs/toolkit";
import UserSlice from "./UserSlice.js";
import MessageSlice from "./MessageSlice.js";

export const Store = configureStore({
  reducer: {
    user: UserSlice,
    message: MessageSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // ✅ Ignore socket warnings (ye error band ho jayega)
        ignoredActions: ["user/setSocket"],
        ignoredPaths: ["user.socket"],
      },
    }),
});
