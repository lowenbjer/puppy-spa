'use client';

import { useState, useEffect, useRef } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

interface CalendarSelectorProps {
  currentDate: string;
  availableDates: string[];
  onSelectDate: (date: string) => void;
}

export default function CalendarSelector({ 
  currentDate, 
  availableDates,
  onSelectDate 
}: CalendarSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  const calendarRef = useRef<HTMLDivElement>(null);

  // Convert string dates to Date objects for comparison
  const parsedCurrentDate = new Date(currentDate);
  const parsedAvailableDates = availableDates.map(date => new Date(date));

  // Generate days for current month view
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(viewDate),
    end: endOfMonth(viewDate)
  });

  // Format date for display in the button
  const formatDisplayDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return format(date, 'E, MMM d');
    } catch {
      return 'Select date';
    }
  };

  // Handle clicking outside to close the calendar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Check if a date has puppies
  const hasAppointments = (date: Date) => {
    return parsedAvailableDates.some(availableDate => 
      isSameDay(availableDate, date)
    );
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setViewDate(prevDate => subMonths(prevDate, 1));
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setViewDate(prevDate => addMonths(prevDate, 1));
  };

  // Select a date and close the calendar
  const handleSelectDate = (date: Date) => {
    onSelectDate(format(date, 'yyyy-MM-dd'));
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={calendarRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white border border-gray-300 rounded-lg px-4 py-2 flex items-center text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <svg className="h-5 w-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {formatDisplayDate(currentDate)}
        <svg className="h-5 w-5 ml-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg p-5 z-50 border border-gray-200 w-[320px]">
          <div className="flex justify-between items-center mb-5">
            <button 
              onClick={goToPreviousMonth}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Previous month"
            >
              <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h3 className="font-semibold text-lg text-gray-900">
              {format(viewDate, 'MMMM yyyy')}
            </h3>
            <button 
              onClick={goToNextMonth}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Next month"
            >
              <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day: string) => (
              <div key={day} className="text-xs font-semibold text-gray-500 flex items-center justify-center h-8">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: startOfMonth(viewDate).getDay() }).map((_, index) => (
              <div key={`empty-start-${index}`} className="h-10 w-10" />
            ))}

            {daysInMonth.map(day => {
              const isAvailable = hasAppointments(day);
              const isSelected = isSameDay(day, parsedCurrentDate);
              const isCurrentMonth = isSameMonth(day, viewDate);
              const isToday = isSameDay(day, new Date());

              return (
                <div key={day.toString()} className="relative flex items-center justify-center h-10 w-10">
                  <button
                    onClick={() => handleSelectDate(day)}
                    disabled={!isAvailable && !isToday && !isSelected}
                    className={`
                      h-9 w-9 rounded-full flex items-center justify-center text-sm
                      ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-700'}
                      ${isSelected ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}
                      ${isToday && !isSelected ? 'border border-blue-500' : ''}
                      ${isAvailable && !isSelected ? 'font-medium' : ''}
                      ${isAvailable && !isSelected ? 'hover:bg-blue-100' : ''}
                      ${!isAvailable && isCurrentMonth && !isSelected ? 'text-gray-400 hover:bg-gray-100' : ''}
                      transition-colors
                    `}
                    aria-label={format(day, 'MMMM d, yyyy')}
                  >
                    {format(day, 'd')}
                  </button>
                  {isAvailable && !isSelected && (
                    <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 text-xs text-center text-gray-500 border-t border-gray-200">
            <div className="flex items-center justify-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              <span>Dates with appointments</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 