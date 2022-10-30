import React, { useEffect, useState } from "react";

import {
  Avatar,
  Box,
  Button,
  Center,
  Chip,
  Container,
  Divider,
  Group,
  Modal,
  Progress,
  Text,
  TextInput,
  Tooltip,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";

import API from "./../Services/API";
import Header from "./../Components/Navigations/Header";
import {
  createConverstion,
  getConverstionName,
  getFollowers,
  getFollowing,
  getSearch,
} from "../Services/Services";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IconPencil, IconSearch, IconSend } from "@tabler/icons";
import { showNotification } from "@mantine/notifications";

function MessagesPage() {
  const navigate = useNavigate();
  const [converstions, setConverstions] = useState(null);
  const [isStartConverstionOpen, setIsStartConverstionOpen] = useState(false);
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
            {c.users.length !== 2 ? (
              <Avatar.Group spacing="xl">
                {c.users.map((u) => (
                  <Tooltip label={u.username} withArrow>
                    <Avatar
                      src={process.env.REACT_APP_UPLOADS_PATH + u.avatar}
                      radius="50%"
                    />
                  </Tooltip>
                ))}
              </Avatar.Group>
            ) : (
              <Avatar
                radius="xl"
                src={
                  process.env.REACT_APP_UPLOADS_PATH +
                  c.users.find((u) => u._id !== _id).avatar
                }
              />
            )}

            <Text>{getConverstionName(c, _id)}</Text>
          </Group>
        </Box>
      );
    });

  return (
    <>
      <StartConverstion
        open={isStartConverstionOpen}
        setOpen={setIsStartConverstionOpen}
        setConverstions={setConverstions}
        converstions={converstions}
      />
      <Container size="600px">
        <Header title="Messages" />
        {mappedConverstions}
        <UnstyledButton
          onClick={() => setIsStartConverstionOpen(true)}
          sx={(theme) => ({
            position: "fixed",
            bottom: "5%",
            right: "33%",
            background:
              theme.colors[theme.primaryColor][
                theme.primaryShade[theme.colorScheme]
              ],
            height: "3rem",
            width: "3rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "50%",
            ":hover": {
              background:
                theme.colors[theme.primaryColor][
                  theme.primaryShade[theme.colorScheme] - 2
                ],
            },
          })}
        >
          <IconPencil />
        </UnstyledButton>
      </Container>
    </>
  );
}
function StartConverstion({ open, setOpen, converstions, setConverstions }) {
  const theme = useMantineTheme();
  const { _id } = useSelector((state) => state.auth.user);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const fetchFollowers = async () => {
    // const { data } = await getFollowers(_id);
    const { data } = await getFollowing(_id);
    setUsers(data.following);
  };
  const fetchUsers = async () => {
    if (search.length < 2) return;
    const { data } = await getSearch(search);
    setUsers(data.results);
  };
  const startConverstionHandler = async () => {
    const { data } = await createConverstion({ users: [...selectedUsers] });
    setConverstions([...converstions, data.converstion]);
    setSelectedUsers([]);
    showNotification({ title: "Converstion crated" });
    return setOpen(false);
  };
  useEffect(() => {
    fetchFollowers();
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    fetchUsers();
    !search && fetchFollowers();
    // eslint-disable-next-line
  }, [search]);

  const mappedUsers = users?.length ? (
    users.map((u) => {
      const user = u.username ? u : u.follower.username ? u.follower : u.user;
      if (user._id === _id) return <></>;
      return (
        <>
          <Box
            key={user._id}
            my="md"
            sx={(theme) => ({
              cursor: "pointer",
              userSelect: "none",
              padding: theme.spacing.sm,
              borderRadius: 5,
              ":hover": {
                background: theme.colors.dark[theme.primaryShade.dark],
              },
            })}
            onClick={() => {
              const isAlreadyInList = selectedUsers.find(
                (su) => su._id === user._id
              );
              if (isAlreadyInList) {
                setSelectedUsers(
                  selectedUsers.filter((su) => su._id !== user._id)
                );
              } else {
                setSelectedUsers([...selectedUsers, user]);
              }
            }}
          >
            <Group>
              <Avatar
                src={process.env.REACT_APP_UPLOADS_PATH + user.avatar}
                size="50px"
                radius="50%"
              />
              <div>
                <Text>{user.name}</Text>
                <Text color="dimmed">@{user.username}</Text>
              </div>
            </Group>
          </Box>
        </>
      );
    })
  ) : (
    <Center>No results</Center>
  );
  return (
    <Modal
      opened={open}
      onClose={() => {
        setOpen(false);
        setSelectedUsers([]);
      }}
      centered
      title="New message"
    >
      <Group position="apart">
        <TextInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          variant="unstyled"
          icon={
            <IconSearch
              color={
                theme.colors[theme.primaryColor][
                  theme.primaryShade[theme.colorScheme]
                ]
              }
            />
          }
          placeholder="Search..."
        />
        <Button
          compact
          leftIcon={<IconSend />}
          onClick={startConverstionHandler}
        >
          Go
        </Button>
      </Group>
      <Chip.Group
        onChange={(_id) =>
          setSelectedUsers(selectedUsers.filter((su) => su._id !== _id))
        }
      >
        {selectedUsers &&
          selectedUsers.map((u) => (
            <Chip checked value={u._id}>
              {u.username}
            </Chip>
          ))}
      </Chip.Group>
      <Divider />
      {users ? mappedUsers : <Progress value={100} size="xs" animate />}
    </Modal>
  );
}
export default MessagesPage;
