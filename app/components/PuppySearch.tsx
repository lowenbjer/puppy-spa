'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Puppy } from '../hooks/usePuppyWaitingList';

interface PuppySearchProps {
  onSearch: (query: string) => Promise<Puppy[]>;
}

export default function PuppySearch({ onSearch }: PuppySearchProps) {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Puppy[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasSearchedRef = useRef(false);
  
  const performSearch = useCallback(async (searchQuery: string) => {
    if (hasSearchedRef.current) return;
    
    hasSearchedRef.current = true;
    
    try {
      setIsLoading(true);
      const results = await onSearch(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Error during search:', error);
    } finally {
      setIsLoading(false);
    }
  }, [onSearch]);

  useEffect(() => {
    if (!isSearching) return;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    hasSearchedRef.current = false;
    
    timeoutRef.current = setTimeout(() => {
      const trimmedQuery = query.trim();
      
      if (trimmedQuery.length >= 2 || trimmedQuery === '') {
        performSearch(trimmedQuery);
      }
    }, 200);
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query, isSearching, performSearch]);
  
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  
  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Toggle search modal
  const toggleSearch = () => {
    const newValue = !isSearching;
    setIsSearching(newValue);
    
    // Reset everything when opening/closing
    if (!newValue) {
      setQuery('');
      setSearchResults([]);
    } else {
      hasSearchedRef.current = false;
    }
  };

  return (
    <div>
      <button 
        onClick={toggleSearch}
        className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        Search Records
      </button>

      {isSearching && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Search Puppy Records</h3>
                <button 
                  onClick={toggleSearch}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-4 relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={isLoading ? "Searching..." : "Search by puppy name, owner, or breed..."}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  autoFocus
                />
                {isLoading && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                )}
              </div>
              
              <div className="overflow-y-auto max-h-96">
                {searchResults.length > 0 ? (
                  <div className="space-y-3">
                    {searchResults.map((puppy) => (
                      <div key={puppy.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-800">{puppy.name}</h4>
                            <p className="text-sm text-purple-600">{puppy.breed}</p>
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDate(puppy.dateKey)}
                          </div>
                        </div>
                        <div className="mt-2 text-sm">
                          <p><span className="font-medium">Owner:</span> {puppy.ownerName}</p>
                          <p><span className="font-medium">Service:</span> {puppy.serviceType}</p>
                          <p><span className="font-medium">Status:</span> {puppy.isServiced ? 'Completed' : 'Waiting'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : hasSearchedRef.current && !isLoading ? (
                  <div className="text-center py-6 text-gray-500">
                    No puppies found matching &quot;{query}&quot;
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    Type at least 2 characters to search for puppies
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 