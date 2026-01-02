'use client';

import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Country, VisaType } from '@/lib/types/country';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import UserInfoSection from './UserInfoSection';
import DocumentUploadSection from './DocumentUploadSection';
import { evaluationsApi } from '@/lib/api/evaluations';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

interface UserInfoData {
  name: string;
  email: string;
  phone: string;
}

interface EvaluationFormProps {
  country: Country;
  visaType: VisaType;
}

export default function EvaluationForm({
  country,
  visaType,
}: EvaluationFormProps) {
  const router = useRouter();
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserInfoData>();

  // Check if all required documents are uploaded
  // TEMPORARILY SIMPLIFIED - Only checking for resume
  const isFormValid = useMemo(() => {
    const hasResume = uploadedFiles['resume'];
    return hasResume;
    
    // ORIGINAL CODE - Commented out for now
    // const requiredDocs = visaType.requiredDocuments.filter((doc) => doc.required);
    // const hasAllRequired = requiredDocs.every((doc) => uploadedFiles[doc.type]);
    // return hasAllRequired;
  }, [uploadedFiles]);

  const handleFileChange = (documentType: string, file: File) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [documentType]: file,
    }));
  };

  const handleFileRemove = (documentType: string) => {
    setUploadedFiles((prev) => {
      const newFiles = { ...prev };
      delete newFiles[documentType];
      return newFiles;
    });
  };

  const onSubmit = async (data: UserInfoData) => {
    if (!isFormValid) {
      toast.error('Please upload your resume');
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      const evaluationData = {
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        countryCode: country.code,
        visaTypeId: visaType.id,
      };

      toast.loading('Uploading documents and analyzing...', {
        id: 'evaluation-submit',
      });

      const response = await evaluationsApi.create(
        evaluationData,
        uploadedFiles,
        (progress) => {
          setUploadProgress(progress);
        }
      );

      toast.success('Evaluation completed successfully!', {
        id: 'evaluation-submit',
      });

      // Navigate to results page
      router.push(`/results/${response.data.evaluationId}`);
    } catch (error) {
      console.error('Evaluation error:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to submit evaluation. Please try again.',
        { id: 'evaluation-submit' }
      );
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to country selection
        </button>

        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">{country.flag}</span>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {country.name} - {visaType.name}
            </h1>
            <p className="text-gray-600 mt-1">{visaType.description}</p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <span className="text-gray-600">Country & Visa Selected</span>
          </div>
          <div className="flex-1 h-px bg-gray-300" />
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full border-2 border-blue-600 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-blue-600" />
            </div>
            <span className="font-medium text-gray-900">Upload Documents</span>
          </div>
          <div className="flex-1 h-px bg-gray-300" />
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
            <span className="text-gray-400">Get Results</span>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* User Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <UserInfoSection register={register} errors={errors} />
          </CardContent>
        </Card>

        {/* Document Upload Card */}
        <Card>
          <CardHeader>
            <CardTitle>Step 2: Upload Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <DocumentUploadSection
              requiredDocuments={visaType.requiredDocuments}
              uploadedFiles={uploadedFiles}
              onFileChange={handleFileChange}
              onFileRemove={handleFileRemove}
            />
          </CardContent>
        </Card>

        {/* Upload Progress */}
        {isSubmitting && uploadProgress > 0 && (
          <Card>
            <CardContent className="py-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Uploading documents...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Submit Button */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/')}
            disabled={isSubmitting}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            isLoading={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? 'Processing...' : 'Submit Evaluation'}
          </Button>
        </div>
      </form>
    </div>
  );
}
