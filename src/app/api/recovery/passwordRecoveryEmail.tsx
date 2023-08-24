import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

export default function AccountManagementPasswordReset({
  user,
}: {
  user: { email: string; token: string; username: string; baseUrl: string };
}) {
  return (
    <Html>
      <Head />
      <Preview>Password Recovery</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={box}>
            <Text style={header}>Password Recovery</Text>

            <Text style={paragraph}>
              Hello, {user.username}! <br />
              <br />
              You have requested to reset your password.
              <br />
              Please click the button below to reset your password.
              <br />
              <br />
              If you did not request a password reset, please ignore this email.
            </Text>
            <Hr style={hr} />
            <Text style={paragraph}>
              Click the button below to reset your password:
            </Text>
            <Button
              pX={10}
              pY={10}
              style={button}
              href={`${user.baseUrl}/reset-password/${user.token}`}
            >
              Reset Password
            </Button>
            <Text style={paragraph}>
              If you cannot click the button, or encountered a problem <br />
              please use this link:
              <br />
              <Link href={`${user.baseUrl}/reset-password/${user.token}`}>
                Reset Password
              </Link>
            </Text>
            <Hr style={hr} />
            <Text style={footer}>— Made in Norway with Love ❤️</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const header = {
  backgroundColor: "#fff",
  borderBottom: "1px solid #e6ebf1",
  padding: "16px 48px",
  textAlign: "center" as const,
  fontSize: "24px",
  fontWeight: "bold",
  color: "#32325d",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  width: "100%",
};

const box = {
  padding: "0 48px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const paragraph = {
  color: "#525f7f",

  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const,
};

const anchor = {
  color: "#556cd6",
};

const button = {
  backgroundColor: "#656ee8",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "100%",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
};
