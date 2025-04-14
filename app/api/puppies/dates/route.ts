import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET /api/puppies/dates - get all unique dates that have puppies
export async function GET() {
  try {
    const uniqueDates = await prisma.puppy.findMany({
      select: {
        dateKey: true,
      },
      distinct: ['dateKey'],
      orderBy: {
        dateKey: 'desc',
      },
    });
    
    const dates = uniqueDates.map((item: { dateKey: string }) => item.dateKey);
    
    return NextResponse.json(dates);
  } catch (error) {
    console.error('Error fetching dates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dates' },
      { status: 500 }
    );
  }
} 