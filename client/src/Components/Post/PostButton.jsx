import { UnstyledButton, Group } from "@mantine/core";
import React from "react";

function PostButton({ color, icon, text, active, onClick }) {
  const styleSx = (theme) => {
    if (active) {
      return {
        background: "transparent",
        color: theme.colors[color][2],
        borderRadius: "25px",
        ":hover": {
          color: theme.colors[color][2],
        },
        ".icon-container": {
          background: theme.fn.rgba(theme.colors[color][8], 0.2),
        },
      };
    }
    return {
      background: "transparent",
      borderRadius: "25px",
      ":hover": {
        color: theme.colors[color][2],
      },
      "&:hover .icon-container": {
        background: theme.fn.rgba(theme.colors[color][8], 0.2),
      },
    };
  };
  return (
    <UnstyledButton sx={styleSx} onClick={onClick}>
      <Group align="center" spacing="0.5rem">
        <div
          className="icon-container"
          style={{
            padding: "10px",
            display: "flex",
            justifyContent: "center",
            borderRadius: "50%",
          }}
        >
          {icon}
        </div>
        <span>{text}</span>
      </Group>
    </UnstyledButton>
  );
}

export default PostButton;
