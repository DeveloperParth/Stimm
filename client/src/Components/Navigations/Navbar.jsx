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
  MediaQuery,
  Indicator,
} from "@mantine/core";
import {
  IconBell,
  IconBookmarks,
  IconHome,
  IconLogout,
  IconSettings,
  IconWorld,
  IconChevronRight,
  IconMessage,
  IconUser,
  IconTools,
} from "@tabler/icons";

import { useNavigate } from "react-router-dom";
import useStyles from "../../styles";
import Icon from "../../Icon";
const iconSize = 30;

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const theme = useMantineTheme();
  const { classes } = useStyles();

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
      <header className={"side-nav bar " + classes.bar}>
        <div className="header-container">
          <Nav withBorder px="xs">
            <Nav.Section>
              <Box
                sx={(theme) => ({
                  display: "flex",
                  justifyContent: "center",
                  borderBottom: `1px solid ${
                    theme.colorScheme === "dark"
                      ? theme.colors.dark[4]
                      : theme.colors.gray[2]
                  }`,
                  height: "70px",
                })}
              >
                <Group className="brand" position="left" m="auto">
                  <Icon />
                  <MediaQuery smallerThan="md" styles={{ display: "none" }}>
                    <Title order={2}>Stimm</Title>
                  </MediaQuery>
                </Group>
              </Box>
            </Nav.Section>
            <Nav.Section grow mt="xs">
              <MainLinks user={user} />
            </Nav.Section>

            <Nav.Section>
              {user ? (
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
                        image={process.env.REACT_APP_UPLOADS_PATH + user.avatar}
                        name={user.name}
                        email={user.username}
                      />
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        icon={<IconUser size={18} />}
                        onClick={() => navigate(`/u/${user.username}/posts`)}
                      >
                        <Text>Profile</Text>
                      </Menu.Item>
                      {user.role === "ADMIN" && (
                        <Menu.Item
                          icon={<IconTools size={18} />}
                          onClick={() => navigate(`/admin`)}
                        >
                          <Text>Admin</Text>
                        </Menu.Item>
                      )}
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
              ) : (
                <Button
                  fullWidth
                  size="lg"
                  variant="subtle"
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
              )}
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
    requireLogin: true,
  },
  {
    icon: <IconWorld size={iconSize} />,
    color: "orange",
    label: "Explore",
    path: "/explore",
  },
  {
    icon: <IconMessage size={iconSize} />,
    color: "grape",
    label: "Messages",
    path: "/messages",
    requireLogin: true,
  },
  {
    icon: <IconBell size={iconSize} />,
    color: "grape",
    label: "Notifciations",
    path: "/notifications",
    indicator: true,
    requireLogin: true,
  },
  {
    icon: <IconBookmarks size={iconSize} />,
    color: "lime",
    label: "Bookmarks",
    path: "/bookmarks",
    requireLogin: true,
  },
  {
    icon: <IconSettings size={30} />,
    color: "blue",
    label: "Settings",
    path: "/settings",
    requireLogin: true,
  },
];

function MainLinks({ user }) {
  const { count } = useSelector((state) => state.notification);
  const navigate = useNavigate();
  const links = data.map(
    ({ icon, color, label, path, indicator, requireLogin }) => {
      if (!requireLogin) {
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
                theme.colorScheme === "dark"
                  ? theme.colors.dark[0]
                  : theme.black,

              "&:hover": {
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[6]
                    : theme.colors.gray[1],
              },
            })}
          >
            <Group p="0">
              {indicator ? (
                <Indicator inline label={count} size={16} offset={5}>
                  {icon}
                </Indicator>
              ) : (
                icon
              )}
              <span className="item-label">{label}</span>
            </Group>
          </UnstyledButton>
        );
      }
      if (requireLogin && user) {
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
                theme.colorScheme === "dark"
                  ? theme.colors.dark[0]
                  : theme.black,

              "&:hover": {
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[6]
                    : theme.colors.gray[1],
              },
            })}
          >
            <Group p="0">
              {indicator && count ? (
                <Indicator inline label={count} size={16} offset={5}>
                  {icon}
                </Indicator>
              ) : (
                icon
              )}
              <span className="item-label">{label}</span>
            </Group>
          </UnstyledButton>
        );
      }
      return null;
    }
  );
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
      <Group
        sx={(theme) => ({
          flexWrap: "nowrap",
          ".box-userinfo": {
            flex: 1,
          },
          [`@media (max-width: ${theme.breakpoints.md}px)`]: {
            ".arrow-icon": {
              display: "none",
            },
            ".box-userinfo": {
              display: "none",
            },
          },
        })}
      >
        <Avatar src={image} radius="xl" />
        <Box className="box-userinfo">
          <Text size="sm" weight={500}>
            {name}
          </Text>
          <Text color="dimmed" size="xs">
            {email}
          </Text>
        </Box>
        <IconChevronRight size={18} className="arrow-icon" />
      </Group>
    </UnstyledButton>
  )
);
export default Navbar;
