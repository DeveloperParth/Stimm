import React, { useState } from "react";
import {
  ActionIcon,
  Box,
  Burger,
  Drawer,
  Group,
  Title,
  Modal,
  Button,
  Avatar,
  Text,
  UnstyledButton,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconBookmark,
  IconLogout,
  IconSearch,
} from "@tabler/icons";
import { useMediaQuery } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";

import { logout } from "./../../Redux/Features/authSlice";
import { useDispatch, useSelector } from "react-redux";

function Header({ title, showPostButton, showGoBackButton }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const isMobile = useMediaQuery("(max-width: 576px)");

  const [isBurgerOpen, setIsBurgerOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  return (
    <>
      <Modal
        opened={showLogout}
        closeButtonLabel="No"
        onClose={() => setShowLogout(false)}
      >
        Are you sure you want to logout?
        <Group position="apart">
          <Button
            color="green"
            variant="light"
            onClick={() => setShowLogout(false)}
          >
            Cancel
          </Button>
          <Button
            color="red"
            variant="light"
            onClick={() => dispatch(logout())}
          >
            Yes log me out
          </Button>
        </Group>
      </Modal>
      <Box
        sx={(theme) => ({
          paddingLeft: theme.spacing.xs,
          paddingRight: theme.spacing.xs,
          paddingBottom: 15,
          paddingTop: 15,
          borderBottom: `1px solid ${
            theme.colorScheme === "dark"
              ? theme.colors.dark[4]
              : theme.colors.gray[2]
          }`,
          background: theme.colors.dark[7],
          height: "70px",
          position: "sticky",
          top: 0,
          zIndex: 111,
        })}
      >
        {isMobile ? (
          <Group align="center" position="apart">
            <Group>
              {showGoBackButton ? (
                <ActionIcon onClick={() => navigate(-1)}>
                  <IconArrowLeft />
                </ActionIcon>
              ) : (
                <Burger
                  opened={isBurgerOpen}
                  onClick={() => setIsBurgerOpen((o) => !o)}
                  title={"title"}
                  size="sm"
                />
              )}

              <Title order={5} style={{ textTransform: "capitalize" }}>
                {title}
              </Title>
            </Group>

            <ActionIcon>
              <IconSearch />
            </ActionIcon>
          </Group>
        ) : (
          <Group align="center" position="apart" px="0">
            <Group>
              {showGoBackButton && (
                <ActionIcon onClick={() => navigate(-1)}>
                  <IconArrowLeft />
                </ActionIcon>
              )}
              <Title order={2} style={{ textTransform: "capitalize" }}>
                {title}
              </Title>
            </Group>
          </Group>
        )}
      </Box>
      <Drawer
        opened={isBurgerOpen}
        onClose={() => setIsBurgerOpen((o) => !o)}
        size="sm"
        itle="Register"
        // withCloseButton={false}
        // padding="1rem"
      >
        <Group mb={20}>
          <Avatar
            src={process.env.REACT_APP_UPLOADS_PATH + user.avatar}
            size="md"
            radius="xl"
          />
          <div>
            <Title order={6}>{user.name}</Title>
            <Text color="dimmed">@{user.username}</Text>
          </div>
        </Group>
        <Box sx={{ borderTop: "1px solid" }}>
          <NavButton icon={<IconBookmark />} label="Bookmarks" />
          <NavButton icon={<IconBookmark />} label="Bookmarks" />

          <NavButton icon={<IconBookmark />} label="Bookmarks" />

          <NavButton icon={<IconBookmark />} label="Bookmarks" />
          <NavButton icon={<IconBookmark />} label="Bookmarks" />
          <UnstyledButton
            onClick={() => {
              setIsBurgerOpen(false);
              setShowLogout(true);
            }}
            sx={(theme) => ({
              display: "block",
              width: "100%",
              padding: theme.spacing.xs,
              borderRadius: theme.radius.sm,
              color:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[0]
                  : theme.black,
            })}
          >
            <Group p="0">
              {<IconLogout />}
              <span className="item-label">Logout</span>
            </Group>
          </UnstyledButton>
        </Box>
      </Drawer>
    </>
  );
}
function NavButton({ icon, label, path }) {
  const navigate = useNavigate(path);
  return (
    <UnstyledButton
      onClick={() => navigate(path)}
      key={label}
      sx={(theme) => ({
        display: "block",
        width: "100%",
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color:
          theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
      })}
    >
      <Group p="0">
        {icon}
        <span className="item-label">{label}</span>
      </Group>
    </UnstyledButton>
  );
}

export default Header;