import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./Features/authSlice";
import feedSlice from "./Features/feedSlice";
import notificationSlice from "./Features/notificationSlice";

const store = configureStore({
    reducer: {
        auth: authSlice,
        feed: feedSlice,
        notification: notificationSlice
    }
})

export default store