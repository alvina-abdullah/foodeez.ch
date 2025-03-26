// app/businesses/[slug]/page.tsx

import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { BusinessDetails } from '@/components/business/BusinessDetails';

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const businessId = parseInt(params.slug.split('-').pop() || '');
  const business = await prisma.business.findUnique({
    where: { BUSINESS_ID: businessId },
  });

  return {
    title: business?.BUSINESS_NAME || 'Business Details',
    description: business?.DESCRIPTION?.substring(0, 160),
    openGraph: {
      images: business?.IMAGE_URL ? [business.IMAGE_URL] : [],
    },
  };
}

export default async function BusinessPage({ params }: Props) {
  const businessId = parseInt(params.slug.split('-').pop() || '');
  
  const business = await prisma.business.findUnique({
    where: { BUSINESS_ID: businessId },
  });

  if (!business) {
    notFound();
  }

  return <BusinessDetails business={business} />;
}