import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface ContactEmailProps {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const ContactEmail = ({
  name,
  email,
  subject,
  message,
}: ContactEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>New Contact Form Submission: {subject}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New Contact Form Submission</Heading>
          <Section style={section}>
            <Text style={text}>
              <strong>Name:</strong> {name}
            </Text>
            <Text style={text}>
              <strong>Email:</strong> {email}
            </Text>
            <Text style={text}>
              <strong>Subject:</strong> {subject}
            </Text>
            <Text style={text}>
              <strong>Message:</strong>
            </Text>
            <Text style={messageText}>{message}</Text>
          </Section>
          <Text style={footer}>
            This is an automated message from Foodeez contact form.
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

const messageText = {
  color: '#4b5563',
  fontSize: '16px',
  lineHeight: '1.5',
  margin: '16px 0',
  whiteSpace: 'pre-wrap',
};

const footer = {
  color: '#6b7280',
  fontSize: '14px',
  padding: '0 48px',
  marginTop: '32px',
};

export default ContactEmail; 