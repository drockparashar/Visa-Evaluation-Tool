'use client';

import React from 'react';
import { RequiredDocument } from '@/lib/types/country';
import FileUploadField from './FileUploadField';

interface DocumentUploadSectionProps {
  requiredDocuments: RequiredDocument[];
  uploadedFiles: Record<string, File>;
  onFileChange: (documentType: string, file: File) => void;
  onFileRemove: (documentType: string) => void;
}

export default function DocumentUploadSection({
  requiredDocuments,
  uploadedFiles,
  onFileChange,
  onFileRemove,
}: DocumentUploadSectionProps) {
  // TEMPORARILY SIMPLIFIED - Only showing resume upload
  const resumeDoc = requiredDocuments.find(doc => doc.type === 'resume');
  
  if (!resumeDoc) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Required Document
        </h3>
        <p className="text-sm text-gray-600">
          Please upload your resume/CV to proceed with your evaluation.
        </p>
      </div>

      <div className="space-y-6">
        <FileUploadField
          key={resumeDoc.type}
          document={resumeDoc}
          file={uploadedFiles[resumeDoc.type] || null}
          onChange={(file) => onFileChange(resumeDoc.type, file)}
          onRemove={() => onFileRemove(resumeDoc.type)}
        />
        
        {/* TEMPORARILY COMMENTED OUT - Other documents */}
        {/* {requiredDocuments
          .filter(doc => doc.type !== 'resume')
          .map((doc) => (
            <FileUploadField
              key={doc.type}
              document={doc}
              file={uploadedFiles[doc.type] || null}
              onChange={(file) => onFileChange(doc.type, file)}
              onRemove={() => onFileRemove(doc.type)}
            />
          ))} */}
      </div>
    </div>
  );
}
