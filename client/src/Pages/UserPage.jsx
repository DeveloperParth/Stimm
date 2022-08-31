import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUser, followUser, unfollowUser } from "./../Services/Services";

import { Avatar, Button, Container, Group, Loader, Title } from "@mantine/core";

import UserTabs from "../Components/User/UserTabs";

function UserPage() {
  const [user, setUser] = useState();
  const [isFollowingLoading, setIsFollowingLoading] = useState(false);
  const { username } = useParams();
  const fetchUser = async () => {
    try {
      const response = await getUser(username);
      setUser(response.data.user);
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };
  const followUserHandler = async () => {
    setIsFollowingLoading(true);
    if (user.followFlag) {
      await unfollowUser(user._id);
      setIsFollowingLoading(false);
      return setUser({ ...user, followFlag: false });
    }
    await followUser(user._id);
    setIsFollowingLoading(false);
    return setUser({ ...user, followFlag: true });
  };
  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line
  }, []);

  if (!user) return <Loader />;
  return (
    <>
      <Container size="600px" m="0">
        <section style={{ width: "600px" }}>
          <Group mb={10}>
            <Avatar
              src={"http://localhost:5000/uploads/" + user.avatar}
              size="xl"
              radius="50%"
            />
            <Title order={2}>{user.username}</Title>
          </Group>
          <Button
            variant="subtle"
            onClick={followUserHandler}
            loading={isFollowingLoading}
            disabled={isFollowingLoading}
          >
            {user.followFlag ? "Following" : "Follow"}
          </Button>
        </section>
        <UserTabs user={user} />
      </Container>
    </>
  );
}

export default UserPage;
