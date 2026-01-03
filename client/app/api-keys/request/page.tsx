"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

export default function RequestApiKeyPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    useCase: "",
    website: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [keyId, setKeyId] = useState<string | null>(null);
  const [rateLimit, setRateLimit] = useState<number>(100);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api-keys/request`,
        formData
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setApiKey(response.data.data.apiKey);
        setKeyId(response.data.data.keyId);
        setRateLimit(response.data.data.rateLimit);
      }
    } catch (error) {
      const message = axios.isAxiosError(error) && error.response?.data?.message
        ? error.response.data.message
        : "Failed to create API key";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (apiKey) {
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
              <li>3. Rate Limit: <strong>{rateLimit} requests per day</strong></li>
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Request API Key</h1>
            <p className="text-gray-600 mt-2">Get instant access to our Visa Evaluation API</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">✨ What You'll Get:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Free API key with 100 requests/day</li>
              <li>• Access to 6+ countries visa evaluation</li>
              <li>• Instant API key generationli</li>
              <li>• Email verification for security</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Organization (Optional)</label>
              <input
                type="text"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Your company or organization"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website (Optional)</label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="https://yourwebsite.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Use Case <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.useCase}
                onChange={(e) => setFormData({ ...formData, useCase: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Tell us how you plan to use the API..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Submitting...
                </span>
              ) : (
                "Request API Key"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-blue-600 hover:text-blue-700">
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
