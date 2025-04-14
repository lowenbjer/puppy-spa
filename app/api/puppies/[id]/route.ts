import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/puppies/[id] - get a specific puppy
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const puppy = await prisma.puppy.findUnique({
      where: { id },
    });

    if (!puppy) {
      return NextResponse.json(
        { error: 'Puppy not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(puppy);
  } catch (error) {
    console.error('Error fetching puppy:', error);
    return NextResponse.json(
      { error: 'Failed to fetch puppy' },
      { status: 500 }
    );
  }
}

// PUT /api/puppies/[id] - update a puppy
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const body = await request.json();
    
    // Check if puppy exists
    const existingPuppy = await prisma.puppy.findUnique({
      where: { id },
    });

    if (!existingPuppy) {
      return NextResponse.json(
        { error: 'Puppy not found' },
        { status: 404 }
      );
    }

    // Update puppy
    const updatedPuppy = await prisma.puppy.update({
      where: { id },
      data: {
        name: body.name ?? existingPuppy.name,
        breed: body.breed ?? existingPuppy.breed,
        ownerName: body.ownerName ?? existingPuppy.ownerName,
        contactInfo: body.contactInfo ?? existingPuppy.contactInfo,
        serviceType: body.serviceType ?? existingPuppy.serviceType,
        isServiced: body.isServiced !== undefined ? body.isServiced : existingPuppy.isServiced,
        order: body.order !== undefined ? body.order : existingPuppy.order,
      },
    });

    return NextResponse.json(updatedPuppy);
  } catch (error) {
    console.error('Error updating puppy:', error);
    return NextResponse.json(
      { error: 'Failed to update puppy' },
      { status: 500 }
    );
  }
}

// DELETE /api/puppies/[id] - delete a puppy
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    
    // Check if puppy exists
    const existingPuppy = await prisma.puppy.findUnique({
      where: { id },
    });

    if (!existingPuppy) {
      return NextResponse.json(
        { error: 'Puppy not found' },
        { status: 404 }
      );
    }

    // Delete puppy
    await prisma.puppy.delete({
      where: { id },
    });

    // Reorder remaining puppies for the same day
    const remainingPuppies = await prisma.puppy.findMany({
      where: {
        dateKey: existingPuppy.dateKey,
        order: {
          gt: existingPuppy.order,
        },
      },
      orderBy: {
        order: 'asc',
      },
    });

    // Update the order of remaining puppies
    for (const puppy of remainingPuppies) {
      await prisma.puppy.update({
        where: { id: puppy.id },
        data: { order: puppy.order - 1 },
      });
    }

    return NextResponse.json({ message: 'Puppy deleted successfully' });
  } catch (error) {
    console.error('Error deleting puppy:', error);
    return NextResponse.json(
      { error: 'Failed to delete puppy' },
      { status: 500 }
    );
  }
} 