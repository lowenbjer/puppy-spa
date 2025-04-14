'use client';

import { useState } from 'react';
import { Puppy } from '../hooks/usePuppyWaitingList';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { SortablePuppyCard } from './SortablePuppyCard';

interface PuppyListProps {
  puppies: Puppy[];
  onRemovePuppy: (id: string) => void;
  onToggleServiced: (id: string) => void;
  currentDate: string;
  onReorderPuppies?: (puppies: Puppy[]) => void;
}

export default function PuppyList({ 
  puppies, 
  onRemovePuppy,
  onToggleServiced,
  currentDate,
  onReorderPuppies 
}: PuppyListProps) {
  const [activePuppiesState, setActivePuppiesState] = useState<Puppy[]>(
    puppies.filter(puppy => !puppy.isServiced)
  );

  // Initialize sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag end event
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    // Return if no target or same item
    if (!over || active.id === over.id) {
      return;
    }

    // Find the indices of the source and target items
    const oldIndex = activePuppiesState.findIndex(p => p.id === active.id);
    const newIndex = activePuppiesState.findIndex(p => p.id === over.id);
    
    // Update the order by using arrayMove helper
    const newPuppies = arrayMove(activePuppiesState, oldIndex, newIndex);
    
    // Update local state
    setActivePuppiesState(newPuppies);
    
    // Update parent component
    if (onReorderPuppies) {
      // Update the order of all puppies
      const updatedPuppies = newPuppies.map((puppy, idx) => ({
        ...puppy,
        order: idx
      }));
      
      // Combine with serviced puppies
      const servicedPuppies = puppies.filter(puppy => puppy.isServiced);
      onReorderPuppies([...updatedPuppies, ...servicedPuppies]);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Update active puppies when props change
  if (JSON.stringify(activePuppiesState) !== JSON.stringify(puppies.filter(p => !p.isServiced))) {
    setActivePuppiesState(puppies.filter(p => !p.isServiced));
  }

  if (puppies.length === 0) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center flex flex-col items-center justify-center min-h-[250px]">
        <p className="text-gray-500 text-lg mb-2">No puppies on the waiting list yet.</p>
        <p className="text-sm text-gray-400">
          {formatDate(currentDate)}
        </p>
      </div>
    );
  }

  const activePuppies = puppies.filter(puppy => !puppy.isServiced);
  const servicedPuppies = puppies.filter(puppy => puppy.isServiced);

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Waiting List</h2>
        <div className="text-sm text-gray-500">
          {formatDate(currentDate)}
        </div>
      </div>
      
      <div className="space-y-6">
        {activePuppies.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
              Waiting ({activePuppies.length})
            </h3>
            <DndContext 
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext 
                items={activePuppiesState}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4">
                  {activePuppiesState.map((puppy) => (
                    <SortablePuppyCard
                      key={puppy.id}
                      puppy={puppy}
                      onRemove={onRemovePuppy}
                      onToggleServiced={onToggleServiced}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        )}
        
        {servicedPuppies.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
              Serviced ({servicedPuppies.length})
            </h3>
            {servicedPuppies.map((puppy) => (
              <div
                key={puppy.id}
                className="border border-gray-200 rounded-lg p-5 relative hover:bg-gray-50 transition-colors bg-gray-50 opacity-75"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex flex-col justify-between">
                    <div className="flex items-center">
                      <h3 className="font-semibold text-lg text-gray-600 line-through mr-2">{puppy.name}</h3>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Completed
                      </span>
                    </div>
                    <p className="text-purple-400 font-medium">{puppy.breed}</p>
                    <p className="text-sm mt-1 text-indigo-300 font-medium">
                      Service: {puppy.serviceType}
                    </p>
                  </div>
                  
                  <div className="flex flex-col justify-between text-gray-500">
                    <p className="text-sm mb-1">
                      <span className="font-medium text-gray-700">Owner:</span> {puppy.ownerName}
                    </p>
                    <p className="text-sm mb-2">
                      <span className="font-medium text-gray-700">Contact:</span> {puppy.contactInfo}
                    </p>
                    <p className="text-xs text-blue-300 italic">
                      Added: {new Date(puppy.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div className="absolute top-0 right-3 flex flex-col h-full justify-between py-3 z-10">
                  <button
                    onClick={() => onRemovePuppy(puppy.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                    aria-label="Remove puppy"
                    title="Remove from list"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  <button
                    onClick={() => onToggleServiced(puppy.id)}
                    className="text-gray-400 hover:text-yellow-500 transition-colors p-1 rounded-full hover:bg-yellow-50"
                    aria-label="Mark as not serviced"
                    title="Return to waiting list"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 