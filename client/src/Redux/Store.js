import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./Features/authSlice";
import feedSlice from "./Features/feedSlice";
import messageSlice from "./Features/messageSlice";

const store = configureStore({
    reducer: {
        auth: authSlice,
        feed: feedSlice,
        message: messageSlice
    }
})

export default store