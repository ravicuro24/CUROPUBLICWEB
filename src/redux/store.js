// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import addressReducer from "./features/addressSlice";

export const store = configureStore({
  reducer: {
    address: addressReducer,
  },
});
