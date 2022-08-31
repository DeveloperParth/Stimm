import React, { useState, useEffect } from "react";
import { Col, Container, Grid, Loader, Title } from "@mantine/core";
import { getNotifications, setNotificationsRead } from "../Services/Services";

function NotifcationPage() {
  const [notifications, setNotifications] = useState(null);
  const fetchN = async () => {
    const { data } = await getNotifications();
    setNotifications(data.notifications);
  };
  const notifcationsRead = async () => {
    await setNotificationsRead();
  };
  useEffect(() => {
    fetchN();
    setTimeout(()=>notifcationsRead(), 1000)
  }, []);
  const mapped =
    notifications &&
    notifications.map((n) => {
      return (
        <Col span={12} sx={{ background: n.unread ? "black" : "black" }}>
          {n.body}
        </Col>
      );
    });
  if (!notifications) return <Loader />;
  return (
    <>
      <Container size="600px" m="0">
        <Title sx={{ width: 600 }}>Notifcations</Title>
        <Grid>{mapped}</Grid>
      </Container>
    </>
  );
}

export default NotifcationPage;
