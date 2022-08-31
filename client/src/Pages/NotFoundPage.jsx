import { Container, Stack, Text, Title } from "@mantine/core";
import React from "react";

function NotFoundPage() {
  return (
    <>
      <div className="center-vertical">
        <Stack align="center">
          <Title style={{ fontSize: "5rem" }}>404</Title>
          <div style={{textAlign: 'center'}}>
            <Title order={3} >Look like you're lost</Title>
            <Title order={6}>the page you are looking for not avaible!</Title>
          </div>
        </Stack>
      </div>
    </>
  );
}

export default NotFoundPage;
