import { Grid, Loader } from "@mantine/core";
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
                background: i % 2 ? theme.colors.dark[7] : theme.colors.dark[9],
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
        <div className="post-details">
          Replyed to{" "}
          <Link to={"/u/" + comment.post.author.username}>
            {comment.post.author.username}
          </Link>{" "}
          on post{" "}
          <Link to={"/p/" + comment.post._id}>{comment.post.body} </Link>
        </div>
        <hr />
        <div className="comment">{comment.body}</div>
      </div>
    </>
  );
};

export default UserComments;
