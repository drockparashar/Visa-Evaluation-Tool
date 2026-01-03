"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import AdminProtectedRoute from "@/components/admin/AdminProtectedRoute";
import { toast } from "sonner";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Calendar } from "lucide-react";

interface UsageDataPoint {
  date: string;
  count: number;
}

interface CountryDataPoint {
  _id: string;
  count: number;
  [key: string]: string | number;
}

interface VisaTypeDataPoint {
  _id: string;
  count: number;
  [key: string]: string | number;
}

interface UsageApiItem {
  _id: { date: string };
  count: number;
}

export default function AnalyticsPage() {
  const [usageData, setUsageData] = useState<UsageDataPoint[]>([]);
  const [countryData, setCountryData] = useState<CountryDataPoint[]>([]);
  const [visaTypeData, setVisaTypeData] = useState<VisaTypeDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEvaluations: 0,
    avgDaily: 0,
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const [usage, countries, visaTypes] = await Promise.all([
        axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/admin/analytics/usage?days=30`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ),
        axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/admin/analytics/countries`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ),
        axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/admin/analytics/visa-types`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ),
      ]);

      // Process usage data
      const usageByDate = usage.data.data.reduce((acc: Record<string, UsageDataPoint>, item: UsageApiItem) => {
        const date = item._id.date;
        if (!acc[date]) {
          acc[date] = { date, count: 0 };
        }
        acc[date].count += item.count;
        return acc;
      }, {});

      const processedUsageData = Object.values(usageByDate) as UsageDataPoint[];
      setUsageData(processedUsageData);
      setCountryData(countries.data.data as CountryDataPoint[]);
      setVisaTypeData(visaTypes.data.data as VisaTypeDataPoint[]);

      // Calculate stats
      const totalEvals = processedUsageData.reduce((sum: number, item: UsageDataPoint) => sum + item.count, 0);
      const avgDaily = processedUsageData.length > 0 ? Math.round(totalEvals / processedUsageData.length) : 0;
      setStats({
        totalEvaluations: Number(totalEvals),
        avgDaily: Number(avgDaily),
      });
    } catch (error) {
      toast.error("Failed to fetch analytics");
    } finally {
      setIsLoading(false);
    }
  };

  const COLORS = ["#0071E3", "#00B4D8", "#06D6A0", "#FFB703", "#FB5607"];

  if (isLoading) {
    return (
      <AdminProtectedRoute>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminProtectedRoute>
    );
  }

  return (
    <AdminProtectedRoute>
      <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="px-8 pt-12 pb-10 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-light text-black tracking-tight">Analytics</h1>
          <p className="text-lg text-gray-600 font-light mt-2">Comprehensive insights at a glance</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-8 py-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
          <StatCard
            label="Total Evaluations"
            value={stats.totalEvaluations.toLocaleString()}
            icon={<TrendingUp className="w-5 h-5 text-blue-600" />}
          />
          <StatCard
            label="Daily Average"
            value={stats.avgDaily.toLocaleString()}
            icon={<Calendar className="w-5 h-5 text-blue-600" />}
          />
        </div>
      </div>

      {/* Charts */}
      <div className="px-8 pb-12">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Usage Over Time */}
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8 hover:border-gray-300 transition-colors duration-300">
            <div className="mb-6">
              <h2 className="text-xl font-light text-black">Usage Over Time</h2>
              <p className="text-gray-600 text-sm font-light mt-1">Last 30 days</p>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={usageData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="0" stroke="#e5e7eb" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12, fill: "#9CA3AF" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#9CA3AF" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                    }}
                    labelStyle={{ color: "#fff" }}
                    formatter={(value) => [value, "Evaluations"]}
                  />
                  <Line
                    type="natural"
                    dataKey="count"
                    stroke="#0071E3"
                    strokeWidth={3}
                    dot={false}
                    isAnimationActive={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Two Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Country Distribution */}
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8 hover:border-gray-300 transition-colors duration-300">
              <div className="mb-6">
                <h2 className="text-xl font-light text-black">Country Distribution</h2>
                <p className="text-gray-600 text-sm font-light mt-1">Geographic breakdown</p>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <Pie
                      data={countryData}
                      dataKey="count"
                      nameKey="_id"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label={(props) => {
                        // PieLabelRenderProps type fix
                        const labelId = (props as any)._id ?? '';
                        const percent = typeof props.percent === 'number' ? props.percent : 0;
                        return `${labelId} ${(percent * 100).toFixed(0)}%`;
                      }}
                      labelLine={false}
                    >
                      {countryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "none",
                        borderRadius: "12px",
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                      }}
                      labelStyle={{ color: "#fff" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Visa Type Distribution */}
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8 hover:border-gray-300 transition-colors duration-300">
              <div className="mb-6">
                <h2 className="text-xl font-light text-black">Visa Types</h2>
                <p className="text-gray-600 text-sm font-light mt-1">Top applications</p>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={visaTypeData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="0" stroke="#e5e7eb" vertical={false} />
                    <XAxis
                      dataKey="_id"
                      tick={{ fontSize: 12, fill: "#9CA3AF" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "#9CA3AF" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "none",
                        borderRadius: "12px",
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                      }}
                      labelStyle={{ color: "#fff" }}
                      formatter={(value) => [value, "Applications"]}
                    />
                    <Bar dataKey="count" fill="#0071E3" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </AdminProtectedRoute>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium mb-2">{label}</p>
          <p className="text-4xl font-light text-black">{value}</p>
        </div>
        {icon}
      </div>
    </div>
  );
}