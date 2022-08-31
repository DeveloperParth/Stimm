import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { fetchFeed } from "../Redux/Features/feedSlice";

import Post from "./../Components/Post/Post";
import CreatePost from "../Components/Post/CreatePost";

import {
  ActionIcon,
  Box,
  Container,
  Group,
  Loader,
  Title,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons";
import { Outlet } from "react-router-dom";

function HomePage() {
  const dispatch = useDispatch();
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const feed = useSelector((state) => state.feed);
  const auth = useSelector((state) => state.auth);
  useEffect(() => {
    dispatch(fetchFeed());
  }, [dispatch]);
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
      <CreatePost opened={isCreatePostOpen} setOpened={setIsCreatePostOpen} />
      <Container size="600px" m="0">
        <Box
          sx={(theme) => ({
            paddingLeft: theme.spacing.xs,
            paddingRight: theme.spacing.xs,
            paddingBottom: 15,
            paddingTop: 15,
            borderBottom: `1px solid ${
              theme.colorScheme === "dark"
                ? theme.colors.dark[4]
                : theme.colors.gray[2]
            }`,
          })}
        >
          <Group align="center" position="apart" m="0" px="lg">
            <Title order={2}>Home</Title>
            <ActionIcon
              variant="white"
              color="blue"
              onClick={() => setIsCreatePostOpen(true)}
            >
              <IconPlus size={24} />
            </ActionIcon>
          </Group>
        </Box>
        {feed.loading ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Loader />
          </div>
        ) : (
          mappedPosts
        )}
      </Container>
      <Outlet />
    </>
  );
}

export default HomePage;
