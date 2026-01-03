'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { evaluationsApi } from '@/lib/api/evaluations';
import { Evaluation } from '@/lib/types/evaluation';
import {LoadingSpinner} from '@/components/ui/LoadingSpinner';
import {Button} from '@/components/ui/Button';
import ScoreCircle from '@/components/results/ScoreCircle';
import SummaryCard from '@/components/results/SummaryCard';
import StrengthsList from '@/components/results/StrengthsList';
import WeaknessesList from '@/components/results/WeaknessesList';
import SuggestionsList from '@/components/results/SuggestionsList';
import { ArrowLeft, FileDown, Mail } from 'lucide-react';
import { toast } from 'sonner';

interface ResultsPageProps {
  params: Promise<{
    evaluationId: string;
  }>;
}

export default function ResultsPage({ params }: ResultsPageProps) {
  const router = useRouter();
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [evaluationId, setEvaluationId] = useState<string>('');
  const [downloadingPDF, setDownloadingPDF] = useState(false);

  useEffect(() => {
    const initParams = async () => {
      const resolvedParams = await params;
      setEvaluationId(resolvedParams.evaluationId);
    };
    initParams();
  }, [params]);

  useEffect(() => {
    const fetchEvaluation = async () => {
      try {
        setLoading(true);
        const response = await evaluationsApi.getById(evaluationId);
        setEvaluation(response.data);
      } catch (err) {
        const message = axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : 'Failed to load evaluation results';
        setError(message);
        toast.error('Failed to load results');
      } finally {
        setLoading(false);
      }
    };

    if (evaluationId) {
      fetchEvaluation();
    }
  }, [evaluationId]);

  const handleDownloadReport = async () => {
    if (!evaluationId || !evaluation) return;

    try {
      setDownloadingPDF(true);
      toast.loading('Generating PDF report...', { id: 'pdf-download' });

      const blob = await evaluationsApi.downloadPDF(evaluationId);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Visa_Evaluation_${evaluation.evaluationId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('PDF downloaded successfully!', { id: 'pdf-download' });
    } catch (error) {
      toast.error('Failed to download PDF', { id: 'pdf-download' });
    } finally {
      setDownloadingPDF(false);
    }
  };

  const handleEmailReport = () => {
    toast.info('Email feature coming soon!');
    // TODO: Implement email functionality
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !evaluation) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-6">
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">⚠️</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Evaluation Not Found
            </h1>
            <p className="text-gray-600">
              {error || 'The evaluation you are looking for does not exist or has been removed.'}
            </p>
          </div>
          <Button onClick={() => router.push('/')} variant="primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const { evaluation: result } = evaluation;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/')}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </button>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Visa Evaluation Results
              </h1>
              <p className="text-gray-600">
                {evaluation.country.name} - {evaluation.visaType.name}
              </p>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              <Button
                onClick={handleDownloadReport}
                variant="outline"
                className="flex items-center gap-2"
                disabled={downloadingPDF}
                isLoading={downloadingPDF}
              >
                <FileDown className="w-4 h-4" />
                Download PDF
              </Button>
              <Button
                onClick={handleEmailReport}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Email Report
              </Button>
            </div>
          </div>
        </div>

        {/* Score Section */}
        <div className="mb-8 bg-white rounded-lg shadow-sm p-8 flex justify-center">
          <ScoreCircle score={result.score} maxScore={100} />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Summary */}
          <div className="lg:col-span-2">
            <SummaryCard summary={result.summary} />
          </div>

          {/* Strengths */}
          <StrengthsList strengths={result.strengths} />

          {/* Weaknesses */}
          <WeaknessesList weaknesses={result.weaknesses} />

          {/* Suggestions */}
          <div className="lg:col-span-2">
            <SuggestionsList suggestions={result.suggestions} />
          </div>
        </div>

        {/* User Info Section */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Application Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Applicant Name</p>
              <p className="font-medium text-gray-900">{evaluation.user.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-900">{evaluation.user.email}</p>
            </div>
            {evaluation.user.phone && (
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium text-gray-900">{evaluation.user.phone}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500">Submitted On</p>
              <p className="font-medium text-gray-900">
                {new Date(evaluation.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        </div>

        {/* New Evaluation Button */}
        <div className="mt-8 text-center">
          <Button onClick={() => router.push('/')} variant="primary" size="lg">
            Start New Evaluation
          </Button>
        </div>
      </div>
    </div>
  );
}
