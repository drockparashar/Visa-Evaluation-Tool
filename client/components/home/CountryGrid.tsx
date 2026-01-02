'use client';

import React, { useState } from 'react';
import CountryCard from './CountryCard';
import VisaTypeModal from './VisaTypeModal';
import { Country } from '@/lib/types/country';

interface CountryGridProps {
  countries: Country[];
}

export default function CountryGrid({ countries }: CountryGridProps) {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCountryClick = async (country: Country) => {
    setSelectedCountry(country);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Small delay before clearing to allow modal close animation
    setTimeout(() => setSelectedCountry(null), 300);
  };

  return (
    <>
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Select Your Destination Country
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose a country to see available visa types and start your evaluation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {countries.map((country) => (
            <CountryCard
              key={country.code}
              country={country}
              onClick={() => handleCountryClick(country)}
            />
          ))}
        </div>
      </section>

      {selectedCountry && (
        <VisaTypeModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          country={selectedCountry}
        />
      )}
    </>
  );
}
