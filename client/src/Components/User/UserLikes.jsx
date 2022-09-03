import { Grid } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserLikes } from "../../Services/Services";

function UserLikes({ user }) {
  const [likes, setLikes] = useState();

  const fetchUserLikes = async () => {
    try {
      const { data } = await getUserLikes(user._id);
      console.log(data);
      setLikes(data.likes);
    } catch (error) {
      alert(error.message);
    }
  };
  useEffect(() => {
    fetchUserLikes();
    // eslint-disable-next-line
  }, []);
  return (
    <>
      <Grid>
        {likes &&
          likes.map((c, i) => (
            <Grid.Col
              span={12}
              sx={(theme) => ({
                background: i % 2 ? theme.colors.dark[7] : theme.colors.dark[9],
              })}
            >
              <UserLike like={c} />
            </Grid.Col>
          ))}
      </Grid>
    </>
  );
}
const UserLike = ({ like }) => {
  return (
    <>
      <div>
        <div className="post-details">
          <Link to={"/u/" + like.post.body}>{like.post.author.username}</Link>{" "}
          On post <Link to={"/p/" + like.post._id}>{like.post.body} </Link>
        </div>
      </div>
    </>
  );
};

export default UserLikes;
