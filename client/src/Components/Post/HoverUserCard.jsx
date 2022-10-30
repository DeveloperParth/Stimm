import { Avatar,  Group, Loader, Text } from "@mantine/core";
import React,{ useState, useEffect } from "react";
import { getUser } from "../../Services/Services";

function HoverUserCard({ username }) {
  const [user, setUser] = useState(null);
  const f = async () => {
    console.log("req sent");
    const r = await getUser(username);
    setUser(r.data.user);
  };
  useEffect(() => {
    f();
    // eslint-disable-next-line
  }, [username]);
  if (!user) return <Loader />;
  return (
    <>
      <Group>
        <Avatar src={process.env.REACT_APP_UPLOADS_PATH + user.avatar} />
        <div>
          <Group spacing={5}>
            <Text>{user.name}</Text>
            <Text size="xs">@{user.username}</Text>
          </Group>
          <Group>
            <Text>Posts {user.posts || 0}</Text>
            <Text>Followers {user.followers || 0}</Text>
            <Text>Followings {user.following || 0}</Text>
          </Group>
        </div>
      </Group>
    </>
  );
}

export default HoverUserCard;