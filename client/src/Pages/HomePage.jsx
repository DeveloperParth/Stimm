import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { fetchFeed } from "../Redux/Features/feedSlice";

import Post from "./../Components/Post/Post";

import { Container, Loader } from "@mantine/core";
import Header from "../Components/Navigations/Header";

function HomePage() {
  const dispatch = useDispatch();
  const feed = useSelector((state) => state.feed);
  const auth = useSelector((state) => state.auth);
  useEffect(() => {
    !feed.posts.length && dispatch(fetchFeed());
    // eslint-disable-next-line
  }, []);
  const mappedPosts = feed.posts.map((post, i) => {
    return (
      <Post
        post={{ ...post, isOwner: post.author._id === auth.user?._id }}
        index={i}
        key={post._id}
      />
    );
  });
  return (
    <>
      <Container size="600px">
        <Header title="Home" showPostButton />
        {feed.loading ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Loader />
          </div>
        ) : (
          mappedPosts
        )}
      </Container>
    </>
  );
}

export default HomePage;
