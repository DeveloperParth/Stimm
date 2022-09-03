import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    selectedUser: null,
    messages: []
}

const messageSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload.user
        },
        addMessage: (state, action) => {
            state.messages.push(action.payload)
        }
    },
})

export default messageSlice.reducer
export const { setSelectedUser, addMessage } = messageSlice.actions