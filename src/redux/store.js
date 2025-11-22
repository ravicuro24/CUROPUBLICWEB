// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import addressReducer from "./features/addressSlice";
import packagesReducer from "./features/labSilice";

export const store = configureStore({
  reducer: {
    address: addressReducer,
    packages: packagesReducer,
  },
});
