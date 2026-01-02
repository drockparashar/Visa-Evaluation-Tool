'use client';

import React from 'react';

interface ScoreCircleProps {
  score: number;
  maxScore: number;
}

export default function ScoreCircle({ score, maxScore }: ScoreCircleProps) {
  const percentage = (score / maxScore) * 100;
  const circumference = 2 * Math.PI * 80;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = () => {
    if (percentage < 40) return '#ef4444'; // Red
    if (percentage < 65) return '#f59e0b'; // Orange
    return '#10b981'; // Green
  };

  const getColorClass = () => {
    if (percentage < 40) return 'text-red-600';
    if (percentage < 65) return 'text-orange-600';
    return 'text-green-600';
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-48">
        <svg className="transform -rotate-90 w-48 h-48">
          {/* Background circle */}
          <circle
            cx="96"
            cy="96"
            r="80"
            stroke="#e5e7eb"
            strokeWidth="12"
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx="96"
            cy="96"
            r="80"
            stroke={getColor()}
            strokeWidth="12"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-5xl font-bold ${getColorClass()}`}>
            {score}
          </span>
          <span className="text-gray-500 text-lg">/ {maxScore}</span>
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-lg font-semibold text-gray-900">Your Visa Score</p>
        <p className="text-sm text-gray-600">
          {percentage < 40 && 'Needs Improvement'}
          {percentage >= 40 && percentage < 65 && 'Fair Application'}
          {percentage >= 65 && 'Strong Application'}
        </p>
      </div>
    </div>
  );
}
