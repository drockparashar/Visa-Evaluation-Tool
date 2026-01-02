import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { AlertCircle } from 'lucide-react';

interface WeaknessesListProps {
  weaknesses: string[];
}

export default function WeaknessesList({ weaknesses }: WeaknessesListProps) {
  if (!weaknesses || weaknesses.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-orange-600" />
          Areas for Improvement
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {weaknesses.map((weakness, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center mt-0.5">
                <AlertCircle className="w-4 h-4 text-orange-600" />
              </div>
              <span className="text-gray-700 flex-1">{weakness}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
