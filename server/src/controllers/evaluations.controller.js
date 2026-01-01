import evaluationService from "../services/evaluation.service.js";

class EvaluationsController {
  /**
   * Create new evaluation
   * POST /api/evaluations
   */
  async createEvaluation(req, res) {
    try {
      const { name, email, phone, countryCode, visaTypeId } = req.body;

      // Validate required fields
      if (!name || !email || !countryCode || !visaTypeId) {
        return res.status(400).json({
          success: false,
          message:
            "Missing required fields: name, email, countryCode, visaTypeId",
        });
      }

      // Check if files were uploaded
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
          success: false,
          message: "No documents uploaded. Please upload required documents.",
        });
      }

      // Prepare data
      const evaluationData = {
        name,
        email,
        phone,
        countryCode: countryCode.toUpperCase(),
        visaTypeId,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get("user-agent"),
      };

      // Create evaluation
      const evaluation = await evaluationService.createEvaluation(
        evaluationData,
        req.files
      );

      res.status(201).json({
        success: true,
        message: "Evaluation completed successfully",
        data: {
          evaluationId: evaluation.evaluationId,
          score: evaluation.evaluation.score,
          maxScore: evaluation.evaluation.maxScore,
          summary: evaluation.evaluation.summary,
          strengths: evaluation.evaluation.strengths,
          weaknesses: evaluation.evaluation.weaknesses,
          suggestions: evaluation.evaluation.suggestions,
          status: evaluation.status,
          createdAt: evaluation.createdAt,
        },
      });
    } catch (error) {
      console.error("Create evaluation error:", error);

      res.status(500).json({
        success: false,
        message: "Error creating evaluation",
        error: error.message,
      });
    }
  }

  /**
   * Get evaluation by ID
   * GET /api/evaluations/:id
   */
  async getEvaluationById(req, res) {
    try {
      const { id } = req.params;
      const evaluation = await evaluationService.getEvaluationById(id);

      if (!evaluation) {
        return res.status(404).json({
          success: false,
          message: "Evaluation not found",
        });
      }

      // Return evaluation without document extracted text (too large)
      const response = evaluation.toObject();
      if (response.documents) {
        response.documents = response.documents.map((doc) => ({
          type: doc.type,
          originalName: doc.originalName,
          fileSize: doc.fileSize,
          uploadedAt: doc.uploadedAt,
        }));
      }

      res.status(200).json({
        success: true,
        data: response,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching evaluation",
        error: error.message,
      });
    }
  }

  /**
   * Get evaluations by email
   * GET /api/evaluations/user/:email
   */
  async getEvaluationsByEmail(req, res) {
    try {
      const { email } = req.params;
      const limit = parseInt(req.query.limit) || 10;

      const evaluations = await evaluationService.getEvaluationsByEmail(
        email,
        limit
      );

      res.status(200).json({
        success: true,
        count: evaluations.length,
        data: evaluations,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching user evaluations",
        error: error.message,
      });
    }
  }

  /**
   * Get all evaluations (with filters)
   * GET /api/evaluations
   */
  async getAllEvaluations(req, res) {
    try {
      const { status, countryCode, email, page = 1, limit = 20 } = req.query;

      const filters = {};
      if (status) filters.status = status;
      if (countryCode) filters.countryCode = countryCode;
      if (email) filters.email = email;

      const result = await evaluationService.getAllEvaluations(
        filters,
        parseInt(page),
        parseInt(limit)
      );

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching evaluations",
        error: error.message,
      });
    }
  }

  /**
   * Delete evaluation
   * DELETE /api/evaluations/:id
   */
  async deleteEvaluation(req, res) {
    try {
      const { id } = req.params;
      await evaluationService.deleteEvaluation(id);

      res.status(200).json({
        success: true,
        message: "Evaluation deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error deleting evaluation",
        error: error.message,
      });
    }
  }
}

export default new EvaluationsController();
