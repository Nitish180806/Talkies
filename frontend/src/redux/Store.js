import { configureStore } from "@reduxjs/toolkit";
import UserSlice from "./UserSlice.js";
import MessageSlice from "./MessageSlice.js";
import StatusSlice from "./StatusSlice.js";

export const Store = configureStore({
  reducer: {
    user: UserSlice,
    message: MessageSlice,
    status: StatusSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["user/setSocket"],
        ignoredPaths: ["user.socket"],
      },
    }),
});
