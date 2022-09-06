import React, { useEffect, useState } from "react";

import { Avatar, Box, Container, Group, Text } from "@mantine/core";

import API from "./../Services/API";
import Header from "./../Components/Navigations/Header";
import { getConverstionAvatar, getConverstionName } from "../Services/Services";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function MessagesPage() {
  const navigate = useNavigate();
  const [converstions, setConverstions] = useState(null);
  const { _id } = useSelector((state) => state.auth.user);

  useEffect(() => {
    (async () => {
      const { data } = await API.get("/converstion/all");
      setConverstions(data.converstions);
    })();
  }, []);

  const mappedConverstions =
    converstions &&
    converstions.map((c) => {
      return (
        <Box
          onClick={() => navigate(`/messages/${c._id}`)}
          sx={(theme) => ({
            padding: theme.spacing.md,
            borderBottom: `1px solid ${
              theme.colorScheme === "dark"
                ? theme.colors.dark[4]
                : theme.colors.gray[2]
            }`,
          })}
        >
          <Group>
            <Avatar
              radius="xl"
              src={
                process.env.REACT_APP_UPLOADS_PATH +
                getConverstionAvatar(c, _id)
              }
            />
            <Text>{getConverstionName(c, _id)}</Text>
          </Group>
        </Box>
      );
    });
  return (
    <>
      <Container size="600px">
        <Header title="Messages" />
        {mappedConverstions}
      </Container>
    </>
  );
}

export default MessagesPage;
