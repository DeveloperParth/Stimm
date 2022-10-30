import {
  Avatar,
  Button,
  Container,
  Tabs,
  Textarea,
  TextInput,
  FileButton,
  SegmentedControl,
  Center,
  Box,
  ThemeIcon,
  Anchor,
} from "@mantine/core";
import React from "react";
import Header from "../Components/Navigations/Header";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotUser, updateUser } from "../Services/Services";
import { setUser } from "../Redux/Features/authSlice";
import { showNotification } from "@mantine/notifications";
import { useLocalStorage } from "@mantine/hooks";
import { IconMoon, IconSun } from "@tabler/icons";
function SettingsPage() {
  const [value, setValue] = useLocalStorage({ key: "theme" });
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const { user, token } = useSelector((state) => state.auth);
  const [inputs, setInputs] = useState({
    name: user.name,
    bio: user.bio,
    username: user.username,
  });
  const handleChange = (e) =>
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  const updateUserHandler = async (e) => {
    e.preventDefault();
    const { username, name, bio } = inputs;
    const { data } = await updateUser({
      username,
      name,
      bio,
      avatar: file ?? null,
    });
    dispatch(setUser({ user: { ...data.user, token } }));
    window.location.reload();
    showNotification({ title: "Profile updated" });
  };
  const sendPasswordResetLink = async () => {
    await forgotUser({ email: user.email });
    showNotification({
      title: "Password reset link has been sent to you mail",
    });
  };
  return (
    <>
      <Container size="600px">
        <Header title="Settings" />
        <Tabs orientation="vertical" defaultValue="account">
          <Tabs.List>
            <Tabs.Tab value="account">Account</Tabs.Tab>
            <Tabs.Tab value="appearance">Apperance</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="account">
            <form style={{ padding: "1rem" }} onSubmit={updateUserHandler}>
              <FileButton onChange={setFile} accept="image/png,image/jpeg">
                {(props) => (
                  <Avatar
                    {...props}
                    src={
                      !file
                        ? process.env.REACT_APP_UPLOADS_PATH + user.avatar
                        : URL.createObjectURL(file)
                    }
                  />
                )}
              </FileButton>
              <TextInput
                value={inputs.username}
                label="Username"
                name="username"
                onChange={handleChange}
              />
              <TextInput
                value={inputs.name}
                label="Name"
                name="name"
                onChange={handleChange}
              />
              <Textarea
                value={inputs.bio}
                label="Bio"
                maxRows={1}
                maxLength={300}
                name="bio"
                onChange={handleChange}
              />
              <Button type="submit" mt={10} fullWidth>
                Save
              </Button>
            </form>
            <Center>
              <Anchor onClick={sendPasswordResetLink}>
                Send password reset link
              </Anchor>
            </Center>
          </Tabs.Panel>
          <Tabs.Panel value="appearance">
            <SegmentedControl
              value={value.colorScheme === "dark" ? "dark" : "light"}
              onChange={(v) => setValue({ ...value, colorScheme: v })}
              fullWidth
              data={[
                {
                  value: "light",
                  label: (
                    <Center>
                      <IconSun size={16} stroke={1.5} />
                      <Box ml={10}>Light</Box>
                    </Center>
                  ),
                },
                {
                  value: "dark",
                  label: (
                    <Center>
                      <IconMoon size={16} stroke={1.5} />
                      <Box ml={10}>Dark</Box>
                    </Center>
                  ),
                },
              ]}
              m="10px 20px"
              size="md"
              radius="md"
            />
            <SegmentedControl
              value={value.color}
              onChange={(v) => setValue({ ...value, color: v })}
              fullWidth
              data={[
                {
                  value: "blue",
                  label: (
                    <Center>
                      <ThemeIcon p="lg" radius="xl" color="blue" />
                    </Center>
                  ),
                },
                {
                  value: "yellow",
                  label: (
                    <Center>
                      <ThemeIcon p="lg" radius="xl" color="yellow" />
                    </Center>
                  ),
                },
                {
                  value: "pink",
                  label: (
                    <Center>
                      <ThemeIcon p="lg" radius="xl" color="pink" />
                    </Center>
                  ),
                },
                {
                  value: "cyan",
                  label: (
                    <Center>
                      <ThemeIcon p="lg" radius="xl" color="cyan" />
                    </Center>
                  ),
                },
                {
                  value: "green",
                  label: (
                    <Center>
                      <ThemeIcon p="lg" radius="xl" color="green" />
                    </Center>
                  ),
                },
              ]}
              m="10px 20px"
              // size="md"
              radius="md"
            />
          </Tabs.Panel>
        </Tabs>
      </Container>
    </>
  );
}

export default SettingsPage;
