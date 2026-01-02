export const COUNTRIES = [
  {
    code: "IE",
    name: "Ireland",
    flag: "🇮🇪",
    visaTypes: [
      {
        id: "critical-skills",
        name: "Critical Skills Employment Permit",
        description:
          "For highly skilled professionals in eligible occupations earning at least €32,000 annually (or €64,000 for ineligible occupations).",
        requiredDocuments: [
          {
            type: "resume",
            label: "CV/Resume",
            description:
              "Detailed curriculum vitae highlighting your skills and experience",
            required: true,
            maxSizeMB: 5,
          },
          // TEMPORARILY COMMENTED OUT - Only using resume for now
          // {
          //   type: "employment_contract",
          //   label: "Employment Contract",
          //   description: "Job offer or contract from Irish employer",
          //   required: true,
          //   maxSizeMB: 5,
          // },
          // {
          //   type: "qualifications",
          //   label: "Educational Qualifications",
          //   description: "Degrees, diplomas, and professional certifications",
          //   required: true,
          //   maxSizeMB: 10,
          // },
        ],
        evaluationCriteria: {
          minSalary: 32000,
          requiredExperience: 2,
          educationLevel: "Bachelor",
        },
        maxScoreCap: 85,
      },
    ],
  },
  {
    code: "PL",
    name: "Poland",
    flag: "🇵🇱",
    visaTypes: [
      {
        id: "work-permit-c",
        name: "Work Permit Type C",
        description:
          "For foreign nationals employed by Polish entities or foreign entities with branches in Poland.",
        requiredDocuments: [
          {
            type: "resume",
            label: "CV/Resume",
            description: "Professional resume with work history",
            required: true,
            maxSizeMB: 5,
          },
          // TEMPORARILY COMMENTED OUT - Only using resume for now
          // {
          //   type: "employment_contract",
          //   label: "Employment Contract",
          //   description: "Contract with Polish employer",
          //   required: true,
          //   maxSizeMB: 5,
          // },
          // {
          //   type: "qualifications",
          //   label: "Educational Documents",
          //   description: "Diplomas and certificates",
          //   required: true,
          //   maxSizeMB: 10,
          // },
          // {
          //   type: "passport",
          //   label: "Passport Copy",
          //   description: "Valid passport copy",
          //   required: false,
          //   maxSizeMB: 5,
          // },
        ],
        evaluationCriteria: {
          minSalary: 0,
          requiredExperience: 1,
          educationLevel: "High School",
        },
        maxScoreCap: 85,
      },
    ],
  },
  {
    code: "DE",
    name: "Germany",
    flag: "🇩🇪",
    visaTypes: [
      {
        id: "eu-blue-card",
        name: "EU Blue Card",
        description:
          "For highly qualified professionals with university degree and job offer with minimum salary threshold.",
        requiredDocuments: [
          {
            type: "resume",
            label: "CV/Resume",
            description: "Comprehensive CV in German or English",
            required: true,
            maxSizeMB: 5,
            // TEMPORARILY COMMENTED OUT - Only using resume for now
            // {
            //   type: "employment_contract",
            //   label: "Employment Contract",
            //   description: "Job contract meeting salary threshold (€45,300+)",
            //   required: true,
            //   maxSizeMB: 5,
            // },
            // {
            //   type: "qualifications",
            //   label: "University Degree",
            //   description: "Recognized university degree or equivalent",
            //   required: true,
            //   maxSizeMB: 10,
            // },
            // {
            //   type: "passport",
            //   label: "Passport",
            //   description: "Valid passport",
            //   required: false,
            //   maxSizeMB: 5,
            //   maxSizeMB: 5,
          },
        ],
        evaluationCriteria: {
          minSalary: 45300,
          requiredExperience: 0,
          educationLevel: "Master",
        },
        maxScoreCap: 85,
      },
    ],
  },
  {
    code: "US",
    name: "United States",
    flag: "🇺🇸",
    visaTypes: [
      {
        id: "o1a",
        name: "O-1A (Extraordinary Ability in Sciences, Education, Business, or Athletics)",
        description:
          "For individuals with extraordinary ability demonstrated by sustained national or international acclaim.",
        requiredDocuments: [
          {
            type: "resume",
            label: "CV/Resume",
            description: "Detailed resume showing achievements and recognition",
            required: true,
            maxSizeMB: 5,
            // TEMPORARILY COMMENTED OUT - Only using resume for now
            // {
            //   type: "personal_statement",
            //   label: "Personal Statement",
            //   description:
            //     "Statement of your extraordinary abilities and accomplishments",
            //   required: true,
            //   maxSizeMB: 5,
            // },
            // {
            //   type: "reference_letter",
            //   label: "Reference Letters",
            //   description: "Letters from experts in your field",
            //   required: true,
            //   maxSizeMB: 10,
            // },
            // {
            //   type: "qualifications",
            //   label: "Awards and Recognition",
            //   description: "Documentation of awards, publications, patents, etc.",
            //   required: false,
            //   maxSizeMB: 10,
            //   maxSizeMB: 10,
          },
        ],
        evaluationCriteria: {
          minSalary: 0,
          requiredExperience: 5,
          educationLevel: "Bachelor",
        },
        maxScoreCap: 85,
      },
      {
        id: "h1b",
        name: "H-1B (Specialty Occupation)",
        description:
          "For professionals in specialty occupations requiring theoretical and practical application of specialized knowledge.",
        requiredDocuments: [
          {
            type: "resume",
            label: "CV/Resume",
            description: "Professional resume",
            required: true,
            // TEMPORARILY COMMENTED OUT - Only using resume for now
            // {
            //   type: "employment_contract",
            //   label: "Job Offer",
            //   description: "Offer letter from US employer",
            //   required: true,
            //   maxSizeMB: 5,
            // },
            // {
            //   type: "qualifications",
            //   label: "Educational Credentials",
            //   description: "Bachelor degree or equivalent",
            //   required: true,
            //   maxSizeMB: 10,
            //   required: true,
            maxSizeMB: 10,
          },
        ],
        evaluationCriteria: {
          minSalary: 60000,
          requiredExperience: 0,
          educationLevel: "Bachelor",
        },
        maxScoreCap: 85,
      },
    ],
  },
  {
    code: "CA",
    name: "Canada",
    flag: "🇨🇦",
    visaTypes: [
      {
        id: "express-entry",
        name: "Express Entry (Federal Skilled Worker)",
        description:
          "Points-based system for skilled workers with work experience and education.",
        requiredDocuments: [
          {
            type: "resume",
            label: "Resume",
            description: "Detailed work history",
            required: true,
            // TEMPORARILY COMMENTED OUT - Only using resume for now
            // {
            //   type: "qualifications",
            //   label: "Education Credentials",
            //   description: "Degrees and transcripts",
            //   required: true,
            //   maxSizeMB: 10,
            // },
            // {
            //   type: "reference_letter",
            //   label: "Employment Reference Letters",
            //   description: "Letters from previous employers",
            //   required: true,
            //   maxSizeMB: 10,
            // },
            // {
            //   type: "passport",
            //   label: "Passport",
            //   description: "Valid passport",
            //   required: false,
            //   maxSizeMB: 5,
            //   required: false,
            maxSizeMB: 5,
          },
        ],
        evaluationCriteria: {
          minSalary: 0,
          requiredExperience: 1,
          educationLevel: "Bachelor",
        },
        maxScoreCap: 85,
      },
    ],
  },
  {
    code: "AU",
    name: "Australia",
    flag: "🇦🇺",
    visaTypes: [
      {
        id: "skilled-independent-189",
        name: "Skilled Independent Visa (Subclass 189)",
        description:
          "Points-tested visa for skilled workers who are not sponsored.",
        requiredDocuments: [
          {
            type: "resume",
            label: "Resume",
            description: "Detailed CV with employment history",
            // TEMPORARILY COMMENTED OUT - Only using resume for now
            // {
            //   type: "qualifications",
            //   label: "Skills Assessment",
            //   description: "Educational qualifications and skills assessment",
            //   required: true,
            //   maxSizeMB: 10,
            // },
            // {
            //   type: "reference_letter",
            //   label: "Employment Evidence",
            //   description: "Reference letters and employment contracts",
            //   required: true,
            //   maxSizeMB: 10,
            //   description: "Reference letters and employment contracts",
            required: true,
            maxSizeMB: 10,
          },
        ],
        evaluationCriteria: {
          minSalary: 0,
          requiredExperience: 3,
          educationLevel: "Bachelor",
        },
        maxScoreCap: 85,
      },
    ],
  },
];

export const getCountryByCode = (code) => {
  return COUNTRIES.find((country) => country.code === code);
};

export const getVisaType = (countryCode, visaTypeId) => {
  const country = getCountryByCode(countryCode);
  if (!country) return null;
  return country.visaTypes.find((visa) => visa.id === visaTypeId);
};

export const getAllCountries = () => {
  return COUNTRIES.map(({ code, name, flag, visaTypes }) => ({
    code,
    name,
    flag,
    visaCount: visaTypes.length,
  }));
};
