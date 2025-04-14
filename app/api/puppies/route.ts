import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/puppies - get all puppies or filter by date
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const dateKey = searchParams.get('dateKey');
    
    let puppies;
    if (dateKey) {
      // Filter by dateKey if provided
      puppies = await prisma.puppy.findMany({
        where: {
          dateKey,
        },
        orderBy: {
          order: 'asc',
        },
      });
    } else {
      // Get all puppies
      puppies = await prisma.puppy.findMany({
        orderBy: [
          {
            dateKey: 'desc',
          },
          {
            order: 'asc',
          },
        ],
      });
    }
    
    return NextResponse.json(puppies);
  } catch (error) {
    console.error('Error fetching puppies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch puppies' },
      { status: 500 }
    );
  }
}

// POST /api/puppies - create a new puppy
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Get highest order number for the current day
    const highestOrder = await prisma.puppy.findFirst({
      where: {
        dateKey: body.dateKey,
      },
      orderBy: {
        order: 'desc',
      },
      select: {
        order: true,
      },
    });
    
    const newOrder = highestOrder ? highestOrder.order + 1 : 0;
    
    // Create new puppy record
    const newPuppy = await prisma.puppy.create({
      data: {
        name: body.name,
        breed: body.breed,
        ownerName: body.ownerName,
        contactInfo: body.contactInfo,
        serviceType: body.serviceType,
        dateKey: body.dateKey,
        isServiced: false,
        order: newOrder,
        timestamp: new Date(body.timestamp || new Date()),
      },
    });
    
    return NextResponse.json(newPuppy, { status: 201 });
  } catch (error) {
    console.error('Error creating puppy:', error);
    return NextResponse.json(
      { error: 'Failed to create puppy' },
      { status: 500 }
    );
  }
} 