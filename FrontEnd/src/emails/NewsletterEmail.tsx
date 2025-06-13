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

interface NewsletterEmailProps {
  email: string;
}

export const NewsletterEmail = ({ email }: NewsletterEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Foodeez Newsletter!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome to Foodeez!</Heading>
          <Section style={section}>
            <Text style={text}>
              Thank you for subscribing to our newsletter. You'll now receive updates about:
            </Text>
            <ul style={list}>
              <li style={listItem}>New restaurants and food discoveries</li>
              <li style={listItem}>Special offers and promotions</li>
              <li style={listItem}>Food trends and recommendations</li>
              <li style={listItem}>Community events and updates</li>
            </ul>
            <Text style={text}>
              We're excited to share our food journey with you!
            </Text>
            <Button
              href="https://foodeez.ch"
              style={button}
            >
              Explore Foodeez
            </Button>
          </Section>
          <Text style={footer}>
            You're receiving this email because you subscribed to Foodeez newsletter with {email}
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

const list = {
  color: '#4b5563',
  fontSize: '16px',
  lineHeight: '1.5',
  margin: '16px 0',
  paddingLeft: '24px',
};

const listItem = {
  margin: '8px 0',
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

export default NewsletterEmail; 