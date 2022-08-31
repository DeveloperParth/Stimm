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
        await localStorage.setItem('token', response.data.user.token)
        await localStorage.setItem('user', JSON.stringify(response.data.user))
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
        },
        setUser: (state, { payload }) => {
            localStorage.setItem('token', payload.user.token)
            localStorage.setItem('user', JSON.stringify(payload.user))
            state.loading = false
            state.token = payload.user.token
            state.user = payload.user
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
            state.error = action.error
        })
    }
})

export default authSlice.reducer
export const { logout, setUser } = authSlice.actions