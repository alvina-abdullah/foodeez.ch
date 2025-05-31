'use server';

import { prisma } from "../lib/prisma"
import { BusinessDetail } from "@/types/business.types";

interface SearchParams {
    name?: string;
    zipCode?: string;
  }
  
  export async function searchBusinesses(params: SearchParams): Promise<BusinessDetail[]> {
    try {
        const { name, zipCode } = params;
  
        console.log('SearchService - Search params:', { name, zipCode });
  
        if (!name && !zipCode) {
            return [];
        }
  
        const whereClause: any = {};
  
        if (name) {
            whereClause.BUSINESS_NAME = {
                contains: name,
                mode: 'insensitive',
            };
        }
  
        if (zipCode) {
            whereClause.ADDRESS_ZIP = {
                contains: zipCode,
            };
        }
  
        console.log('SearchService - Query where clause:', whereClause);
  
        const businesses = await prisma.business_detail_view_all.findMany({
            where: whereClause,
            take: 10,
            orderBy: {
                BUSINESS_NAME: 'asc',
            },
        });
  
        return businesses as BusinessDetail[];
    } catch (error) {
        console.error('SearchService - Error:', error);
        return [];
    }
  }
  