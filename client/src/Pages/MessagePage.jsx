import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";

import { Box, Container, Stack, TextInput } from "@mantine/core";

import API from "./../Services/API";
import Header from "./../Components/Navigations/Header";
import { useParams } from "react-router-dom";
import { getConverstionName } from "../Services/Services";
import { socket } from "../App";
import { showNotification } from "@mantine/notifications";

function MessagePage() {
  const [messages, setMessages] = useState(null);
  const [converstion, setConverstion] = useState(null);
  const { _id } = useSelector((state) => state.auth.user);
  const lastMessageRef = useRef(null);
  const params = useParams();
  const submitHandler = async (e) => {
    e.preventDefault();
    const message = e.target.message.value;
    e.target.message.value = "";
    await API.post(`/converstion/${params.id}/message`, { message });
    setMessages((m) => [
      ...m,
      { sender: _id, converstion: converstion._id, message },
    ]);
  };

  useEffect(() => {
    (async () => {
      const { data } = await API.get(`/converstion/${params.id}/messages`);
      setMessages(data.messages);
      setConverstion(data.converstion);
    })();
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    socket.on("message", (message) => {
      if (message.converstion === params.id) {
        setMessages((m) => [...m, message]);
      } else {
        showNotification({ title: "New message" });
      }
    });

    return () => {
      socket.off("message");
    };
    // eslint-disable-next-line
  }, [socket]);
  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "start",
    });
    // eslint-disable-next-line
  }, [messages]);

  if (!converstion) return <Container size="600px">Loading ...</Container>;
  return (
    <>
      <Container size="600px">
        <Header title={getConverstionName(converstion, _id)} />
        <Stack sx={{}}>
          {messages &&
            messages.map((m) => {
              return (
                <Box
                  ref={lastMessageRef}
                  sx={(theme) => ({
                    alignSelf: m.sender === _id ? "flex-end" : "flex-start",
                    padding: theme.spacing.sm,
                    borderRadius:
                      m.sender === _id
                        ? "10px 10px 0 10px"
                        : "10px 10px 10px 0",
                    background: m.sender !== _id && theme.black,
                    border:
                      m.sender === _id &&
                      `1px solid ${
                        theme.colorScheme === "dark"
                          ? theme.colors.dark[5]
                          : theme.colors.gray[2]
                      }`,
                    maxWidth: "70%",
                  })}
                >
                  {m.message}
                </Box>
              );
            })}
          <Box
            sx={(theme) => ({
              position: "sticky",
              width: "100%",
              bottom: "0",
              padding: "1rem",
              background:
                theme.colorScheme === "dark" ? theme.colors.dark[9] : null,
            })}
          >
            <form onSubmit={submitHandler}>
              <TextInput name="message" />
            </form>
          </Box>
        </Stack>
      </Container>
    </>
  );
}

export default MessagePage;
