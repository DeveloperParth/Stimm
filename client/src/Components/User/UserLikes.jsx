import { Anchor, Grid } from "@mantine/core";
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
                borderBottom: `1px solid ${
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[4]
                    : theme.colors.gray[2]
                }`,
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
        Liked post{" "}
        <Anchor component={Link} to={"/p/" + like.post._id}>
          {like.post.body}{" "}
        </Anchor>
      </div>
    </>
  );
};

export default UserLikes;
