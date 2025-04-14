'use client';

import { useState } from 'react';

interface DateSelectorProps {
  currentDate: string;
  availableDates: string[];
  onCreateNewDay: () => void;
  onSwitchDate: (date: string) => void;
}

export default function DateSelector({ 
  currentDate, 
  availableDates, 
  onCreateNewDay, 
  onSwitchDate 
}: DateSelectorProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
    });
  };

  const isCurrentDate = (date: string) => {
    return currentDate === date;
  };

  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        <button
          onClick={onCreateNewDay}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Day
        </button>
        
        {availableDates.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDate(currentDate)}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isDropdownOpen && (
              <div className="absolute mt-1 right-0 z-10 w-48 bg-white rounded-md shadow-lg overflow-hidden">
                <div className="py-1 max-h-60 overflow-y-auto">
                  {availableDates.map(date => (
                    <button
                      key={date}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex justify-between items-center ${isCurrentDate(date) ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                      onClick={() => {
                        onSwitchDate(date);
                        setIsDropdownOpen(false);
                      }}
                    >
                      <span>{formatDate(date)}</span>
                      {isCurrentDate(date) && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 