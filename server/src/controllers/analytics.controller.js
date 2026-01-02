import analyticsService from "../services/analytics.service.js";

class AnalyticsController {
  /**
   * Get dashboard statistics
   * GET /api/admin/analytics/dashboard
   */
  async getDashboardStats(req, res) {
    try {
      const stats = await analyticsService.getDashboardStats();

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error("Dashboard stats error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch dashboard statistics",
      });
    }
  }

  /**
   * Get usage over time
   * GET /api/admin/analytics/usage
   */
  async getUsageOverTime(req, res) {
    try {
      const { days = 30 } = req.query;
      const usage = await analyticsService.getUsageOverTime(parseInt(days));

      res.status(200).json({
        success: true,
        data: usage,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch usage data",
      });
    }
  }

  /**
   * Get top API keys
   * GET /api/admin/analytics/top-keys
   */
  async getTopApiKeys(req, res) {
    try {
      const { limit = 10 } = req.query;
      const keys = await analyticsService.getTopApiKeys(parseInt(limit));

      res.status(200).json({
        success: true,
        data: keys,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch top API keys",
      });
    }
  }

  /**
   * Get country distribution
   * GET /api/admin/analytics/countries
   */
  async getCountryDistribution(req, res) {
    try {
      const distribution = await analyticsService.getCountryDistribution();

      res.status(200).json({
        success: true,
        data: distribution,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch country distribution",
      });
    }
  }

  /**
   * Get visa type distribution
   * GET /api/admin/analytics/visa-types
   */
  async getVisaTypeDistribution(req, res) {
    try {
      const distribution = await analyticsService.getVisaTypeDistribution();

      res.status(200).json({
        success: true,
        data: distribution,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch visa type distribution",
      });
    }
  }

  /**
   * Get recent activity
   * GET /api/admin/analytics/recent
   */
  async getRecentActivity(req, res) {
    try {
      const { limit = 20 } = req.query;
      const activity = await analyticsService.getRecentActivity(
        parseInt(limit)
      );

      res.status(200).json({
        success: true,
        data: activity,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch recent activity",
      });
    }
  }
}

export default new AnalyticsController();
