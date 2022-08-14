import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getFeed } from '../../Services/Services'

const initialState = {
    posts: [],
    loading: false,
    error: ''
}

export const fetchFeed = createAsyncThunk(
    'feed/feed',
    async (offset, i) => {
        const response = await getFeed(offset)
        return response.data
    }
)

const feedSlice = createSlice({
    name: 'feed',
    initialState,
    reducers: {
        clearFeed: (state) => {
            state.loading = false
            state.posts = []
            state.error = ''
        },
        setPostLike: (state, { payload }) => {
            state.posts[payload.index] = payload.post
        },
        removePost: (state, { payload }) => {
            console.log(payload);
            state.posts.splice(payload.index, 1)
        },
        addOwnPost: (state, { payload }) => {
            const post = payload.post
            post.author = payload.author
            state.posts = [post, ...state.posts]
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchFeed.pending, (state, action) => {
            state.loading = true
        })
        builder.addCase(fetchFeed.fulfilled, (state, action) => {
            state.loading = false
            state.posts = action.payload.posts
        })
        builder.addCase(fetchFeed.rejected, (state, action) => {
            state.loading = false
            state.error = action.error.message
        })
    }
})

export default feedSlice.reducer
export const { clearFeed, setPostLike, addOwnPost, removePost } = feedSlice.actions