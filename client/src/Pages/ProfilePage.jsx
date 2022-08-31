import React from "react";
import { useEffect, useState } from "react";
import { getUser } from "./../Services/Services";

import { Avatar, Container, Title } from "@mantine/core";

import UserTabs from "../Components/User/UserTabs";
import { useSelector } from "react-redux";

function ProfilePage() {
  const auth = useSelector((state) => state.auth);

  const [user, setUser] = useState();
  const { username } = auth.user
  const fetchUser = async () => {
    try {
      const response = await getUser(username);
      setUser(response.data.user);
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };
  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line
  }, []);

  if (!user) return <>Loading...</>;
  return (
    <>
      <Container size="600px" m="0">
        <section style={{ width: "600px" }}>
          <Avatar
            src={"http://localhost:5000/uploads/" + user.avatar}
            size="xl"
            radius="50%"
          />
          <Title>{user.username}</Title>
        </section>
        <UserTabs user={user} />
      </Container>
    </>
  );
}

export default ProfilePage;
