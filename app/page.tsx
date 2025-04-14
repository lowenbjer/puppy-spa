'use client';

import { useEffect, useState, useCallback } from 'react';
import Header from './components/Header';
import PuppyForm from './components/PuppyForm';
import PuppyList from './components/PuppyList';
import { usePuppyWaitingList, PuppyFormData } from './hooks/usePuppyWaitingList';

export default function Home() {
  const { 
    puppies, 
    currentDateKey,
    isLoading,
    addPuppy, 
    removePuppy,
    togglePuppyServiced,
    createNewDay,
    switchToDate,
    getAllDates,
    searchPuppies,
    reorderPuppies
  } = usePuppyWaitingList();

  const [availableDates, setAvailableDates] = useState<string[]>([]);
  
  useEffect(() => {
    const fetchDates = async () => {
      try {
        setAvailableDates(await getAllDates());
      } catch (error) {
        console.error('Error fetching dates:', error);
      }
    };
    
    fetchDates();
  }, [getAllDates]);
  
  useEffect(() => {
    if (availableDates.length === 0) {
      createNewDay();
    }
  }, [availableDates, createNewDay]);

  const handleAddPuppy = async (puppyData: PuppyFormData) => {
    const newPuppy = await addPuppy(puppyData);
    
    if (newPuppy) {
      if (!availableDates.includes(currentDateKey)) {
        setAvailableDates(prev => [...prev, currentDateKey].sort().reverse());
      }
    }
  };

  const handleRemovePuppy = async (id: string) => {
    if (confirm('Remove this puppy from the waiting list?')) {
      const success = await removePuppy(id);
      
      if (success && puppies.length <= 1) {
        const updatedDates = await getAllDates();
        setAvailableDates(updatedDates);
      }
    }
  };

  const handleSearch = useCallback(async (query: string) => {
    return await searchPuppies(query);
  }, [searchPuppies]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        currentDate={currentDateKey}
        availableDates={availableDates}
        onSwitchDate={switchToDate}
        onSearch={handleSearch}
      />
      
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
          <div className="lg:sticky lg:top-8 h-fit">
            <PuppyForm onAddPuppy={handleAddPuppy} />
          </div>
          
          <div>
            {isLoading ? (
              <div className="flex justify-center items-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <PuppyList 
                puppies={puppies} 
                onRemovePuppy={handleRemovePuppy}
                onToggleServiced={togglePuppyServiced}
                currentDate={currentDateKey}
                onReorderPuppies={reorderPuppies}
              />
            )}
          </div>
        </div>
      </main>
      
      <footer className="max-w-6xl mx-auto px-6 py-8 border-t border-gray-200 mt-8">
        <p className="text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Puppy Spa. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
