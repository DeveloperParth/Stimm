import { Container, Group, Tabs } from "@mantine/core";
import {
  IconArrowForward,
  IconArrowRight,
  IconChevronRight,
} from "@tabler/icons";
import React from "react";
import Header from "../Components/Navigations/Header";

function SettingsPage() {
  return (
    <>
      <Container size="600px">
        <Header title="Settings" />
        <Tabs
          orientation="vertical"
          defaultValue="account"
          unstyled
          styles={(theme) => ({
            display: "flex",
            tab: {
              ...theme.fn.focusStyles(),
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[6]
                  : theme.white,
              color:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[0]
                  : theme.colors.gray[9],
              border: `1px solid ${
                theme.colorScheme === "dark"
                  ? theme.colors.dark[6]
                  : theme.colors.gray[4]
              }`,
              padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
              cursor: "pointer",
              fontSize: theme.fontSizes.sm,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              // width: "25%",

              "&[data-active]": {
                backgroundColor: theme.colors.blue[7],
                borderColor: theme.colors.blue[7],
                color: theme.white,
              },
            },

            tabIcon: {
              marginRight: theme.spacing.xs,
              display: "flex",
              alignItems: "center",
            },

            tabsList: {
              display: "flex",
              flexDirection: "column",
            },
          })}
        >
          <Tabs.List grow>
            <Tabs.Tab value="account">
              Account
              <IconChevronRight />
            </Tabs.Tab>
            <Tabs.Tab value="a">
              Account
              <IconChevronRight />
            </Tabs.Tab>
            <Tabs.Tab value="appearance">
              Apperance
              <IconChevronRight />
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="account">hidddd</Tabs.Panel>
          <Tabs.Panel value="a">hddi</Tabs.Panel>
          <Tabs.Panel value="appearance">hdddi</Tabs.Panel>
        </Tabs>
      </Container>
    </>
  );
}

export default SettingsPage;
