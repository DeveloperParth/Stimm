import React, { useEffect, useState, useRef, useCallback } from "react";

import { useDispatch, useSelector } from "react-redux";
import { fetchFeed } from "../Redux/Features/feedSlice";

import Post from "./../Components/Post/Post";

import { Center, Container, Loader } from "@mantine/core";
import Header from "../Components/Navigations/Header";
import PostPlaceHolder from "./../Components/Post/PostPlaceHolder";

function HomePage() {
  const dispatch = useDispatch();
  const feed = useSelector((state) => state.feed);
  const auth = useSelector((state) => state.auth);
  const [page, setPage] = useState(1);
  useEffect(() => {
    !feed.posts.length && dispatch(fetchFeed(page));
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    feed.posts.length && dispatch(fetchFeed(page));
    // eslint-disable-next-line
  }, [page]);
  const observer = useRef();
  const lastPostRef = useCallback(
    (node) => {
      if (feed.loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && feed.count > feed.posts.length) {
          setPage((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    // eslint-disable-next-line
    [feed.loading]
  );

  const mappedPosts = feed.posts.map((post, i) => {
    if (feed.posts.length - 1 === i) {
      return (
        <Post
          lastPostRef={lastPostRef}
          post={{ ...post, isOwner: post.author._id === auth.user?._id }}
          index={i}
          key={post._id}
        />
      );
    } else {
      return (
        <Post
          post={{ ...post, isOwner: post.author._id === auth.user?._id }}
          index={i}
          key={post._id}
        />
      );
    }
  });
  return (
    <>
      <Container size="600px">
        <Header title="Home" showPostButton />
        {feed.loading && !feed.posts.length ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Loader />
          </div>
        ) : (
          <div>{mappedPosts}</div>
        )}
        {feed.loading && feed.posts.length && (
          <Center>
            <PostPlaceHolder />
          </Center>
        )}
      </Container>
    </>
  );
}

export default HomePage;
