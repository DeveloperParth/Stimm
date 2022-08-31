import React, { useState } from "react";
import {
  Anchor,
  Button,
  Card,
  Center,
  Mark,
  Modal,
  Space,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconAt, IconCheck, IconX } from "@tabler/icons";
import { Link } from "react-router-dom";
import { useValidatedState } from "@mantine/hooks";
import { getUsername, getEmail, signupUser } from "./../Services/Services";

function SignupPage() {
  const [isUsernameTaken, setIsUsernameTaken] = useState(null);
  const [isEmailTaken, setIsEmailTaken] = useState(null);
  const [p, setP] = useState("");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [{ value: emailValue, valid: validEmail }, setEmail] =
    useValidatedState("", (v) => v.match(/\S+@\S+\.\S+/), true);
  const [{ valid: validUsername }, setUsername] = useValidatedState(
    "",
    (v) => v.length > 5,
    true
  );

  const [{ valid: validName }, setName] = useValidatedState(
    "",
    (v) => v.length > 3,
    true
  );
  const [{ valid: validPassword }, setPassword] = useValidatedState(
    "",
    (v) => v.length > 7,
    true
  );
  const [{ valid: validCpassword }, setCpassword] = useValidatedState(
    "",
    (v) => v === p,
    true
  );
  const checkUsername = async (username) => {
    setUsername(username);
    if (!validUsername || !username) return;
    const { data } = await getUsername(username);
    setIsUsernameTaken(data.taken);
  };

  const checkEmail = async (email) => {
    setEmail(email);
    if (!validEmail || !email) return;
    const { data } = await getEmail(email);
    setIsEmailTaken(data.taken);
  };
  const formValidator = (body) => {
    setEmail(body.email);
    setUsername(body.username);
    setName(body.name);
    setPassword(body.password);
    setCpassword(body.cpassword);

    return (
      validEmail &&
      validName &&
      validCpassword &&
      validPassword &&
      validUsername &&
      !isUsernameTaken &&
      !isEmailTaken
    );
  };
  const signupHandler = async (e) => {
    e.preventDefault();
    const formdata = new FormData(e.target);
    const body = Object.fromEntries(formdata.entries());
    await checkUsername(body.username);
    await checkEmail(body.email);
    if (
      formValidator(body) &&
      isUsernameTaken !== null &&
      isEmailTaken !== null
    ) {
      const { data } = await signupUser(body);
      console.log(data);
      setShowEmailModal(true);
    }
  };
  return (
    <>
      <ShowEmailModal
        showEmailModal={showEmailModal}
        setShowEmailModal={setShowEmailModal}
        email={emailValue}
      />
      <div className="center-vertical">
        <Center>
          <Card
            p="xl"
            shadow="sm"
            radius="md"
            withBorder
            style={{ width: "300px" }}
          >
            <form onSubmit={signupHandler}>
              <Title order={4} align="center">
                Signup
              </Title>
              <Space h={15} />
              <TextInput
                placeholder="Name"
                label="Enter name"
                name="name"
                error={!validName && "Name must be more than 3"}
                required
              />
              <Space h={5} />
              <TextInput
                icon={<IconAt size={18} />}
                placeholder="Username"
                label="Enter Username"
                name="username"
                onChange={(e) => checkUsername(e.target.value)}
                error={
                  (!validUsername ? "Username must be 6" : false) ||
                  (isUsernameTaken ? "Username is taken" : false)
                }
                rightSection={
                  validUsername ? (
                    isUsernameTaken ? (
                      <IconX color="red" />
                    ) : (
                      <IconCheck color="green" />
                    )
                  ) : null
                }
                required
              />
              <Space h={5} />
              <TextInput
                placeholder="Email"
                label="Enter email"
                onChange={(e) => checkEmail(e.target.value)}
                error={
                  (!validEmail ? "Email is invalid" : false) ||
                  (isEmailTaken ? "Email is taken" : false)
                }
                rightSection={
                  validEmail ? (
                    isEmailTaken ? (
                      <IconX color="red" />
                    ) : (
                      <IconCheck color="green" />
                    )
                  ) : null
                }
                name="email"
                required
              />
              <Space h={5} />

              <TextInput
                placeholder="Password"
                label="Enter password"
                onChange={(e) => setP(e.target.value)}
                error={
                  (!validPassword && "password") ||
                  (!validCpassword && "Passwords must be same")
                }
                name="password"
                required
              />
              <Space h={5} />

              <TextInput
                placeholder="Confirm Password"
                label="Confirm password"
                name="cpassword"
                error={
                  !validCpassword && validPassword && "Passwords must be same"
                }
                required
              />
              <Space h={10} />
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button variant="white" size="md" type="submit">
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
function ShowEmailModal({ showEmailModal, setShowEmailModal, email }) {
  return (
    <Modal opened={showEmailModal} onClose={() => setShowEmailModal(false)}>
      <Text>
        An email has been sent to <Mark> {email}</Mark>, Please confirm mail to
        continue. You can close this tab.
      </Text>
    </Modal>
  );
}
export default SignupPage;
