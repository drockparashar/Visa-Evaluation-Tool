'use client';

import { useEffect } from 'react';
import { useEvaluation } from '@/context/EvaluationContext';
import { useRouter } from 'next/navigation';
import EvaluationForm from '@/components/evaluation/EvaluationForm';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function EvaluatePage() {
  const { selectedCountry, selectedVisaType } = useEvaluation();
  const router = useRouter();

  useEffect(() => {
    // Redirect if no selection
    if (!selectedCountry || !selectedVisaType) {
      router.push('/');
    }
  }, [selectedCountry, selectedVisaType, router]);

  // Show loading while checking
  if (!selectedCountry || !selectedVisaType) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Loading..." />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <EvaluationForm country={selectedCountry} visaType={selectedVisaType} />
    </main>
  );
}
