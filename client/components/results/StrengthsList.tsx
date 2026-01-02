import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { CheckCircle2 } from 'lucide-react';

interface StrengthsListProps {
  strengths: string[];
}

export default function StrengthsList({ strengths }: StrengthsListProps) {
  if (!strengths || strengths.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          Strengths
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {strengths.map((strength, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-gray-700 flex-1">{strength}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
