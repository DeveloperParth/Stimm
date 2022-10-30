import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getUser,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
} from "./../Services/Services";

import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Center,
  Container,
  Group,
  Loader,
  Modal,
  Text,
  Title,
} from "@mantine/core";
import { openModal } from "@mantine/modals";
import { IconArrowLeft } from "@tabler/icons";

import { useDispatch, useSelector } from "react-redux";
import { fetchFeed } from "../Redux/Features/feedSlice";

import UserTabs from "../Components/User/UserTabs";

function UserPage() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState(null);
  const [isFollowingLoading, setIsFollowingLoading] = useState(false);
  const [followUserModal, setFollowUserModal] = useState(null);
  const { username } = useParams();
  const { user: loggedUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fetchUser = async () => {
    try {
      const response = await getUser(username);
      setUser(response.data.user);
    } catch (error) {
      alert(error.message);
    }
  };
  const fetchFollowers = async () => {
    const { data } = await getFollowers(user._id);
    setUsers(data.followers);
  };
  const fetchFollowing = async () => {
    const { data } = await getFollowing(user._id);
    setUsers(data.following);
  };
  const followUserHandler = async () => {
    if (!loggedUser)
      return openModal({
        title: `Login to follow ${user.username}`,
        children: (
          <>
            <Button
              fullWidth
              radius="lg"
              mb={10}
              onClick={() => navigate("/login", { state: {} })}
            >
              Login
            </Button>
            <Button
              fullWidth
              radius="lg"
              variant="outline"
              onClick={() => navigate("/login", { state: {} })}
            >
              Signup
            </Button>
          </>
        ),
      });
    setIsFollowingLoading(true);
    if (user.followFlag) {
      await unfollowUser(user._id);
      setIsFollowingLoading(false);
      dispatch(fetchFeed);
      return setUser({ ...user, followFlag: false });
    }
    await followUser(user._id);
    setIsFollowingLoading(false);
    dispatch(fetchFeed);
    return setUser({ ...user, followFlag: true });
  };
  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    followUserModal === "followers" && fetchFollowers();
    followUserModal === "following" && fetchFollowing();

    // eslint-disable-next-line
  }, [followUserModal]);

  return (
    <>
      <Modal
        opened={followUserModal}
        onClose={() => {
          setFollowUserModal(null);
          setUsers(null);
        }}
      >
        <Title order={4} mb="sm">
          {followUserModal} of {user?.username}
        </Title>
        {!users && <Loader />}
        {users &&
          users.map((user) => {
            return followUserModal == "followers" ? (
              <Box mb="md" sx={{ cursor: "pointer" }}>
                <Group>
                  <Avatar
                    src={
                      process.env.REACT_APP_UPLOADS_PATH + user.follower.avatar
                    }
                    radius="50%"
                  />
                  <Text>{user.follower.name}</Text>
                </Group>
              </Box>
            ) : (
              <Box mb="md" sx={{ cursor: "pointer" }}>
                <Group>
                  <Avatar
                    src={process.env.REACT_APP_UPLOADS_PATH + user.user.avatar}
                    radius="50%"
                  />
                  <Text>{user.user.name}</Text>
                </Group>
              </Box>
            );
          })}
      </Modal>
      <Container size="600px" m="0">
        {user ? (
          <>
            <Box
              sx={(theme) => ({
                paddingLeft: theme.spacing.xs,
                paddingRight: theme.spacing.xs,
                paddingBottom: 15,
                paddingTop: 15,
                background: theme.colors.dark[7],
                height: "70px",
                position: "sticky",
                top: 0,
                zIndex: 111,
                display: "flex",
                justifyContent: "space-between",
              })}
            >
              <Group align="center" position="left" m="0">
                <ActionIcon onClick={() => navigate(-1)}>
                  <IconArrowLeft />
                </ActionIcon>
                <Title order={4}>{user.username}</Title>
              </Group>
              {loggedUser?._id !== user._id ? (
                <Button
                  variant="subtle"
                  onClick={followUserHandler}
                  loading={isFollowingLoading}
                  disabled={isFollowingLoading}
                >
                  {user.followFlag ? "Following" : "Follow"}
                </Button>
              ) : (
                <Button variant="subtle" onClick={() => navigate("/settings")}>
                  Edit Profile
                </Button>
              )}
            </Box>
            <Box
              sx={(theme) => ({
                paddingLeft: theme.spacing.xs,
                paddingRight: theme.spacing.xs,
              })}
            >
              <Group align="center">
                <Avatar
                  src={process.env.REACT_APP_UPLOADS_PATH + user.avatar}
                  size="xl"
                  radius="50%"
                />
                <div>
                  <Group>
                    <Text
                      color="dimmed"
                      underline
                      sx={{ cursor: "pointer" }}
                      onClick={() => setFollowUserModal("followers")}
                    >
                      {user.followers ?? 0} Followers
                    </Text>
                    <Text
                      color="dimmed"
                      underline
                      sx={{ cursor: "pointer" }}
                      onClick={() => setFollowUserModal("following")}
                    >
                      {user.following ?? 0} Following
                    </Text>
                  </Group>
                  <div>
                    <Text size="sm">{user.bio}</Text>
                  </div>
                </div>
              </Group>

              <UserTabs user={user} />
            </Box>
          </>
        ) : (
          <Center>
            <Loader />
          </Center>
        )}
      </Container>
    </>
  );
}

export default UserPage;
