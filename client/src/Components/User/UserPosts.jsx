import { Grid } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { getUserPosts } from "../../Services/Services";

import Post from "../Post/Post";

function UserPosts({ user }) {
  const [posts, setPosts] = useState(null);

  const fetchUserPosts = async () => {
    try {
      const { data } = await getUserPosts(user._id);
      setPosts(data.posts);
      console.log(posts);
    } catch (error) {
      alert(error.message);
    }
  };
  useEffect(() => {
    console.log('eff');
    fetchUserPosts();
    // eslint-disable-next-line
  }, []);
  return (
    <>
      <Grid>
        {posts &&
          posts.map((p) => (
            <Grid.Col span={12}>
              <Post post={p} key={p._id} />
            </Grid.Col>
          ))}
      </Grid>
    </>
  );
}

export default UserPosts;
