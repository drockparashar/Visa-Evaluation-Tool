"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

export default function VerifyApiKeyPage() {
  const params = useParams();
  const token = params?.token as string;
  const [isLoading, setIsLoading] = useState(true);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [keyId, setKeyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      verifyToken();
    }
  }, [token]);

  const verifyToken = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api-keys/verify/${token}`
      );

      if (response.data.success) {
        setApiKey(response.data.data.apiKey);
        setKeyId(response.data.data.keyId);
        toast.success("API key created successfully!");
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Verification failed");
      toast.error(error.response?.data?.message || "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying your request...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <a
              href="/api-keys/request"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
            >
              Request New API Key
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-100 px-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">API Key Created!</h2>
          <p className="text-gray-600 mt-2">Your API key has been generated successfully</p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-800 font-medium mb-2">⚠️ Save this key now! It won't be shown again.</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Your API Key:</label>
          <div className="bg-white border border-gray-300 rounded-lg p-4 mb-3">
            <code className="text-sm font-mono break-all text-gray-900">{apiKey}</code>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(apiKey || "");
              toast.success("API key copied to clipboard");
            }}
            className="w-full bg-gray-100 text-gray-900 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            Copy to Clipboard
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">📚 Quick Start Guide:</h3>
          <ol className="text-sm text-blue-800 space-y-2">
            <li>1. Include the key in your API requests:</li>
            <li className="ml-4">
              <code className="bg-white px-2 py-1 rounded text-xs">X-API-Key: {keyId}...</code>
            </li>
            <li>2. API Endpoint: <code className="bg-white px-2 py-1 rounded text-xs">POST /api/evaluations</code></li>
            <li>3. Rate Limit: <strong>100 requests per day</strong></li>
            <li>4. Documentation: Check the main page for API docs</li>
          </ol>
        </div>

        <div className="flex gap-3">
          <a
            href="/"
            className="flex-1 text-center bg-gray-100 text-gray-900 py-3 px-4 rounded-lg font-medium hover:bg-gray-200"
          >
            Back to Home
          </a>
          <a
            href="/evaluate"
            className="flex-1 text-center bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700"
          >
            Try API Now
          </a>
        </div>
      </div>
    </div>
  );
}
