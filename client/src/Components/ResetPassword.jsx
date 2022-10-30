import React, { useState } from "react";
import {
  PasswordInput,
  Card,
  Center,
  Space,
  Title,
  Button,
} from "@mantine/core";
import { resetPassworrd } from "./../Services/Services";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../Redux/Features/authSlice";

function ResetPassword() {
  const { id, token } = useParams();
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [cPasswordError, setCPasswordError] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    setCPasswordError("");
    setPasswordError("");
    if (password.length < 8) {
      return setPasswordError("Password must be 8 character long");
    }
    if (password !== cPassword) {
      setPasswordError("Passwords must be same");
      setCPasswordError("Passwords must be same");
      return;
    }
    const { data } = await resetPassworrd(id, token, { password });
    dispatch(setUser({ user: data.user }));
    window.location.href = '/'
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
            <form onSubmit={submitHandler}>
              <Title order={4} align="center">
                Reset password
              </Title>
              <Space h={15} />
              <PasswordInput
                placeholder="Password"
                label="Enter password"
                description="Password must be atleast 8 character long"
                error={passwordError}
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                name="password"
                required
              />
              <Space h={10} />
              <PasswordInput
                placeholder="Confirm Password"
                label="Confirm password"
                name="cpassword"
                error={cPasswordError}
                value={cPassword}
                onChange={(e) => setCPassword(e.target.value)}
                required
              />
              <Space h={15} />
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button type="submit" variant="white" size="md">
                  Reset
                </Button>
              </div>
            </form>
          </Card>
        </Center>
      </div>
    </>
  );
}

export default ResetPassword;
