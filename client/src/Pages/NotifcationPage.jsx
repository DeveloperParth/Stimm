import React, { useState, useEffect } from "react";
import { Box, Container, Loader } from "@mantine/core";
import { getNotifications, setNotificationsRead } from "../Services/Services";
import Header from "../Components/Navigations/Header";
import { setNotificationCount } from "../Redux/Features/notificationSlice";
import { useDispatch } from "react-redux";

function NotifcationPage() {
  const [notifications, setNotifications] = useState(null);
  const dispatch = useDispatch();
  const fetchN = async () => {
    const { data } = await getNotifications();
    setNotifications(data.notifications);
  };
  const notifcationsRead = async () => {
    await setNotificationsRead();
  };
  useEffect(() => {
    fetchN();
    dispatch(setNotificationCount(0));
    setTimeout(() => notifcationsRead(), 10000);
    // eslint-disable-next-line
  }, []);
  const mapped =
    notifications &&
    notifications.map((n) => {
      return (
        <Box
          sx={(theme) => ({
            padding: theme.spacing.md,
            borderBottom: `1px solid ${
              theme.colorScheme === "dark"
                ? theme.colors.dark[4]
                : theme.colors.gray[2]
            }`,
          })}
        >
          {n.body}
        </Box>
      );
    });
  return (
    <>
      <Container size="600px" m="0">
        <Header title="Notifications" />
        {!notifications && <Loader />}
        {mapped}
      </Container>
    </>
  );
}

export default NotifcationPage;
