export interface Country {
  code: string;
  name: string;
  flag: string;
  visaCount: number;
  visaTypes?: VisaType[];
}

export interface VisaType {
  id: string;
  name: string;
  description: string;
  requiredDocuments: RequiredDocument[];
  evaluationCriteria: {
    minSalary: number;
    requiredExperience: number;
    educationLevel: string;
  };
  maxScoreCap: number;
}

export interface RequiredDocument {
  type: string;
  label: string;
  description: string;
  required: boolean;
  maxSizeMB: number;
}
