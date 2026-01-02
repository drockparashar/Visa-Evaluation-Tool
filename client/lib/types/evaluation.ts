export interface EvaluationRequest {
  name: string;
  email: string;
  phone?: string;
  countryCode: string;
  visaTypeId: string;
}

export interface EvaluationResult {
  evaluationId: string;
  score: number;
  maxScore: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  status: string;
  createdAt: string;
}

export interface Evaluation {
  evaluationId: string;
  user: {
    name: string;
    email: string;
    phone?: string;
  };
  country: {
    code: string;
    name: string;
  };
  visaType: {
    id: string;
    name: string;
  };
  evaluation: {
    score: number;
    maxScore: number;
    summary: string;
    breakdown: {
      documentCompleteness: number;
      profileMatch: number;
      aiAnalysis: number;
    };
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    evaluatedAt: string;
  };
  status: string;
  createdAt: string;
}
