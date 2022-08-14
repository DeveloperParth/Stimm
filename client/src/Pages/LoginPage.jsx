import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../Redux/Features/authSlice";

import {
  Button,
  Card,
  Center,
  Anchor,
  Space,
  TextInput,
  Title,
  Notification,
} from "@mantine/core";
import { IconAt } from "@tabler/icons";
import { IconLock } from "@tabler/icons";
import { Link } from "react-router-dom";

function LoginPage() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const loginHandler = (e) => {
    e.preventDefault();
    const formdata = new FormData(e.target);
    const body = Object.fromEntries(formdata.entries());
    dispatch(login(body));
  };
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
            <form onSubmit={loginHandler}>
              <Title order={4} align="center">
                Login
              </Title>
              <Space h={15} />
              <TextInput
                icon={<IconAt size={18} />}
                placeholder="Email"
                label="Enter email"
                name="email"
                required
              />
              <Space h={5} />

              <TextInput
                icon={<IconLock />}
                placeholder="Password"
                label="Enter password"
                name="password"
                required
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "right",
                }}
              >
                <Anchor component={Link} to="/forgot" color="dimmed">
                  Forgot password?
                </Anchor>
              </div>
              <Space h={10} />
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  type="submit"
                  variant="white"
                  size="md"
                  loading={auth.loading}
                >
                  Login
                </Button>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "1rem",
                }}
              >
                <Anchor component={Link} to="/signup" color="dimmed" inline>
                  Don't have an account?
                </Anchor>
              </div>
            </form>
          </Card>
        </Center>
      </div>
    </>
  );
}

export default LoginPage;
