import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/puppies/search - search puppies across all dates
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query') || '';
    
    const puppies = await prisma.puppy.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { breed: { contains: query, mode: 'insensitive' } },
          { ownerName: { contains: query, mode: 'insensitive' } },
          { contactInfo: { contains: query, mode: 'insensitive' } },
          { serviceType: { contains: query, mode: 'insensitive' } }
        ]
      },
      orderBy: [
        { dateKey: 'desc' },
        { order: 'asc' }
      ]
    });
    
    return NextResponse.json(puppies);
  } catch (error) {
    console.error('Error searching puppies:', error);
    return NextResponse.json(
      { error: 'Failed to search puppies' },
      { status: 500 }
    );
  }
} 