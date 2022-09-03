import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Box, Container, Stack, TextInput } from "@mantine/core";

import { setSelectedUser, addMessage } from "../Redux/Features/messageSlice";
import API from "./../Services/API";
import Header from "./../Components/Navigations/Header";

function MessagesPage() {
  const { selectedUser, messages } = useSelector((state) => state.message);
  const [users, setUsers] = useState(null);
  const { _id } = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const select = (user) => {
    dispatch(setSelectedUser({ user }));
  };
  const submitHandler = (e) => {
    e.preventDefault();
    const message = e.target.message.value;
    e.target.message.value = "";
    dispatch(addMessage({ message, sender: _id, reciver: selectedUser }));
  };
  useEffect(() => {
    (async () => {
      const { data } = await API.get("/user/all");
      console.log(data);
      setUsers(data.users);
    })();
  }, []);

  const mappedUsers =
    users &&
    users.map((user) => {
      return (
        <div>
          <span>{user.username}</span>
          <button onClick={() => select(user)}>Select</button>
        </div>
      );
    });
  return (
    <>
      <Container size="600px">
        {!selectedUser ? mappedUsers : <Header title={selectedUser.username} showGoBackButton/>}
        <Stack>
          {messages.map((m) => {
            return (
              <Box
                sx={(theme) => ({
                  alignSelf: m.sender === _id ? "flex-end" : "flex-start",
                  padding: theme.spacing.sm,
                  borderRadius:
                    m.sender === _id ? "10px 10px 0 10px" : "10px 10px 10px 0",
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
        </Stack>
        <Box
          sx={(theme) => ({
            position: "sticky",
            width: "100%",
            bottom: "0",
            padding: "1rem",
            background:
              theme.colorScheme === "dark" ? theme.colors.dark[7] : null,
          })}
        >
          <form onSubmit={submitHandler}>
            <TextInput name="message" />
          </form>
        </Box>
      </Container>
    </>
  );
}

export default MessagesPage;
