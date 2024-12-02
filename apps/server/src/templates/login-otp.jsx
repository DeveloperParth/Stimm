import {
  Button,
  Container,
  Heading,
  Hr,
  Html,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";
import Header from "./components/header";

export default function Email(props) {
  return (
    <Html>
      <Tailwind>
        <Container className="mx-auto">
          <Header />
          <Section>
            <Heading className="mx-auto text-lg font-normal">
              Welcome to Stimm! We're excited to have you on board.
            </Heading>
            <Text
              className="mx-auto text-lg"
              style={{ marginTop: "1rem", marginBottom: "1rem" }}
            >
              Your OTP is <strong>{props.otp}</strong>.
            </Text>
          </Section>
          <Hr />
          <Section>
            <Text className="mx-auto text-lg">
              If you didn't request this, please ignore this email. Your account
              is safe.
            </Text>
          </Section>
        </Container>
      </Tailwind>
    </Html>
  );
}
