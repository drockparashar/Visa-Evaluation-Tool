import axios from 'axios';
import { EvaluationRequest, EvaluationResult, Evaluation } from '../types/evaluation';
import { ApiResponse } from '../types/api';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const evaluationsApi = {
  /**
   * Create new evaluation with file uploads
   */
  create: async (
    data: EvaluationRequest,
    files: Record<string, File>,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<EvaluationResult>> => {
    const formData = new FormData();

    // Append text fields
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as string);
      }
    });

    // Append files
    Object.entries(files).forEach(([fieldName, file]) => {
      formData.append(fieldName, file);
    });

    const response = await axios.post(`${baseURL}/evaluations`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 120000, // 2 minutes
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    });

    return response.data;
  },

  /**
   * Get evaluation by ID
   */
  getById: async (id: string): Promise<ApiResponse<Evaluation>> => {
    const response = await axios.get(`${baseURL}/evaluations/${id}`);
    return response.data;
  },

  /**
   * Get evaluations by user email
   */
  getByEmail: async (
    email: string,
    limit: number = 10
  ): Promise<ApiResponse<Evaluation[]>> => {
    const response = await axios.get(`${baseURL}/evaluations/user/${email}`, {
      params: { limit },
    });
    return response.data;
  },

  /**
   * Download evaluation as PDF
   */
  downloadPDF: async (id: string): Promise<Blob> => {
    const response = await axios.get(`${baseURL}/evaluations/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },
};
