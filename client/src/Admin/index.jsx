import {
  Anchor,
  AppShell,
  Header,
  Title,
  useMantineTheme,
} from "@mantine/core";
import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import DashBoard from "./Pages/DashBoard";
import UsersPage from "./Pages/Users/UsersPage";
import ReportsPage from "./Pages/Reports/ReportsPage";
import AdminSideNav from "./AdminSideNav";
import Icon from "../Icon";
import { useState } from "react";
import { useSelector } from "react-redux";

function AdminRoutes() {
  const theme = useMantineTheme();
  const [active, setActive] = useState("Dashboard");
  return (
    <>
      <ProtectAdmin>
        <AppShell
          styles={{
            main: {
              background:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[8]
                  : theme.colors.gray[0],
            },
          }}
          navbarOffsetBreakpoint="xl"
          navbar={<AdminSideNav setActive={setActive} />}
          header={
            <Header height={70} p="lg">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <Anchor component={Link} to="/">
                  <Icon />
                </Anchor>
                <Title ml={20}>{active}</Title>
              </div>
            </Header>
          }
        >
          <Routes>
            <Route path="/" element={<DashBoard />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/reports" element={<ReportsPage />} />
          </Routes>
        </AppShell>
      </ProtectAdmin>
    </>
  );
}
function ProtectAdmin({ children }) {
  const { user } = useSelector((state) => state.auth);
  if (user?.role !== "ADMIN") return (window.location.href = "/");
  return children;
}
export { AdminRoutes };
// export default index;
