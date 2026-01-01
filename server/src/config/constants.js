export const MAX_FILE_SIZE =
  parseInt(process.env.MAX_FILE_SIZE_MB || "10") * 1024 * 1024; // 10MB default

export const ALLOWED_FILE_TYPES = {
  "application/pdf": ".pdf",
  "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    ".docx",
  "image/jpeg": ".jpg",
  "image/png": ".png",
};

export const DOCUMENT_TYPES = {
  RESUME: "resume",
  EMPLOYMENT_CONTRACT: "employment_contract",
  QUALIFICATIONS: "qualifications",
  POLICE_REPORT: "police_report",
  PERSONAL_STATEMENT: "personal_statement",
  PASSPORT: "passport",
  BANK_STATEMENT: "bank_statement",
  REFERENCE_LETTER: "reference_letter",
};

export const EVALUATION_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  COMPLETED: "completed",
  FAILED: "failed",
};

export const DEFAULT_MAX_SCORE_CAP = 85;
