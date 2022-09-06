import {
  Avatar,
  Button,
  Container,
  Tabs,
  Textarea,
  TextInput,
  FileButton,
} from "@mantine/core";
import React from "react";
import Header from "../Components/Navigations/Header";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../Services/Services";
import { setUser } from "../Redux/Features/authSlice";
import { showNotification } from "@mantine/notifications";
function SettingsPage() {
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

  return (
    <>
      <Container size="600px">
        <Header title="Settings" />
        <Tabs orientation="vertical" defaultValue="account">
          <Tabs.List>
            <Tabs.Tab value="password">Change Password</Tabs.Tab>
            <Tabs.Tab value="account">Account</Tabs.Tab>
            <Tabs.Tab value="appearance">Apperance</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="password">hidddd</Tabs.Panel>
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
              <Button type="submit">Save</Button>
            </form>
          </Tabs.Panel>
          <Tabs.Panel value="appearance">hdddi</Tabs.Panel>
        </Tabs>
      </Container>
    </>
  );
}

export default SettingsPage;
