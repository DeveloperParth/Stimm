import React from "react";

import { useSelector } from "react-redux";

import {
  Navbar as Nav,
  Box,
  UnstyledButton,
} from "@mantine/core";
import {
  IconBell,
  IconHome,
  IconWorld,
  IconMessage,
} from "@tabler/icons";

import { useNavigate } from "react-router-dom";
const iconSize = 30;

function Navbar() {
  const { user } = useSelector((state) => state.auth);
  if (!user) return null;
  return (
    <>
      <header className={"bottom-nav"}>
        <div className="header-container">
          <Nav height="60px">
            <Nav.Section grow mt="xs">
              <MainLinks />
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
    color: "cyan",
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
    icon: <IconMessage size={iconSize} />,
    color: "pink",
    label: "Messages",
    path: "/messages",
  },
  {
    icon: <IconBell size={iconSize} />,
    color: "teal",
    label: "Notifciations",
    path: "/notifications",
  },
];

function MainLinks() {
  const navigate = useNavigate();
  const links = data.map(({ icon, color, label, path }) => (
    <UnstyledButton
      onClick={() => navigate(path)}
      key={label}
      sx={(theme) => ({
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        flex: "1 1",
        display: "flex",
        justifyContent: "center",
        color: theme.fn.rgba(theme.colors[color][4], 0.75),
        // theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
      })}
    >
      {icon}
    </UnstyledButton>
  ));
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-evenly",
        }}
      >
        {links}
      </Box>
    </>
  );
}
export default Navbar;
