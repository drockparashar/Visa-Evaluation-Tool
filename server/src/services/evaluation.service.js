import Evaluation from "../models/Evaluation.js";
import documentService from "./document.service.js";
import geminiService from "./gemini.service.js";
import { getVisaType, getCountryByCode } from "../config/countries.js";

class EvaluationService {
  /**
   * Create a new visa evaluation
   */
  async createEvaluation(data, files) {
    const startTime = Date.now();
    let evaluation = null; // Declare outside try-catch for error handling

    try {
      // 1. Validate country and visa type
      const country = getCountryByCode(data.countryCode);
      if (!country) {
        throw new Error(`Country with code ${data.countryCode} not found`);
      }

      const visaType = getVisaType(data.countryCode, data.visaTypeId);
      if (!visaType) {
        throw new Error(
          `Visa type ${data.visaTypeId} not found for ${country.name}`
        );
      }

      // 2. Create evaluation record
      evaluation = new Evaluation({
        user: {
          name: data.name,
          email: data.email,
          phone: data.phone || "",
        },
        country: {
          code: country.code,
          name: country.name,
        },
        visaType: {
          id: visaType.id,
          name: visaType.name,
        },
        status: "processing",
        metadata: {
          ipAddress: data.ipAddress || "",
          userAgent: data.userAgent || "",
        },
      });

      // Save to get evaluationId (pre-save hook generates it)
      await evaluation.save();

      // 3. Process uploaded documents
      const processedDocuments = await documentService.processUploadedFiles(
        files,
        evaluation.evaluationId
      );

      evaluation.documents = processedDocuments;

      // 4. Check document completeness
      const documentCompletenessScore = this.calculateDocumentCompleteness(
        visaType.requiredDocuments,
        processedDocuments
      );

      // 5. Run AI evaluation
      const aiEvaluation = await geminiService.evaluateVisa(
        visaType,
        evaluation.user,
        processedDocuments,
        country
      );

      // 6. Calculate final score with breakdown
      const finalScore = Math.min(aiEvaluation.score, visaType.maxScoreCap);

      // 7. Store evaluation results
      evaluation.evaluation = {
        score: finalScore,
        maxScore: visaType.maxScoreCap,
        summary: aiEvaluation.summary,
        breakdown: {
          documentCompleteness: documentCompletenessScore,
          profileMatch: aiEvaluation.score,
          aiAnalysis: aiEvaluation.score,
        },
        strengths: aiEvaluation.strengths,
        weaknesses: aiEvaluation.weaknesses,
        suggestions: aiEvaluation.suggestions,
        evaluatedAt: new Date(),
        evaluationTimeMs: Date.now() - startTime,
      };

      evaluation.aiProcessing = {
        model: aiEvaluation.model,
        tokensUsed: aiEvaluation.tokensUsed,
        promptVersion: "v1.0",
      };

      evaluation.status = "completed";

      // 8. Save final evaluation
      await evaluation.save();

      return evaluation;
    } catch (error) {
      console.error("Evaluation error:", error);

      // Update evaluation with error status if it was created
      if (evaluation && evaluation._id) {
        evaluation.status = "failed";
        evaluation.errorMessage = error.message;
        await evaluation.save();
      }

      throw error;
    }
  }

  /**
   * Calculate document completeness score
   */
  calculateDocumentCompleteness(requiredDocuments, uploadedDocuments) {
    const requiredDocs = requiredDocuments.filter((doc) => doc.required);
    const uploadedTypes = uploadedDocuments.map((doc) => doc.type);

    const requiredCount = requiredDocs.length;
    const uploadedRequiredCount = requiredDocs.filter((doc) =>
      uploadedTypes.includes(doc.type)
    ).length;

    if (requiredCount === 0) return 100;

    const completeness = (uploadedRequiredCount / requiredCount) * 100;
    return Math.round(completeness);
  }

  /**
   * Get evaluation by ID
   */
  async getEvaluationById(evaluationId) {
    try {
      const evaluation = await Evaluation.findOne({ evaluationId });

      if (!evaluation) {
        throw new Error("Evaluation not found");
      }

      return evaluation;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get evaluations by email
   */
  async getEvaluationsByEmail(email, limit = 10) {
    try {
      const evaluations = await Evaluation.find({ "user.email": email })
        .sort({ createdAt: -1 })
        .limit(limit)
        .select("-documents.extractedText"); // Exclude large text fields

      return evaluations;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all evaluations (admin)
   */
  async getAllEvaluations(filters = {}, page = 1, limit = 20) {
    try {
      const query = {};

      if (filters.status) {
        query.status = filters.status;
      }

      if (filters.countryCode) {
        query["country.code"] = filters.countryCode;
      }

      if (filters.email) {
        query["user.email"] = new RegExp(filters.email, "i");
      }

      const skip = (page - 1) * limit;

      const [evaluations, total] = await Promise.all([
        Evaluation.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .select("-documents.extractedText"),
        Evaluation.countDocuments(query),
      ]);

      return {
        evaluations,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete evaluation
   */
  async deleteEvaluation(evaluationId) {
    try {
      const evaluation = await Evaluation.findOne({ evaluationId });

      if (!evaluation) {
        throw new Error("Evaluation not found");
      }

      // Delete associated documents
      await documentService.deleteEvaluationDocuments(evaluationId);

      // Delete evaluation record
      await Evaluation.deleteOne({ evaluationId });

      return true;
    } catch (error) {
      throw error;
    }
  }
}

export default new EvaluationService();
