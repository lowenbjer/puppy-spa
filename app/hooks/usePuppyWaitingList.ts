'use client';

import { useState, useEffect, useCallback } from 'react';

export interface Puppy {
  id: string;
  name: string;
  breed: string;
  ownerName: string;
  contactInfo: string;
  serviceType: string;
  timestamp: string;
  dateKey: string; // YYYY-MM-DD format for filtering by day
  isServiced: boolean;
  order: number;
}

export interface PuppyFormData {
  name: string;
  breed: string;
  ownerName: string;
  contactInfo: string;
  serviceType: string;
}

export interface DailyList {
  date: string; // YYYY-MM-DD format
  puppies: Puppy[];
}

export function usePuppyWaitingList() {
  const [allPuppies, setAllPuppies] = useState<Puppy[]>([]);
  const [currentDateKey, setCurrentDateKey] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Format date as YYYY-MM-DD
  const formatDateKey = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  // Initialize with today's date
  useEffect(() => {
    const today = new Date();
    const dateKey = formatDateKey(today);
    setCurrentDateKey(dateKey);
  }, []);
  
  // Fetch puppies for current date
  const fetchPuppiesForDate = useCallback(async (dateKey: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/puppies?dateKey=${dateKey}`);
      if (!response.ok) {
        throw new Error('Failed to fetch puppies');
      }
      const data = await response.json();
      setAllPuppies(data);
    } catch (error) {
      console.error('Error fetching puppies:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Fetch puppies when current date changes
  useEffect(() => {
    if (currentDateKey) {
      fetchPuppiesForDate(currentDateKey);
    }
  }, [currentDateKey, fetchPuppiesForDate]);

  // Get puppies for current date
  const currentDayPuppies = allPuppies
    .filter(puppy => puppy.dateKey === currentDateKey)
    .sort((a, b) => a.order - b.order);

  // Get all unique dates that have puppies
  const getAllDates = useCallback(async (): Promise<string[]> => {
    try {
      const response = await fetch('/api/puppies/dates');
      if (!response.ok) {
        throw new Error('Failed to fetch dates');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching dates:', error);
      return [];
    }
  }, []);

  const createNewDay = (date?: Date) => {
    const newDate = date || new Date();
    const newDateKey = formatDateKey(newDate);
    setCurrentDateKey(newDateKey);
  };

  const switchToDate = (dateKey: string) => {
    setCurrentDateKey(dateKey);
  };

  // Add puppy to the current day's list
  const addPuppy = async (puppyData: PuppyFormData): Promise<Puppy | null> => {
    try {
      const now = new Date();
      
      const newPuppyData = {
        ...puppyData,
        timestamp: now.toISOString(),
        dateKey: currentDateKey,
      };
      
      const response = await fetch('/api/puppies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPuppyData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add puppy');
      }
      
      const newPuppy = await response.json();
      
      setAllPuppies(prevPuppies => [...prevPuppies, newPuppy]);
      
      return newPuppy;
    } catch (error) {
      console.error('Error adding puppy:', error);
      return null;
    }
  };

  // Remove puppy from the list
  const removePuppy = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/puppies/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete puppy');
      }
      
      setAllPuppies(prevPuppies => prevPuppies.filter(puppy => puppy.id !== id));
      
      return true;
    } catch (error) {
      console.error('Error removing puppy:', error);
      return false;
    }
  };

  // Update puppy serviced status
  const togglePuppyServiced = async (id: string): Promise<boolean> => {
    try {
      const puppy = allPuppies.find(p => p.id === id);
      if (!puppy) return false;
      
      const response = await fetch(`/api/puppies/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isServiced: !puppy.isServiced,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update puppy');
      }
      
      const updatedPuppy = await response.json();
      
      // Update local state
      setAllPuppies(prevPuppies => 
        prevPuppies.map(p => p.id === id ? updatedPuppy : p)
      );
      
      return true;
    } catch (error) {
      console.error('Error updating puppy status:', error);
      return false;
    }
  };

  // Reorder puppies
  const reorderPuppies = async (newPuppies: Puppy[]): Promise<boolean> => {
    try {
      const response = await fetch('/api/puppies/reorder', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          puppies: newPuppies,
          dateKey: currentDateKey,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to reorder puppies');
      }
      
      const updatedPuppies = await response.json();
      
      // Update local state
      setAllPuppies(prevPuppies => {
        // Filter out puppies from the current day
        const otherDaysPuppies = prevPuppies.filter(puppy => puppy.dateKey !== currentDateKey);
        // Combine with updated current day puppies
        return [...otherDaysPuppies, ...updatedPuppies];
      });
      
      return true;
    } catch (error) {
      console.error('Error reordering puppies:', error);
      return false;
    }
  };

  const searchPuppies = useCallback(async (query: string): Promise<Puppy[]> => {
    if (!query.trim()) {
      return [];
    }
    
    try {
      setIsLoading(true);
      const response = await fetch(`/api/puppies/search?query=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error('Failed to search puppies');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error searching puppies:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { 
    puppies: currentDayPuppies, 
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
  };
} 