import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getFeed } from "../../Services/Services";

const initialState = {
  posts: [],
  loading: false,
  error: "",
  count: 0,
};

export const fetchFeed = createAsyncThunk("feed/feed", async (page) => {
  const response = await getFeed(page);
  return { ...response.data, page };
});

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    clearFeed: (state) => {
      state.loading = false;
      state.posts = [];
      state.error = "";
    },
    setPostBookmark: (state, { payload }) => {
      state.posts[payload.index] = payload.post;
    },
    setPostLike: (state, { payload }) => {
      state.posts[payload.index] = payload.post;
    },
    removePost: (state, { payload }) => {
      state.posts.splice(payload.index, 1);
    },
    addOwnPost: (state, { payload }) => {
      const post = payload.post;
      post.author = payload.author;
      state.posts = [post, ...state.posts];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchFeed.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchFeed.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.posts =
        payload.page === 1 ? payload.posts : state.posts.concat(payload.posts);
      state.count = payload.count;
    });
    builder.addCase(fetchFeed.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export default feedSlice.reducer;
export const {
  clearFeed,
  setPostLike,
  addOwnPost,
  removePost,
  setPostBookmark,
} = feedSlice.actions;
