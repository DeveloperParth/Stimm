import React from "react";
import {
  Anchor,
  Button,
  Card,
  Center,
  Space,
  TextInput,
  Title,
} from "@mantine/core";
import { IconAt } from "@tabler/icons";
import { Link } from "react-router-dom";


function ForgotPage() {
  return (
    <>
      <div className="center-vertical">
        <Center>
          <Card
            p="xl"
            shadow="sm"
            radius="md"
            withBorder
            style={{ width: "350px" }}
          >
            <form>
              <Title order={4} align="center">
                Login
              </Title>
              <Space h={15} />
              <TextInput
                icon={<IconAt size={18} />}
                placeholder="Email"
                label="Enter email"
                description="An email will be sent if account exists with this email address"
                required
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "right",
                }}
              >
                <Anchor component={Link} to="/login" color="dimmed">
                  Return to login
                </Anchor>
              </div>
              <Space h={10} />
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button variant="white" size="md">
                  Send
                </Button>
              </div>
            </form>
          </Card>
        </Center>
      </div>
    </>
  );
}

export default ForgotPage;
