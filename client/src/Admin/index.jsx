import { AppShell, Burger, Button, Header,  Navbar, useMantineTheme } from "@mantine/core";
import React from "react";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import DashBoard from "./Pages/DashBoard";

function AdminRoutes() {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  return (
    <>
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
        navbar={
          <Navbar
            p="md"
            width={{ sm: 200, lg: 250 }}
          >
            <>Application navbar</>
          </Navbar>
        }
        header={
          <Header height={70} p="lg">
            <div
              style={{ display: "flex", alignItems: "center", height: "100%" }}
            >
                <Burger
                  opened={opened}
                  onClick={() => setOpened((o) => !o)}
                  size="sm"
                  color={theme.colors.gray[6]}
                  mr="xl"
                />


              <Button ml="auto" variant="subtle">
                Admin
              </Button>
            </div>
          </Header>
        }
      >
        <Routes>
          <Route path="/" element={<DashBoard />} />
        </Routes>
      </AppShell>
    </>
  );
}
export { AdminRoutes };
// export default index;
