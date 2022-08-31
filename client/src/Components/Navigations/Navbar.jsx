import React, { forwardRef, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { logout } from "./../../Redux/Features/authSlice";

import {
  Avatar,
  Navbar as Nav,
  Box,
  UnstyledButton,
  Group,
  Text,
  useMantineTheme,
  Title,
  Modal,
  Menu,
  Button,
} from "@mantine/core";
import {
  IconBell,
  IconBookmarks,
  IconHome,
  IconLogout,
  IconSettings,
  IconWorld,
  IconChevronRight,
} from "@tabler/icons";

import { useNavigate } from "react-router-dom";
import useStyles from "../../styles";
const iconSize = 30;

function Navbar() {
  const dispatch = useDispatch();
  const [showLogout, setShowLogout] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const theme = useMantineTheme();
  const { classes } = useStyles();
  if (!user) return null;
  return (
    <>
      <Modal opened={showLogout} closeButtonLabel="No">
        Are you sure you want to logout?
        <Group position="apart">
          <Button color="green" variant="light">
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
      {/* <header className={"side-nav bar"}>
        <div className="header-container">
          <div className="item" onClick={() => navigate("/")}>
            <IconHome size={iconSize} />
            <span>Home</span>
          </div>

          <div className="item" onClick={() => navigate("/explore")}>
            <IconWorld size={iconSize} />
            <span>Explore</span>
          </div>

          <div className="item" onClick={() => navigate("/notifications")}>
            <IconBell size={iconSize} />
            <span>Notifications</span>
          </div>

          <div className="item" onClick={() => navigate("/bookmarks")}>
            <IconBookmarks size={iconSize} />
            <span>Bookmarks</span>
          </div>
          <div className="item" onClick={() => navigate("/")}>
            <IconSettings size={iconSize} />
            <span>Settings</span>
          </div>
          <div className="item" onClick={() => navigate("/me")}>
            <Avatar src={user.avatar} />
            <span>Profile</span>
          </div>
          <div
            style={{ height: "100%" }}
            className="item"
            onClick={() => dispatch(logout())}
          >
            <IconLogout size={iconSize} />
            <span>Logout</span>
          </div>
        </div>
      </header> */}
      <header className={"side-nav bar " + classes.bar}>
        <div className="header-container">
          <Nav withBorder p="xs">
            <Nav.Section>
              <Box
                sx={(theme) => ({
                  paddingLeft: theme.spacing.xs,
                  paddingRight: theme.spacing.xs,
                  paddingBottom: theme.spacing.lg,
                  borderBottom: `1px solid ${
                    theme.colorScheme === "dark"
                      ? theme.colors.dark[4]
                      : theme.colors.gray[2]
                  }`,
                })}
              >
                <Group className="brand" position="center" m="auto">
                  <Title order={2}>S</Title>
                </Group>
              </Box>
            </Nav.Section>
            <Nav.Section grow mt="xs">
              <MainLinks />
            </Nav.Section>

            <Nav.Section>
              <Box
                sx={{
                  paddingTop: theme.spacing.sm,
                  borderTop: `1px solid ${
                    theme.colorScheme === "dark"
                      ? theme.colors.dark[4]
                      : theme.colors.gray[2]
                  }`,
                }}
              >
                <Menu withArrow zIndex={100000} width="200px">
                  <Menu.Target>
                    <UserButton
                      image={user.avatar}
                      name={user.name}
                      email={user.email}
                    />
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item
                      color="red"
                      icon={<IconLogout size={18} />}
                      onClick={() => setShowLogout(true)}
                    >
                      <Text>Logout</Text>
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Box>
            </Nav.Section>
          </Nav>
        </div>
      </header>
    </>
  );
}

const data = [
  {
    icon: <IconHome size={iconSize} />,
    color: "teal",
    label: "Home",
    path: "/",
  },
  {
    icon: <IconWorld size={iconSize} />,
    color: "orange",
    label: "Explore",
    path: "/explore",
  },
  {
    icon: <IconBell size={iconSize} />,
    color: "grape",
    label: "Notifciations",
    path: "/notifications",
  },
  {
    icon: <IconBookmarks size={iconSize} />,
    color: "lime",
    label: "Bookmarks",
    path: "/bookmarks",
  },
  {
    icon: <IconSettings size={30} />,
    color: "blue",
    label: "Settings",
    path: "/",
  },
];

function MainLinks() {
  const navigate = useNavigate();
  const links = data.map(({ icon, color, label, path }) => (
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

        "&:hover": {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[1],
        },
      })}
    >
      <Group p="0">
        {icon}
        <span className="item-label">{label}</span>
      </Group>
    </UnstyledButton>
  ));
  return <>{links}</>;
}
const UserButton = forwardRef(
  ({ image, name, email, icon, ...others }, ref) => (
    <UnstyledButton
      ref={ref}
      sx={(theme) => ({
        display: "block",
        width: "100%",
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color:
          theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

        "&:hover": {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[1],
        },
      })}
      {...others}
    >
      <Group>
        <Avatar src={image} radius="xl" />
        <Box sx={{ flex: 1 }}>
          <Text size="sm" weight={500}>
            {name}
          </Text>
          <Text
            color="dimmed"
            size="xs"
            sx={{ maxWidth: 140, textOverflow: "ellipsis", overflow: "hidden" }}
          >
            {email}
          </Text>
        </Box>
        <IconChevronRight size={18} />
      </Group>
    </UnstyledButton>
  )
);
export default Navbar;