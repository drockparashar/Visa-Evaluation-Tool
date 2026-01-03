"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import AdminProtectedRoute from "@/components/admin/AdminProtectedRoute";
import { toast } from "sonner";

interface ApiKey {
  _id: string;
  keyId: string;
  name: string;
  partnerInfo: {
    name: string;
    email: string;
    organization?: string;
  };
  rateLimit: {
    requestsPerDay: number;
  };
  usage: {
    totalRequests: number;
    lastUsedAt?: Date;
  };
  isActive: boolean;
  createdAt: string;
  expiresAt?: string;
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/api-keys`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setKeys(response.data.data || []);
      }
    } catch (error) {
      toast.error("Failed to fetch API keys");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevoke = async (keyId: string) => {
    if (!confirm("Are you sure you want to revoke this API key?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/api-keys/${keyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("API key revoked successfully");
      fetchKeys();
    } catch (error) {
      toast.error("Failed to revoke API key");
    }
  };

  return (
    <AdminProtectedRoute>
      <div>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">API Keys</h1>
            <p className="text-gray-600 mt-2">Manage partner API keys and access</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create API Key
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Key ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Partner</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Usage</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Rate Limit</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Created</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {keys.map((key) => (
                  <tr key={key._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <code className="text-sm font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded">
                        {key.keyId}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{key.partnerInfo.name}</p>
                        <p className="text-xs text-gray-600">{key.partnerInfo.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{key.usage.totalRequests} requests</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{key.rateLimit.requestsPerDay}/day</p>
                    </td>
                    <td className="px-6 py-4">
                      {key.isActive ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Revoked
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{new Date(key.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {key.isActive && (
                        <button
                          onClick={() => handleRevoke(key.keyId)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Revoke
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {keys.length === 0 && (
              <div className="text-center py-12">
                <svg
                  className="w-12 h-12 text-gray-400 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
                <p className="text-gray-600">No API keys yet</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                >
                  Create your first API key
                </button>
              </div>
            )}
          </div>
        )}

        {showCreateModal && (
          <CreateKeyModal
            onClose={() => setShowCreateModal(false)}
            onSuccess={() => {
              setShowCreateModal(false);
              fetchKeys();
            }}
          />
        )}
      </div>
    </AdminProtectedRoute>
  );
}

function CreateKeyModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    partnerName: "",
    partnerEmail: "",
    organization: "",
    requestsPerDay: 100,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [createdKey, setCreatedKey] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/api-keys`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setCreatedKey(response.data.data.apiKey);
        toast.success("API key created successfully");
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

  if (createdKey) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">API Key Created</h3>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800 font-medium mb-2">
              ⚠️ Save this key now! It won't be shown again.
            </p>
            <div className="bg-white rounded p-3 font-mono text-sm break-all">{createdKey}</div>
          </div>
          <button
            onClick={onSuccess}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Create API Key</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Key Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Partner Name</label>
              <input
                type="text"
                value={formData.partnerName}
                onChange={(e) => setFormData({ ...formData, partnerName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Partner Email</label>
              <input
                type="email"
                value={formData.partnerEmail}
                onChange={(e) => setFormData({ ...formData, partnerEmail: e.target.value })}
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
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rate Limit (requests/day)</label>
            <input
              type="number"
              value={formData.requestsPerDay}
              onChange={(e) => setFormData({ ...formData, requestsPerDay: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              min="1"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? "Creating..." : "Create Key"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
