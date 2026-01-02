import apiClient from './axios';
import { Country, VisaType } from '../types/country';
import { ApiResponse } from '../types/api';

export const countriesApi = {
  /**
   * Get all countries
   */
  getAll: async (): Promise<ApiResponse<Country[]>> => {
    return apiClient.get('/countries');
  },

  /**
   * Get specific country by code
   */
  getByCode: async (code: string): Promise<ApiResponse<Country>> => {
    return apiClient.get(`/countries/${code}`);
  },

  /**
   * Get visa types for a specific country
   */
  getVisaTypes: async (
    code: string
  ): Promise<
    ApiResponse<{
      country: { code: string; name: string; flag: string };
      data: VisaType[];
    }>
  > => {
    return apiClient.get(`/countries/${code}/visa-types`);
  },

  /**
   * Get specific visa type
   */
  getVisaTypeById: async (
    code: string,
    visaId: string
  ): Promise<ApiResponse<VisaType>> => {
    return apiClient.get(`/countries/${code}/visa-types/${visaId}`);
  },
};
