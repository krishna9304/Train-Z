import { configureStore } from "@reduxjs/toolkit";
import userManagementReducer from "./slices/userManagementSlice";
import userReducer from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    userManagement: userManagementReducer,
  },
});
