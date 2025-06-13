import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface PasswordResetEmailProps {
  resetUrl: string;
}

export const PasswordResetEmail = ({ resetUrl }: PasswordResetEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Reset your Foodeez password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Reset Your Password</Heading>
          <Section style={section}>
            <Text style={text}>
              Click the button below to reset your password. This link will expire in 1 hour.
            </Text>
            <Button href={resetUrl} style={button}>
              Reset Password
            </Button>
            <Text style={text}>
              If you didn't request this, you can safely ignore this email.
            </Text>
          </Section>
          <Text style={footer}>
            This is an automated message, please do not reply to this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const section = {
  padding: '0 48px',
};

const h1 = {
  color: '#1f2937',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '1.3',
  padding: '0 48px',
};

const text = {
  color: '#4b5563',
  fontSize: '16px',
  lineHeight: '1.5',
  margin: '16px 0',
};

const button = {
  backgroundColor: '#4F46E5',
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '200px',
  padding: '12px 20px',
  margin: '24px 0',
};

const footer = {
  color: '#6b7280',
  fontSize: '14px',
  padding: '0 48px',
  marginTop: '32px',
};

export default PasswordResetEmail; 