import React from "react";
import Post from "./../Components/Post";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchFeed } from "../Redux/Features/feedSlice";
import { useState } from "react";
import { ActionIcon } from "@mantine/core";
import { IconPlus } from "@tabler/icons";
import CreatePost from "../Components/CreatePost";

function HomePage() {
  const dispatch = useDispatch();
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const feed = useSelector((state) => state.feed);
  const auth = useSelector((state) => state.auth);
  useEffect(() => {
    dispatch(fetchFeed());
  }, [dispatch]);
  const mappedPosts = feed.posts.map((post, i) => {
    if (post.author._id === auth.user?._id) {
      return (
        <Post post={{ ...post, isOwner: true }} index={i} key={post._id} />
      );
    }
    return <Post post={post} index={i} key={post._id} />;
  });
  if (feed.loading) return <>Loading...</>;
  return (
    <>
      <CreatePost opened={isCreatePostOpen} setOpened={setIsCreatePostOpen} />
      <div className="feed">
        <div className="feed__header">
          <h2>Home</h2>
          <div style={{ width: "80%" }}></div>
          <ActionIcon
            variant="filled"
            size="md"
            onClick={() => setIsCreatePostOpen(true)}
          >
            <IconPlus />
          </ActionIcon>
        </div>
        {mappedPosts}
      </div>
    </>
  );
}

export default HomePage;
