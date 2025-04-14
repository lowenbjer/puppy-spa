'use client';

import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { Puppy } from '../hooks/usePuppyWaitingList';

interface SortablePuppyCardProps {
  puppy: Puppy;
  onRemove: (id: string) => void;
  onToggleServiced: (id: string) => void;
}

export function SortablePuppyCard({ puppy, onRemove, onToggleServiced }: SortablePuppyCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: puppy.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border border-gray-200 rounded-lg p-5 relative hover:bg-gray-50 transition-colors"
    >
      <div 
        className="absolute top-0 left-0 right-0 h-full cursor-grab active:cursor-grabbing bg-transparent z-10"
        {...attributes}
        {...listeners}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="flex flex-col justify-between">
          <div className="flex items-center">
            <h3 className="font-semibold text-lg text-gray-800 mr-2">{puppy.name}</h3>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              #{puppy.order + 1}
            </span>
          </div>
          <p className="text-purple-600 font-medium">{puppy.breed}</p>
          <p className="text-sm mt-1 text-indigo-500 font-medium">
            Service: {puppy.serviceType}
          </p>
        </div>
        
        <div className="flex flex-col justify-between text-gray-700">
          <p className="text-sm mb-1">
            <span className="font-medium text-gray-900">Owner:</span> {puppy.ownerName}
          </p>
          <p className="text-sm mb-2">
            <span className="font-medium text-gray-900">Contact:</span> {puppy.contactInfo}
          </p>
          <p className="text-xs text-blue-500 italic">
            Added: {new Date(puppy.timestamp).toLocaleString()}
          </p>
        </div>
      </div>
      
      <div className="absolute top-0 right-3 flex flex-col h-full justify-between py-3 z-10">
        <button
          onClick={() => onRemove(puppy.id)}
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
          className="text-gray-400 hover:text-green-500 transition-colors p-1 rounded-full hover:bg-green-50"
          aria-label="Mark as serviced"
          title="Mark as serviced"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </button>

      </div>
    </div>
  );
} 