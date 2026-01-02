import mongoose from "mongoose";
import ApiKey from "../models/ApiKey.js";

class AnalyticsService {
  /**
   * Get dashboard statistics
   */
  async getDashboardStats() {
    try {
      const Evaluation = mongoose.model("Evaluation");

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const [
        totalKeys,
        activeKeys,
        todayRequests,
        totalEvaluations,
        avgScore,
        sourceDistribution,
      ] = await Promise.all([
        ApiKey.countDocuments(),
        ApiKey.countDocuments({ isActive: true }),
        Evaluation.countDocuments({ createdAt: { $gte: today } }),
        Evaluation.countDocuments(),
        Evaluation.aggregate([
          { $match: { "evaluation.score": { $exists: true } } },
          { $group: { _id: null, avgScore: { $avg: "$evaluation.score" } } },
        ]),
        Evaluation.aggregate([
          { $group: { _id: "$source", count: { $sum: 1 } } },
        ]),
      ]);

      return {
        totalApiKeys: totalKeys,
        activeApiKeys: activeKeys,
        todayRequests,
        totalEvaluations,
        averageScore: avgScore[0]?.avgScore || 0,
        sourceDistribution,
      };
    } catch (error) {
      console.error("Dashboard stats error:", error);
      throw error;
    }
  }

  /**
   * Get usage over time
   */
  async getUsageOverTime(days = 30) {
    try {
      const Evaluation = mongoose.model("Evaluation");

      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - days);

      const usage = await Evaluation.aggregate([
        { $match: { createdAt: { $gte: daysAgo } } },
        {
          $group: {
            _id: {
              date: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
              },
              source: "$source",
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.date": 1 } },
      ]);

      return usage;
    } catch (error) {
      console.error("Usage over time error:", error);
      throw error;
    }
  }

  /**
   * Get top API keys by usage
   */
  async getTopApiKeys(limit = 10) {
    try {
      const keys = await ApiKey.find({ isActive: true })
        .select("keyId name partnerInfo usage")
        .sort({ "usage.totalRequests": -1 })
        .limit(limit);

      return keys;
    } catch (error) {
      console.error("Top API keys error:", error);
      throw error;
    }
  }

  /**
   * Get country distribution
   */
  async getCountryDistribution() {
    try {
      const Evaluation = mongoose.model("Evaluation");

      const distribution = await Evaluation.aggregate([
        {
          $group: {
            _id: "$country.name",
            count: { $sum: 1 },
            avgScore: { $avg: "$evaluation.score" },
          },
        },
        { $sort: { count: -1 } },
      ]);

      return distribution;
    } catch (error) {
      console.error("Country distribution error:", error);
      throw error;
    }
  }

  /**
   * Get visa type distribution
   */
  async getVisaTypeDistribution() {
    try {
      const Evaluation = mongoose.model("Evaluation");

      const distribution = await Evaluation.aggregate([
        {
          $group: {
            _id: "$visaType.name",
            count: { $sum: 1 },
            avgScore: { $avg: "$evaluation.score" },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]);

      return distribution;
    } catch (error) {
      console.error("Visa type distribution error:", error);
      throw error;
    }
  }

  /**
   * Get recent activity
   */
  async getRecentActivity(limit = 20) {
    try {
      const Evaluation = mongoose.model("Evaluation");

      const activity = await Evaluation.find()
        .select(
          "evaluationId user.name country.name visaType.name evaluation.score source status createdAt"
        )
        .sort({ createdAt: -1 })
        .limit(limit);

      return activity;
    } catch (error) {
      console.error("Recent activity error:", error);
      throw error;
    }
  }
}

export default new AnalyticsService();
