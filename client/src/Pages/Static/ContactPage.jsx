import {
  createStyles,
  Text,
  Title,
  SimpleGrid,
  TextInput,
  Textarea,
  Button,
  Group,
  ActionIcon,
  Container,
  Box,
} from "@mantine/core";
import {
  IconBrandTwitter,
  IconBrandInstagram,
  IconBrandGithub,
} from "@tabler/icons";
import { useState } from "react";
import { ContactIconsList } from "./ContactIcons";

import StaticHeader from "./StaticHeader";

import { showNotification } from "@mantine/notifications";
import API from "./../../Services/API";
const useStyles = createStyles((theme) => ({
  wrapper: {
    minHeight: 400,
    boxSizing: "border-box",
    borderRadius: theme.radius.md,
    padding: theme.spacing.xl * 2.5,

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      padding: theme.spacing.xl * 1.5,
    },
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    color: theme.white,
    lineHeight: 1,
  },

  description: {
    color: theme.colors[theme.primaryColor][0],
    maxWidth: 300,

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: "100%",
    },
  },

  form: {
    backgroundColor: theme.white,
    padding: theme.spacing.xl,
    borderRadius: theme.radius.md,
    boxShadow: theme.shadows.lg,
  },

  social: {
    color: theme.white,

    "&:hover": {
      color: theme.colors[theme.primaryColor][1],
    },
  },

  input: {
    backgroundColor: theme.white,
    borderColor: theme.colors.gray[4],
    color: theme.black,

    "&::placeholder": {
      color: theme.colors.gray[5],
    },
  },

  inputLabel: {
    color: theme.black,
  },

  control: {
    backgroundColor: theme.colors[theme.primaryColor][6],
  },
}));

const social = [
  { Icon: IconBrandTwitter, link: "https://twitter.com/Parth52911398" },
  { Icon: IconBrandGithub, link: "https://github.com/developerparth/" },
  {
    Icon: IconBrandInstagram,
    link: "https://www.instagram.com/parthparmar76/",
  },
];

export default function ContactPage() {
  const { classes } = useStyles();
  const [values, setValues] = useState({ email: "", name: "", message: "" });
  const contactUsSubmit = async (e) => {
    e.preventDefault();
    await API.post("/contact", { ...values });
    showNotification({ title: "We will contact you soon" });
    setValues({ email: "", name: "", message: "" });
  };
  const changeHandler = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const icons = social.map((Icon, index) => (
    <ActionIcon
      key={index}
      size={28}
      className={classes.social}
      variant="transparent"
      component="a"
      href={Icon.link}
      target="_blank"
      onClick={null}
    >
      <Icon.Icon size={22} stroke={1.5} />
    </ActionIcon>
  ));

  return (
    <>
      <Box
        sx={(theme) => ({
          width: "100%",
          backgroundImage: `linear-gradient(-60deg, ${
            theme.colors[theme.primaryColor][4]
          } 0%, ${theme.colors[theme.primaryColor][7]} 100%)`,
        })}
      >
        <StaticHeader active={3} />
        <Container m="auto">
          <div className={classes.wrapper}>
            <SimpleGrid
              cols={2}
              spacing={50}
              breakpoints={[{ maxWidth: "sm", cols: 1 }]}
            >
              <div>
                <Title className={classes.title}>Contact us</Title>
                <Text className={classes.description} mt="sm" mb={30}>
                  Leave your email and we will get back to you within 24 hours
                </Text>

                <ContactIconsList variant="white" />

                <Group mt="xl">{icons}</Group>
              </div>
              <form className={classes.form} onSubmit={contactUsSubmit}>
                <TextInput
                  label="Email"
                  name="email"
                  placeholder="your@email.com"
                  required
                  value={values.email}
                  onChange={changeHandler}
                  classNames={{
                    input: classes.input,
                    label: classes.inputLabel,
                  }}
                />
                <TextInput
                  label="Name"
                  name="name"
                  placeholder="John Doe"
                  mt="md"
                  value={values.name}
                  onChange={changeHandler}
                  classNames={{
                    input: classes.input,
                    label: classes.inputLabel,
                  }}
                />
                <Textarea
                  required
                  label="Your message"
                  placeholder="I want to order your goods"
                  name="message"
                  minRows={4}
                  value={values.message}
                  onChange={changeHandler}
                  mt="md"
                  classNames={{
                    input: classes.input,
                    label: classes.inputLabel,
                  }}
                />

                <Group position="right" mt="md">
                  <Button type="submit" className={classes.control}>
                    Send message
                  </Button>
                </Group>
              </form>
            </SimpleGrid>
          </div>
        </Container>
      </Box>
    </>
  );
}
