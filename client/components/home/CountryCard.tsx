import React from 'react';
import { Card } from '../ui/Card';
import { Country } from '@/lib/types/country';
import { FileText } from 'lucide-react';

interface CountryCardProps {
  country: Country;
  onClick: () => void;
}

export default function CountryCard({ country, onClick }: CountryCardProps) {
  return (
    <Card hover onClick={onClick} className="group">
      <div className="flex flex-col items-center text-center">
        {/* Flag */}
        <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform">
          {country.flag}
        </div>

        {/* Country Name */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {country.name}
        </h3>

        {/* Visa Count Badge */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FileText className="w-4 h-4" />
          <span>
            {country.visaCount} visa {country.visaCount === 1 ? 'type' : 'types'}
          </span>
        </div>

        {/* Click indicator */}
        <div className="mt-4 text-blue-600 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
          View visa options →
        </div>
      </div>
    </Card>
  );
}
