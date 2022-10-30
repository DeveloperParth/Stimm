import { Anchor, Box, Grid, Loader } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserComments } from "../../Services/Services";

function UserComments({ user }) {
  const [comments, setcomments] = useState(null);

  const fetchUsercomments = async () => {
    try {
      const response = await getUserComments(user._id);
      setcomments(response.data.comments);
    } catch (error) {
      alert(error.message);
    }
  };
  useEffect(() => {
    fetchUsercomments();
    // eslint-disable-next-line
  }, []);
  if (!comments) return <Loader />;
  return (
    <>
      <Grid>
        {comments.length ? (
          comments.map((c, i) => (
            <Grid.Col
              span={12}
              sx={(theme) => ({
                borderBottom: `1px solid ${
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[4]
                    : theme.colors.gray[2]
                }`,
              })}
            >
              <UserComment comment={c} />
            </Grid.Col>
          ))
        ) : (
          <Grid.Col span={12}>No comments</Grid.Col>
        )}
      </Grid>
    </>
  );
}
const UserComment = ({ comment }) => {
  return (
    <>
      <div>
        <Box mb={8} sx={{color: 'GrayText'}}>
          Replyed to{" "}
          <Anchor component={Link} to={"/u/" + comment.post?.author.username}>
            {comment.post?.author.username}
          </Anchor>{" "}
          on post{" "}
          <Anchor component={Link} to={"/p/" + comment.post?._id}>
            {comment.post?.body}{" "}
          </Anchor>
        </Box>
        <Box sx={(theme) => ({})}>{comment.body}</Box>
      </div>
    </>
  );
};

export default UserComments;
