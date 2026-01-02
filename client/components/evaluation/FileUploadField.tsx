'use client';

import React, { useRef } from 'react';
import { Upload } from 'lucide-react';
import { RequiredDocument } from '@/lib/types/country';
import FilePreview from './FilePreview';
import { toast } from 'sonner';

interface FileUploadFieldProps {
  document: RequiredDocument;
  file: File | null;
  onChange: (file: File) => void;
  onRemove: () => void;
}

export default function FileUploadField({
  document,
  file,
  onChange,
  onRemove,
}: FileUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file size
    const maxSizeBytes = document.maxSizeMB * 1024 * 1024;
    if (selectedFile.size > maxSizeBytes) {
      toast.error(
        `File too large. Maximum size: ${document.maxSizeMB}MB`
      );
      return;
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error('Invalid file type. Please upload PDF, DOC, DOCX, JPG, or PNG');
      return;
    }

    onChange(selectedFile);
    
    // Reset input value to allow re-selecting the same file
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      {/* Label */}
      <label className="block text-sm font-medium text-gray-700">
        {document.label}
        {document.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Description */}
      <p className="text-sm text-gray-500">{document.description}</p>

      {/* Upload Area */}
      {!file ? (
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
        >
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-1">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-gray-500">
            PDF, DOC, DOCX, JPG, PNG (Max {document.maxSizeMB}MB)
          </p>
        </div>
      ) : (
        <FilePreview file={file} onRemove={onRemove} />
      )}

      {/* Hidden File Input */}
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
