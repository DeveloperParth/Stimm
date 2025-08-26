import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";

import {
  ActionIcon,
  Avatar,
  Box,
  Container,
  Group,
  Stack,
  TextInput,
} from "@mantine/core";

import API from "./../Services/API";
import Header from "./../Components/Navigations/Header";
import { useParams } from "react-router-dom";
import { getConverstionName } from "../Services/Services";
import { socket } from "../App";
import { IconSend, IconPhone } from "@tabler/icons";
import VoiceCallModal from "../Components/VoiceCall/VoiceCallModal";
import { showNotification } from "@mantine/notifications";

function MessagePage() {
  const [messages, setMessages] = useState(null);
  const [converstion, setConverstion] = useState(null);
  const [showCallModal, setShowCallModal] = useState(false);
  const [incomingCallData, setIncomingCallData] = useState(null);
  const [isIncomingCall, setIsIncomingCall] = useState(false);
  const { _id, username, avatar } = useSelector((state) => state.auth.user);
  const lastMessageRef = useRef(null);
  const params = useParams();
  const submitHandler = async (e) => {
    e.preventDefault();
    const message = e.target.message.value;
    e.target.message.value = "";
    await API.post(`/converstion/${params.id}/message`, { message });
    setMessages((m) => [
      ...m,
      {
        sender: { _id, username, avatar },
        converstion: converstion._id,
        message,
      },
    ]);
  };

  const startVoiceCall = () => {
    if (converstion && converstion.users.length === 2) {
      const otherUser = converstion.users.find(user => user._id !== _id);
      
      if (otherUser) {
        const callData = {
          conversationId: converstion._id,
          otherUserId: otherUser._id,
          otherUser: otherUser
        };
        
        setIncomingCallData(callData);
        setIsIncomingCall(false);
        setShowCallModal(true);
      }
    } else {
      showNotification({
        title: "Voice calls are only available in direct messages",
        color: "yellow"
      });
    }
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
      }
    });

    // Voice call event listeners
    socket.on("call-offer", ({ from, offer, conversationId }) => {
      if (conversationId === params.id) {
        // Find the caller info from conversation
        const otherUser = converstion?.users?.find(user => user._id === from);
        if (otherUser) {
          const callData = {
            conversationId,
            otherUserId: from,
            otherUser,
            offer
          };
          
          setIncomingCallData(callData);
          setIsIncomingCall(true);
          setShowCallModal(true);
          
          showNotification({
            title: `Incoming call from ${otherUser.username}`,
            color: "blue"
          });
        }
      }
    });

    return () => {
      socket.off("message");
      socket.off("call-offer");
    };
    // eslint-disable-next-line
  }, [socket, params.id, converstion]);
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
      <VoiceCallModal 
        isOpen={showCallModal}
        onClose={() => {
          setShowCallModal(false);
          setIncomingCallData(null);
          setIsIncomingCall(false);
        }}
        callData={incomingCallData}
        currentUserId={_id}
        isIncoming={isIncomingCall}
      />
      <Container size="600px">
        <Group position="apart" mb="md">
          <Header title={getConverstionName(converstion, _id)} showGoBackButton />
          {converstion.users.length === 2 && (
            <ActionIcon 
              size="lg" 
              color="blue" 
              variant="light"
              onClick={startVoiceCall}
            >
              <IconPhone size={20} />
            </ActionIcon>
          )}
        </Group>
        <Stack sx={{ height: "100%" }}>
          <Stack sx={{ flex: "1 1" }}>
            {messages &&
              messages.map((m) => {
                return (
                  <>
                    <Box
                      sx={(theme) => ({
                        alignSelf:
                          m.sender._id === _id ? "flex-end" : "flex-start",
                        maxWidth: "70%",
                        display: "flex",
                        gap: ".5rem",
                        alignItems: "center",
                      })}
                    >
                      {converstion.users?.length > 2 &&
                        m.sender._id !== _id && (
                          <Avatar
                            radius="50%"
                            src={
                              process.env.REACT_APP_UPLOADS_PATH +
                              m.sender.avatar
                            }
                          />
                        )}
                      <Box
                        ref={lastMessageRef}
                        sx={(theme) => ({
                          alignSelf:
                            m.sender._id === _id ? "flex-end" : "flex-start",
                          padding: theme.spacing.sm,
                          borderRadius:
                            m.sender._id === _id
                              ? "10px 10px 0 10px"
                              : "10px 10px 10px 0",
                          background:
                            (m.sender._id !== _id &&
                              theme.colorScheme === "dark" &&
                              theme.black) ||
                            (m.sender._id !== _id &&
                              theme.colorScheme === "light" &&
                              theme.colors.gray[2]),
                          border:
                            m.sender._id === _id &&
                            `1px solid ${
                              theme.colorScheme === "dark"
                                ? theme.colors.dark[5]
                                : theme.colors.gray[2]
                            }`,
                        })}
                      >
                        {m.message}
                      </Box>
                    </Box>
                  </>
                );
              })}
            <div ref={lastMessageRef}></div>
          </Stack>
          <Box
            sx={(theme) => ({
              width: "100%",
              position: "sticky",
              maxWidth: 568,
              padding: "1rem",
              bottom: 0,
              [`@media (max-width: ${theme.breakpoints.xs}px)`]: {
                bottom: 60,
              },
              background:
                theme.colorScheme === "dark" ? theme.colors.dark[7] : "white",
            })}
          >
            <form onSubmit={submitHandler}>
              <Group noWrap>
                <Box sx={{ width: "100%" }}>
                  <TextInput name="message" placeholder="Type a message..." />
                </Box>
                <ActionIcon type="submit">
                  <IconSend />
                </ActionIcon>
              </Group>
            </form>
          </Box>
        </Stack>
      </Container>
    </>
  );
}

export default MessagePage;
