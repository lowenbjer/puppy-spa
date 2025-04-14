'use client';

import { useState } from 'react';
import { PuppyFormData } from '../hooks/usePuppyWaitingList';

interface PuppyFormProps {
  onAddPuppy: (puppy: PuppyFormData) => void;
}

const SERVICES = [
  "Bath & Brush",
  "Full Grooming",
  "Nail Trimming",
  "Ear Cleaning",
  "Teeth Brushing",
  "De-shedding Treatment",
  "Flea Treatment",
  "Spa Package"
];

export default function PuppyForm({ onAddPuppy }: PuppyFormProps) {
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [serviceType, setServiceType] = useState('Bath & Brush');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!name || !breed || !ownerName || !contactInfo || !serviceType) {
      alert('Please fill out all fields');
      return;
    }
    
    // Add puppy to the list
    onAddPuppy({ name, breed, ownerName, contactInfo, serviceType });
    
    // Reset form
    setName('');
    setBreed('');
    setOwnerName('');
    setContactInfo('');
    // Don't reset service type - keep it for next entry
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add to Waiting List</h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Puppy Name*
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-gray-800 placeholder-gray-500"
              placeholder="Fluffy"
            />
          </div>
          
          <div>
            <label htmlFor="breed" className="block text-sm font-medium text-gray-700 mb-1">
              Breed*
            </label>
            <input
              type="text"
              id="breed"
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-gray-800 placeholder-gray-500"
              placeholder="Golden Retriever"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700 mb-1">
            Owner Name*
          </label>
          <input
            type="text"
            id="ownerName"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-gray-800 placeholder-gray-500"
            placeholder="John Doe"
          />
        </div>
        
        <div>
          <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-700 mb-1">
            Contact Information*
          </label>
          <input
            type="text"
            id="contactInfo"
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-gray-800 placeholder-gray-500"
            placeholder="Phone or Email"
          />
        </div>
        
        <div>
          <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-1">
            Service Required*
          </label>
          <select
            id="serviceType"
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white text-gray-800"
          >
            {SERVICES.map(service => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
        </div>
        
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-2"
        >
          Add to Waiting List
        </button>
      </form>
    </div>
  );
} 