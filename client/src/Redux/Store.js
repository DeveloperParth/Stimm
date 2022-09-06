import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./Features/authSlice";
import feedSlice from "./Features/feedSlice";

const store = configureStore({
    reducer: {
        auth: authSlice,
        feed: feedSlice,
    }
})

export default store