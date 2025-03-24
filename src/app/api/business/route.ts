// /app/api/business/route.ts

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {

    try {
      const business = await prisma.business.findMany({ take: 10 });

      console.log("Fetched business:", business);

      return NextResponse.json(business);

    } catch (error) {

      console.error("Error fetching business:", error);
      
      return NextResponse.json({ error: "Failed to fetch business" }, { status: 500 });
    }
  }