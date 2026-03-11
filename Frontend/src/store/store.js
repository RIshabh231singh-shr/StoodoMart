import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../Authslice";
import cartReducer from "../CartSlice";
import collegeReducer from "../CollegeSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer,
        college: collegeReducer,
    },
});