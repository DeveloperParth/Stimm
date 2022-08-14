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
import { IconLock } from "@tabler/icons";
import { Link } from "react-router-dom";

function SignupPage() {
  return (
    <>
      <div className="center-vertical">
        <Center>
          <Card
            p="xl"
            shadow="sm"
            radius="md"
            withBorder
            style={{ width: "300px" }}
          >
            <form>
              <Title order={4} align="center">
                Signup
              </Title>
              <Space h={15} />
              <TextInput
                // icon={<IconAt size={18} />}
                placeholder="Name"
                label="Enter name"
                required
              />
              <Space h={5} />
              <TextInput
                icon={<IconAt size={18} />}
                placeholder="Username"
                label="Enter Username"
                required
              />
              <Space h={5} />
              <TextInput
                // icon={<IconAt size={18} />}
                placeholder="Email"
                label="Enter email"
                required
              />
              <Space h={5} />

              <TextInput
                // icon={<IconLock />}
                placeholder="Password"
                label="Enter password"
                required
              />
              <Space h={5} />

              <TextInput
                // icon={<IconLock />}
                placeholder="Confirm Password"
                label="Confirm password"
                required
              />
              <Space h={10} />
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button variant="white" size="md">
                  Signup
                </Button>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "1rem",
                }}
              >
                <Anchor component={Link} to="/login" color="dimmed" inline>
                  Already have an account?
                </Anchor>
              </div>
            </form>
          </Card>
        </Center>
      </div>
    </>
  );
}
export default SignupPage;
