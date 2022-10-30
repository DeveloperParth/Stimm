import { Container } from "@mantine/core";
import React from "react";
import StaticHeader from "./StaticHeader";
import {
  createStyles,
  Title,
  SimpleGrid,
  Text,
  Button,
  ThemeIcon,
  Grid,
  Col,
  Accordion,
} from "@mantine/core";
import {
  IconReceiptOff,
  IconFlame,
  IconCircleDotted,
  IconFileCode,
} from "@tabler/icons";

const useStyles = createStyles((theme) => ({
  wrapper: {
    padding: `${theme.spacing.xl * 2}px ${theme.spacing.xl}px`,
  },
  wrapperFaq: {
    paddingTop: theme.spacing.xl * 2,
    paddingBottom: theme.spacing.xl * 2,
    minHeight: 650,
  },

  titleFaq: {
    marginBottom: theme.spacing.xl * 1.5,
  },

  itemFaq: {
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.lg,

    border: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontSize: 36,
    fontWeight: 900,
    lineHeight: 1.1,
    marginBottom: theme.spacing.md,
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
  },
}));
const features = [
  {
    icon: IconReceiptOff,
    title: "Free and open source",
    description: "Stimm is open source, you can view Stimm code on GitHub",
  },
  {
    icon: IconFileCode,
    title: "Javscript based",
    description: "Stimm is build with Javascript",
  },
  {
    icon: IconCircleDotted,
    title: "User friendly",
    description: "Simple and focused layout ",
  },
  {
    icon: IconFlame,
    title: "Flexible",
    description: "Customize colors, modes, settings in the settings",
  },
];

function AboutPage() {
  const { classes } = useStyles();
  const items = features.map((feature) => (
    <div key={feature.title}>
      <ThemeIcon
        size={44}
        radius="md"
        variant="gradient"
        gradient={{ deg: 133, from: "blue", to: "cyan" }}
      >
        <feature.icon size={26} stroke={1.5} />
      </ThemeIcon>
      <Text size="lg" mt="sm" weight={500}>
        {feature.title}
      </Text>
      <Text color="dimmed" size="sm">
        {feature.description}
      </Text>
    </div>
  ));
  return (
    <>
      <div style={{ width: "100%" }}>
        <StaticHeader active={0} />
        <Container m="auto">
          <div className={classes.wrapper}>
            <Grid gutter={80}>
              <Col span={12} md={5}>
                <Title className={classes.title} order={2}>
                  A social media platform for all
                </Title>
                <Text color="dimmed">
                  Post comment and interact with users, Stimm offers free
                  ad-less experience to it's users while providing all necessary
                  features
                </Text>

                <Button
                  variant="gradient"
                  gradient={{ deg: 133, from: "blue", to: "cyan" }}
                  size="lg"
                  radius="md"
                  mt="xl"
                  onClick={() => (window.location.pathname = "/")}
                >
                  Get started
                </Button>
              </Col>
              <Col span={12} md={7}>
                <SimpleGrid
                  cols={2}
                  spacing={30}
                  breakpoints={[{ maxWidth: "md", cols: 1 }]}
                >
                  {items}
                </SimpleGrid>
              </Col>
            </Grid>
          </div>
          <Container size="sm" className={classes.wrapperFaq} m="auto">
            <Title align="center" className={classes.titleFaq}>
              Frequently Asked Questions
            </Title>

            <Accordion variant="separated">
              <Accordion.Item
                className={classes.itemFaq}
                value="reset-password"
              >
                <Accordion.Control>
                  How can I reset my password?
                </Accordion.Control>
                <Accordion.Panel>
                  If you are logged in password can be reset through settings
                  section. If you are not logged in and do not remember password
                  then click on Forgot Password link in Login page
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item
                className={classes.itemFaq}
                value="another-account"
              >
                <Accordion.Control>
                  Can I create more that one account?
                </Accordion.Control>
                <Accordion.Panel>
                  Yes, but no you should not. Creating multiple account can lead
                  to ban on account. Although our systems are not 100% efficiant
                  at detecting duplicate accounts but when it does there are
                  penalty
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item className={classes.itemFaq} value="newsletter">
                <Accordion.Control>
                  How can I subscribe to monthly newsletter?
                </Accordion.Control>
                <Accordion.Panel>
                  As of today Stimm does not provide news letter, its a feature
                  we look forward to.
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item className={classes.itemFaq} value="credit-card">
                <Accordion.Control>
                  Do you store information securely?
                </Accordion.Control>
                <Accordion.Panel>
                  Yes we store information securely on our servers we use
                  hashing so that even if your credentials gets stolen no one
                  can know your password and use your account
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item className={classes.itemFaq} value="payment">
                <Accordion.Control>How do you use our data?</Accordion.Control>
                <Accordion.Panel>
                  Please refer to Privacy policy
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </Container>
        </Container>
      </div>
    </>
  );
}

export default AboutPage;
