'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Country, VisaType } from '@/lib/types/country';
import { countriesApi } from '@/lib/api/countries';
import { useEvaluation } from '@/context/EvaluationContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { CheckCircle2, FileText, DollarSign, GraduationCap, Briefcase } from 'lucide-react';

interface VisaTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  country: Country;
}

export default function VisaTypeModal({
  isOpen,
  onClose,
  country,
}: VisaTypeModalProps) {
  const [visaTypes, setVisaTypes] = useState<VisaType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVisa, setSelectedVisa] = useState<string | null>(null);
  const { setSelectedCountry, setSelectedVisaType } = useEvaluation();
  const router = useRouter();

  useEffect(() => {
    if (isOpen && country) {
      fetchVisaTypes();
    }
  }, [isOpen, country]);

  const fetchVisaTypes = async () => {
    setIsLoading(true);
    try {
      const response = await countriesApi.getVisaTypes(country.code);
      // Response structure: { success, country, data: VisaType[] }
      setVisaTypes(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      toast.error('Failed to load visa types');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    const visa = visaTypes.find((v) => v.id === selectedVisa);
    if (!visa) return;

    setSelectedCountry(country);
    setSelectedVisaType(visa);
    router.push('/evaluate');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title={`${country.flag} ${country.name} - Visa Types`}>
      {isLoading ? (
        <LoadingSpinner message="Loading visa types..." />
      ) : (
        <div className="space-y-4">
          <p className="text-gray-600 mb-6">
            Select the visa type you want to evaluate:
          </p>

          {visaTypes.map((visa) => (
            <div
              key={visa.id}
              onClick={() => setSelectedVisa(visa.id)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedVisa === visa.id
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="shrink-0 mt-1">
                  {selectedVisa === visa.id ? (
                    <CheckCircle2 className="w-6 h-6 text-blue-600" />
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                  )}
                </div>

                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {visa.name}
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    {visa.description}
                  </p>

                  {/* Criteria */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    {visa.evaluationCriteria.minSalary > 0 && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        <span>Min salary: ${visa.evaluationCriteria.minSalary.toLocaleString()}</span>
                      </div>
                    )}
                    {visa.evaluationCriteria.requiredExperience > 0 && (
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        <span>{visa.evaluationCriteria.requiredExperience}+ years exp.</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <GraduationCap className="w-4 h-4" />
                      <span>{visa.evaluationCriteria.educationLevel}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      <span>{visa.requiredDocuments.filter(d => d.required).length} docs required</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleContinue}
              disabled={!selectedVisa}
              className="flex-1"
            >
              Continue to Evaluation
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
