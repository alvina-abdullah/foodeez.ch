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

interface ReservationEmailProps {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  occasion?: string;
  specialRequests?: string;
  businessName: string;
}

export const ReservationEmail = ({
  name,
  email,
  phone,
  date,
  time,
  guests,
  occasion,
  specialRequests,
  businessName,
}: ReservationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>New Reservation Request at {businessName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New Reservation Request</Heading>
          <Section style={section}>
            <Text style={text}>
              <strong>Restaurant:</strong> {businessName}
            </Text>
            <Text style={text}>
              <strong>Name:</strong> {name}
            </Text>
            <Text style={text}>
              <strong>Email:</strong> {email}
            </Text>
            <Text style={text}>
              <strong>Phone:</strong> {phone}
            </Text>
            <Text style={text}>
              <strong>Date:</strong> {date}
            </Text>
            <Text style={text}>
              <strong>Time:</strong> {time}
            </Text>
            <Text style={text}>
              <strong>Guests:</strong> {guests}
            </Text>
            {occasion && (
              <Text style={text}>
                <strong>Occasion:</strong> {occasion}
              </Text>
            )}
            {specialRequests && (
              <Text style={text}>
                <strong>Special Requests:</strong> {specialRequests}
              </Text>
            )}
          </Section>
          <Text style={footer}>
            This is an automated message from Foodeez reservation system.
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

const footer = {
  color: '#6b7280',
  fontSize: '14px',
  padding: '0 48px',
  marginTop: '32px',
};

export default ReservationEmail; 