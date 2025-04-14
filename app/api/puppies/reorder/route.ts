import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// PUT /api/puppies/reorder - reorder puppies for a specific date
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { puppies, dateKey } = body;
    
    if (!puppies || !Array.isArray(puppies) || !dateKey) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }
    
    // Update the order of each puppy
    const updates = puppies.map((puppy, index) => 
      prisma.puppy.update({
        where: { id: puppy.id },
        data: { order: index },
      })
    );
    
    await prisma.$transaction(updates);
    
    // Get the updated puppies
    const updatedPuppies = await prisma.puppy.findMany({
      where: { dateKey },
      orderBy: { order: 'asc' },
    });
    
    return NextResponse.json(updatedPuppies);
  } catch (error) {
    console.error('Error reordering puppies:', error);
    return NextResponse.json(
      { error: 'Failed to reorder puppies' },
      { status: 500 }
    );
  }
} 