import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

class GeminiService {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      console.warn("⚠️  GEMINI_API_KEY not found in environment variables");
    }

    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  /**
   * Build evaluation prompt for Gemini
   */
  buildEvaluationPrompt(visaType, userData, documents, country) {
    const documentSummaries = documents
      .map((doc) => {
        const text = doc.extractedText || "No text extracted";
        const preview =
          text.length > 500 ? text.substring(0, 500) + "..." : text;
        return `
        Document Type: ${doc.type}
        File Name: ${doc.originalName}
        Content Preview: ${preview}
        `;
      })
      .join("\n---\n");

    return `You are an expert visa evaluation consultant specializing in immigration assessments.

EVALUATION TASK:
Assess the visa application for: ${country.name} - ${visaType.name}

VISA INFORMATION:
- Visa Type: ${visaType.name}
- Description: ${visaType.description}
- Required Documents: ${visaType.requiredDocuments
      .map((d) => d.label)
      .join(", ")}
- Evaluation Criteria:
  * Minimum Salary: ${
    visaType.evaluationCriteria.minSalary > 0
      ? "$" + visaType.evaluationCriteria.minSalary
      : "Not specified"
  }
  * Required Experience: ${visaType.evaluationCriteria.requiredExperience} years
  * Education Level: ${visaType.evaluationCriteria.educationLevel}

APPLICANT PROFILE:
- Name: ${userData.name}
- Email: ${userData.email}
${userData.phone ? `- Phone: ${userData.phone}` : ""}

UPLOADED DOCUMENTS:
${documentSummaries}

INSTRUCTIONS:
1. Analyze the applicant's profile and documents against the visa requirements
2. Assess document completeness and quality
3. Evaluate the strength of the application
4. Provide an objective score between 0-100 (DO NOT exceed ${
      visaType.maxScoreCap
    })
5. Identify key strengths, weaknesses, and provide actionable suggestions

IMPORTANT: Your score must NOT exceed ${
      visaType.maxScoreCap
    } points, even if the application is perfect.

Respond ONLY with valid JSON in this exact format (no markdown, no code blocks):
{
  "score": 75,
  "summary": "A 2-3 paragraph assessment of the overall application strength and likelihood of approval",
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "weaknesses": ["Weakness 1", "Weakness 2"],
  "suggestions": ["Specific actionable suggestion 1", "Specific actionable suggestion 2", "Specific actionable suggestion 3"]
}`;
  }

  /**
   * Evaluate visa application using Gemini
   */
  async evaluateVisa(visaType, userData, documents, country) {
    try {
      const prompt = this.buildEvaluationPrompt(
        visaType,
        userData,
        documents,
        country
      );

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse JSON response
      const evaluation = this.parseEvaluationResponse(text);

      return {
        ...evaluation,
        model: "gemini-1.5-flash",
        tokensUsed: response.usageMetadata?.totalTokenCount || 0,
      };
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw new Error(`AI evaluation failed: ${error.message}`);
    }
  }

  /**
   * Parse Gemini response and extract evaluation data
   */
  parseEvaluationResponse(responseText) {
    try {
      // Remove markdown code blocks if present
      let cleanText = responseText.trim();
      if (cleanText.startsWith("```json")) {
        cleanText = cleanText.replace(/```json\n?/g, "").replace(/```\n?/g, "");
      } else if (cleanText.startsWith("```")) {
        cleanText = cleanText.replace(/```\n?/g, "");
      }

      const parsed = JSON.parse(cleanText);

      // Validate required fields
      if (typeof parsed.score !== "number" || !parsed.summary) {
        throw new Error("Invalid response format");
      }

      return {
        score: Math.min(Math.max(parsed.score, 0), 100),
        summary: parsed.summary,
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
        weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
        suggestions: Array.isArray(parsed.suggestions)
          ? parsed.suggestions
          : [],
      };
    } catch (error) {
      console.error("Error parsing Gemini response:", error);
      console.error("Response text:", responseText);

      // Fallback response
      return {
        score: 50,
        summary:
          "Unable to generate detailed evaluation. Please ensure all required documents are uploaded and try again.",
        strengths: ["Application received"],
        weaknesses: ["Unable to analyze documents"],
        suggestions: [
          "Please ensure all documents are clear and readable",
          "Verify all required documents are uploaded",
        ],
      };
    }
  }

  /**
   * Test Gemini API connection
   */
  async testConnection() {
    try {
      const result = await this.model.generateContent(
        'Hello, respond with "Connection successful"'
      );
      const response = await result.response;
      return response.text().includes("successful");
    } catch (error) {
      console.error("Gemini connection test failed:", error);
      return false;
    }
  }
}

export default new GeminiService();
