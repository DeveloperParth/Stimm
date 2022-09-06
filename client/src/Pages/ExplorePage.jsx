import {
  Box,
  Center,
  Container,
  Loader,
  Tabs,
  Text,
  Title,
} from "@mantine/core";
import { IconBlockquote, IconHash } from "@tabler/icons";
import React, { useState, useEffect } from "react";
import Header from "../Components/Navigations/Header";
import Post from "../Components/Post/Post";
import { getTags, getTrandingPosts } from "../Services/Services";

function ExplorePage() {
  const [posts, setPosts] = useState(null);
  const [tags, setTags] = useState(null);
  const [activeTab, setActiveTab] = useState("hashtags");
  const fetchPosts = async () => {
    const { data } = await getTrandingPosts();
    setPosts(data.posts);
  };
  const fetchTags = async () => {
    const { data } = await getTags();
    setTags(data.tags);
  };
  useEffect(() => {
    activeTab === "hashtags" && fetchTags();
    activeTab === "posts" && fetchPosts();
    // eslint-disable-next-line
  }, [activeTab]);
  return (
    <>
      <Container size="600px">
        <Header title={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}/>
        <Tabs
          defaultValue="hashtags"
          value={activeTab}
          onTabChange={setActiveTab}
        >
          <Tabs.List grow>
            <Tabs.Tab value="hashtags" icon={<IconHash size={14} />}>
              Hashtags
            </Tabs.Tab>
            <Tabs.Tab value="posts" icon={<IconBlockquote size={14} />}>
              Posts
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="hashtags">
            {!tags && <Loader />}
            {tags &&
              tags.map((tag) => {
                return (
                  <Box
                    key={tag._id}
                    sx={(theme) => ({
                      borderBottom: `1px solid ${
                        theme.colorScheme === "dark"
                          ? theme.colors.dark[4]
                          : theme.colors.gray[2]
                      }`,
                      padding: theme.spacing.md,
                      cursor: "pointer",
                    })}
                  >
                    <Title order={4}>{tag.tag}</Title>
                    <Text size="sm" color="dimmed">
                      {tag.postsCount} total posts
                    </Text>
                  </Box>
                );
              })}
          </Tabs.Panel>
          <Tabs.Panel value="posts">
            {!posts && <Loader />}
            {!posts?.length && (
              <Center>
                <Title order={4}>No posts created in last 24 hours</Title>
              </Center>
            )}
            {posts &&
              posts.map((p, i) => <Post post={p} key={p._id} index={i} />)}
          </Tabs.Panel>
        </Tabs>
      </Container>
    </>
  );
}

export default ExplorePage;
