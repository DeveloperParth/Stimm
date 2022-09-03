import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getUser,
  followUser,
  unfollowUser,
  getFollowers,
} from "./../Services/Services";

import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Container,
  Group,
  Loader,
  Modal,
  Text,
  Title,
} from "@mantine/core";

import UserTabs from "../Components/User/UserTabs";
import { useDispatch, useSelector } from "react-redux";
import { fetchFeed } from "../Redux/Features/feedSlice";
import { IconArrowLeft } from "@tabler/icons";

function UserPage() {
  const [user, setUser] = useState();
  const [users, setUsers] = useState(null);
  const [isFollowingLoading, setIsFollowingLoading] = useState(false);
  const [followUserModal, setFollowUserModal] = useState(null);
  const { username } = useParams();
  const { user: loggedUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const fetchUser = async () => {
    try {
      const response = await getUser(username);
      setUser(response.data.user);
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };
  const fetchFollowers = async () => {
    const { data } = await getFollowers(user._id);
    setUsers(data.followers);
  };
  const followUserHandler = async () => {
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
    // eslint-disable-next-line
  }, [followUserModal]);

  if (!user) return <Loader />;
  return (
    <>
      <Modal
        opened={followUserModal}
        onClose={() => {
          setFollowUserModal(null);
          setUsers(null);
        }}
      >
        <Title order={4}>
          {followUserModal} of {user.username}
        </Title>
        {!users && <Loader />}
        {users &&
          users.map((user) => {
            return (
              <Box>
                <Avatar
                  src={process.env.REACT_APP_UPLOADS_PATH + user.avatar}
                  radius="lg"
                />
              </Box>
            );
          })}
      </Modal>
      <Container size="600px" m="0">
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
          <Group align="center" position="left" m="0" px="lg">
            <ActionIcon onClick={()=>navigate(-1)}>
              <IconArrowLeft />
            </ActionIcon>
            <Title order={3}>
              {user.username}
            </Title>
          </Group>
          {loggedUser.username !== username && (
            <Button
              variant="subtle"
              onClick={followUserHandler}
              loading={isFollowingLoading}
              disabled={isFollowingLoading}
            >
              {user.followFlag ? "Following" : "Follow"}
            </Button>
          )}
        </Box>
        <Box
          sx={(theme) => ({
            paddingLeft: theme.spacing.xs,
            paddingRight: theme.spacing.xs,
          })}
        >
          <Text onClick={() => setFollowUserModal("followers")}>
            {user.followers ?? 0} Followers
          </Text>
          <Text onClick={() => setFollowUserModal("followers")}>
            {user.following ?? 0} Following
          </Text>
          <UserTabs user={user} />
        </Box>
      </Container>
    </>
  );
}

export default UserPage;
