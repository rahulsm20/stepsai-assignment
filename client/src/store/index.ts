import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import conversationSlice from "./conversationSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    conversationData: conversationSlice,
  },
});

export default store;
