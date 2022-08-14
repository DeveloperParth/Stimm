import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { loginUser } from '../../Services/Services'

const initialState = {
    loading: false,
    token: localStorage.getItem('token') || '',
    user: JSON.parse(localStorage.getItem('user')) || undefined,
    error: ''
}

export const login = createAsyncThunk(
    'auth/login',
    async (body) => {
        const response = await loginUser(body)
        localStorage.setItem('token', response.data.user.token)
        localStorage.setItem('user',JSON.stringify(response.data.user))
        return response.data
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            state.loading = false
            state.token = ''
            state.user = undefined
        }
    },
    extraReducers: (builder) => {
        builder.addCase(login.pending, (state, action) => {
            state.loading = true
        })
        builder.addCase(login.fulfilled, (state, action) => {
            state.loading = false
            state.token = action.payload.user.token
            state.user = action.payload.user
        })
        builder.addCase(login.rejected, (state, action) => {
            state.loading = false
            state.error = action.error.message
        })
    }
})

export default authSlice.reducer
export const { logout } = authSlice.actions