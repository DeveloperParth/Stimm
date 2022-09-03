import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Tabs } from "@mantine/core";
import UserPosts from "./UserPosts";
import UserComments from "./UserComments";
import UserLikes from "./UserLikes";

function UserTabs({ user }) {
  const navigate = useNavigate();
  const { username, tabValue } = useParams();
  return (
    <>
      <Tabs
        defaultValue="posts"
        value={tabValue}
        onTabChange={(value) => navigate(`/u/${username}/${value}`)}
      >
        <Tabs.List grow>
          <Tabs.Tab value="posts">Posts</Tabs.Tab>
          <Tabs.Tab value="replies">Replies</Tabs.Tab>
          <Tabs.Tab value="likes">Likes</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="posts" pt="xs">
          <UserPosts user={user} />
        </Tabs.Panel>

        <Tabs.Panel value="replies" pt="xs">
          <UserComments user={user} />
        </Tabs.Panel>

        <Tabs.Panel value="likes" pt="xs">
          <UserLikes user={user} />
        </Tabs.Panel>
      </Tabs>
    </>
  );
}

export default UserTabs;
