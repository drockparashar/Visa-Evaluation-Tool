"use client"
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Key, Copy, Trash2, Calendar } from "lucide-react";

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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/admin/api-keys`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setKeys(data.data || []);
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
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/admin/api-keys/${keyId}`,
        {
          method: "DELETE",
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="px-8 pt-12 pb-10 border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex justify-between items-start">
          <div>
            <h1 className="text-5xl font-light text-black tracking-tight">API Keys</h1>
            <p className="text-lg text-gray-600 font-light mt-2">Manage partner API keys and access</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Create Key
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-12">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-96">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 border-2 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
              </div>
            </div>
          ) : keys.length === 0 ? (
            <EmptyState onCreateClick={() => setShowCreateModal(true)} />
          ) : (
            <div className="space-y-4">
              {keys.map((key) => (
                <ApiKeyCard key={key._id} apiKey={key} onRevoke={handleRevoke} />
              ))}
            </div>
          )}
        </div>
      </div>

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
  );
}

function ApiKeyCard({ apiKey, onRevoke }: { apiKey: ApiKey; onRevoke: (keyId: string) => void }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey.keyId);
    setCopied(true);
    toast.success("Key ID copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 hover:border-gray-300 hover:shadow-sm transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4 flex-1">
          <div className="p-3 bg-white rounded-xl border border-gray-200">
            <Key className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-medium text-black mb-1">{apiKey.name}</h3>
            <p className="text-sm text-gray-600 mb-3">{apiKey.partnerInfo.organization || "No organization"}</p>
            <div className="flex items-center gap-2">
              <code className="text-xs font-mono bg-white border border-gray-200 rounded px-3 py-2 text-gray-600 truncate flex-1">
                {apiKey.keyId}
              </code>
              <button
                onClick={copyToClipboard}
                className={`p-2 border rounded-lg transition-all ${
                  copied 
                    ? "bg-green-50 border-green-200" 
                    : "hover:bg-white border-gray-200"
                }`}
                title={copied ? "Copied!" : "Copy Key ID"}
              >
                <Copy className={`w-4 h-4 ${copied ? "text-green-600" : "text-gray-600"}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          {apiKey.isActive ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
              Active
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
              Revoked
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pt-6 border-t border-gray-200">
        <div>
          <p className="text-xs text-gray-600 font-medium mb-1">Partner</p>
          <p className="text-sm text-black font-medium">{apiKey.partnerInfo.name}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 font-medium mb-1">Email</p>
          <p className="text-sm text-black break-all">{apiKey.partnerInfo.email}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 font-medium mb-1">Rate Limit</p>
          <p className="text-sm text-black font-medium">{apiKey.rateLimit.requestsPerDay}/day</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 font-medium mb-1">Usage</p>
          <p className="text-sm text-black font-medium">{apiKey.usage.totalRequests} requests</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Calendar className="w-4 h-4" />
          Created {new Date(apiKey.createdAt).toLocaleDateString()}
        </div>
        {apiKey.isActive && (
          <button
            onClick={() => onRevoke(apiKey.keyId)}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
          >
            <Trash2 className="w-4 h-4" />
            Revoke
          </button>
        )}
      </div>
    </div>
  );
}

function EmptyState({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="p-4 bg-gray-100 rounded-3xl mb-6">
        <Key className="w-8 h-8 text-gray-600" />
      </div>
      <h3 className="text-2xl font-light text-black mb-2">No API Keys</h3>
      <p className="text-gray-600 font-light mb-8">Create your first API key to get started</p>
      <button
        onClick={onCreateClick}
        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
      >
        <Plus className="w-5 h-5" />
        Create API Key
      </button>
    </div>
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
  const [keyCopied, setKeyCopied] = useState(false);

  const copyCreatedKey = () => {
    if (createdKey) {
      navigator.clipboard.writeText(createdKey);
      setKeyCopied(true);
      toast.success("API key copied to clipboard");
      setTimeout(() => setKeyCopied(false), 2000);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/admin/api-keys`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      if (data.success) {
        setCreatedKey(data.data.apiKey);
        toast.success("API key created successfully");
      } else {
        toast.error(data.message || "Failed to create API key");
      }
    } catch (error) {
      toast.error("Failed to create API key");
    } finally {
      setIsLoading(false);
    }
  };

  if (createdKey) {
    return (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8">
          <div className="mb-6">
            <div className="p-3 bg-green-100 rounded-xl w-fit mb-4">
              <Key className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-3xl font-light text-black">API Key Created</h3>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-8">
            <p className="text-sm text-yellow-800 font-medium mb-4">
              ⚠️ Save this key now. You won't be able to see it again.
            </p>
            <div className="flex items-center gap-2">
              <div className="bg-white text-black rounded-xl p-4 font-mono text-sm break-all border border-yellow-100 select-all flex-1">
                {createdKey}
              </div>
              <button
                onClick={copyCreatedKey}
                className={`p-4 border rounded-xl transition-all ${
                  keyCopied 
                    ? "bg-green-50 border-green-200" 
                    : "bg-white hover:bg-gray-50 border-gray-200"
                }`}
                title={keyCopied ? "Copied!" : "Copy key"}
              >
                <Copy className={`w-5 h-5 ${keyCopied ? "text-green-600" : "text-gray-600"}`} />
              </button>
            </div>
          </div>

          <button
            onClick={onSuccess}
            className="w-full bg-blue-600 text-white py-3 rounded-full font-medium hover:bg-blue-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h3 className="text-3xl font-light text-black">Create API Key</h3>
            <p className="text-gray-600 font-light mt-1">Add a new API key for your partner</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Key Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 text-black py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
              placeholder="e.g., Production API Key"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Partner Name</label>
              <input
                type="text"
                value={formData.partnerName}
                onChange={(e) => setFormData({ ...formData, partnerName: e.target.value })}
                className="w-full px-4 py-3 text-black bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Partner Email</label>
              <input
                type="email"
                value={formData.partnerEmail}
                onChange={(e) => setFormData({ ...formData, partnerEmail: e.target.value })}
                className="w-full px-4 py-3 text-black bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Organization (Optional)</label>
            <input
              type="text"
              value={formData.organization}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              className="w-full px-4 py-3 text-black bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
              placeholder="Acme Corp"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Rate Limit</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={formData.requestsPerDay}
                onChange={(e) => setFormData({ ...formData, requestsPerDay: parseInt(e.target.value) })}
                className="flex-1 px-4 py-3 text-black bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                min="1"
              />
              <span className="text-sm text-gray-600 font-medium">requests/day</span>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 text-black border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? "Creating..." : "Create Key"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}