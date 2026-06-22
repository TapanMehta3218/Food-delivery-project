import { configureStore } from "@reduxjs/toolkit";
import mapSlice from "./mapSlice";
import ownerSlice from "./ownerSlice";
import userSlice from "./userSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    owner: ownerSlice,
    map: mapSlice,
  },
});
