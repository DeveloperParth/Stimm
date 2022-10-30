import React from "react";
import {
  Anchor,
  Button,
  Card,
  Group,
  Modal,
  Space,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconAt } from "@tabler/icons";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { forgotUser } from "../Services/Services";
import Icon from "../Icon";

function ForgotPage() {
  const navigate = useNavigate();
  const [emailError, setEmailError] = useState("");
  const [email, setEmail] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const forgotPasswordValidator = (e) => {
    e.preventDefault();
    setEmailError("");
    if (!email.match(/\S+@\S+\.\S+/)) return setEmailError("Invalid email");
    setIsConfirmModalOpen(true);
  };
  const forgotPasswordHandler = async () => {
    await forgotUser({ email });
    navigate("/login");
  };
  return (
    <>
      <Modal
        opened={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        centered
      >
        <Text>
          <b>{email} </b>
          Are you sure this is your email?
          <br />
          An email will be sent on this email address with password reset
          instrucations and you will be redirected to login page
        </Text>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "1rem",
          }}
        >
          <Button
            variant="outline"
            color="red"
            onClick={() => setIsConfirmModalOpen(false)}
          >
            No, I'd like to change
          </Button>
          <Button
            variant="outline"
            color="green"
            onClick={forgotPasswordHandler}
          >
            Yes, send email
          </Button>
        </div>
      </Modal>
      <div className="center-vertical">
        <Card
          p="xl"
          shadow="sm"
          radius="md"
          withBorder
          style={{ maxWidth: "350px", width: "100%" }}
        >
          <form onSubmit={forgotPasswordValidator}>
            <Group align="center" position="center">
              <Icon />
              <Title order={1}>Stimm</Title>
            </Group>
            <Space h={20} />
            <Title order={4} align="center">
              Reset password
            </Title>
            <Space h={15} />
            <TextInput
              icon={<IconAt size={18} />}
              placeholder="Email"
              label="Enter email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              error={emailError}
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
              <Button variant="white" size="md" type="submit">
                Send
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}

export default ForgotPage;
