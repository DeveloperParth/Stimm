import { Grid } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { getUserPosts } from "../../Services/Services";

import Post from '../Post/Post'
 
function UserPosts({ user }) {
  const [posts, setPosts] = useState();

  const fetchUserPosts = async () => {
    try {
      const response = await getUserPosts(user._id);
      setPosts(response.data.posts);
      console.log(posts);
    } catch (error) {
      alert(error.message);
    }
  };
  useEffect(() => {
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
