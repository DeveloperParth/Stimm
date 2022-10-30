import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    count: 0
}

const notificationSlice = createSlice({
    name: 'feed',
    initialState,
    reducers: {
        setNotificationCount: (state, action) => {
            state.count = action.payload
        },
        addToNotification: (state) => {
            state.count++
        }
    },
})

export default notificationSlice.reducer
export const { setNotificationCount, addToNotification } = notificationSlice.actions