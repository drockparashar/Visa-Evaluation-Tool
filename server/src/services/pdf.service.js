import PDFDocument from "pdfkit";
import { Readable } from "stream";

class PDFService {
  /**
   * Generate PDF report for evaluation
   */
  async generateEvaluationPDF(evaluation) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: "A4",
          margins: {
            top: 50,
            bottom: 50,
            left: 50,
            right: 50,
          },
        });

        const chunks = [];
        doc.on("data", (chunk) => chunks.push(chunk));
        doc.on("end", () => resolve(Buffer.concat(chunks)));
        doc.on("error", reject);

        // Header
        this.addHeader(doc, evaluation);
        doc.moveDown(2);

        // Score Section
        this.addScoreSection(doc, evaluation.evaluation);
        doc.moveDown(1.5);

        // Summary
        this.addSummarySection(doc, evaluation.evaluation.summary);
        doc.moveDown(1.5);

        // Strengths
        if (evaluation.evaluation.strengths?.length > 0) {
          this.addListSection(
            doc,
            "Strengths",
            evaluation.evaluation.strengths,
            "#10b981"
          );
          doc.moveDown(1.5);
        }

        // Weaknesses
        if (evaluation.evaluation.weaknesses?.length > 0) {
          this.addListSection(
            doc,
            "Areas for Improvement",
            evaluation.evaluation.weaknesses,
            "#f59e0b"
          );
          doc.moveDown(1.5);
        }

        // Suggestions
        if (evaluation.evaluation.suggestions?.length > 0) {
          this.addListSection(
            doc,
            "Recommendations",
            evaluation.evaluation.suggestions,
            "#3b82f6"
          );
          doc.moveDown(1.5);
        }

        // User Details
        this.addUserDetails(doc, evaluation);
        doc.moveDown(1);

        // Footer
        this.addFooter(doc);

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  addHeader(doc, evaluation) {
    // Title
    doc
      .fontSize(24)
      .fillColor("#1f2937")
      .font("Helvetica-Bold")
      .text("Visa Evaluation Report", { align: "center" });

    doc.moveDown(0.5);

    // Subtitle
    doc
      .fontSize(14)
      .fillColor("#6b7280")
      .font("Helvetica")
      .text(`${evaluation.country.name} - ${evaluation.visaType.name}`, {
        align: "center",
      });

    doc.moveDown(0.3);

    // Evaluation ID
    doc
      .fontSize(10)
      .fillColor("#9ca3af")
      .text(`Evaluation ID: ${evaluation.evaluationId}`, { align: "center" });

    // Horizontal line
    doc
      .moveDown(0.5)
      .strokeColor("#e5e7eb")
      .lineWidth(1)
      .moveTo(50, doc.y)
      .lineTo(545, doc.y)
      .stroke();
  }

  addScoreSection(doc, evaluationResult) {
    const score = evaluationResult.score;
    const maxScore = evaluationResult.maxScore || 100;
    const percentage = (score / maxScore) * 100;

    // Box for score
    const boxY = doc.y;
    doc.roundedRect(200, boxY, 145, 80, 10).fillAndStroke("#f3f4f6", "#e5e7eb");

    // Score text
    const scoreColor =
      percentage < 40 ? "#ef4444" : percentage < 65 ? "#f59e0b" : "#10b981";

    doc
      .fontSize(36)
      .fillColor(scoreColor)
      .font("Helvetica-Bold")
      .text(score.toString(), 200, boxY + 15, {
        width: 145,
        align: "center",
      });

    doc
      .fontSize(12)
      .fillColor("#6b7280")
      .font("Helvetica")
      .text(`/ ${maxScore}`, 200, boxY + 55, {
        width: 145,
        align: "center",
      });

    doc.y = boxY + 90;
  }

  addSummarySection(doc, summary) {
    doc
      .fontSize(16)
      .fillColor("#1f2937")
      .font("Helvetica-Bold")
      .text("Evaluation Summary");

    doc.moveDown(0.5);

    doc.fontSize(11).fillColor("#4b5563").font("Helvetica").text(summary, {
      align: "justify",
      lineGap: 4,
    });
  }

  addListSection(doc, title, items, color) {
    doc.fontSize(16).fillColor("#1f2937").font("Helvetica-Bold").text(title);

    doc.moveDown(0.5);

    items.forEach((item, index) => {
      const y = doc.y;

      // Bullet point
      doc
        .fontSize(11)
        .fillColor(color)
        .circle(60, y + 5, 3)
        .fill();

      // Text
      doc
        .fontSize(11)
        .fillColor("#4b5563")
        .font("Helvetica")
        .text(item, 75, y, {
          width: 470,
          align: "left",
          lineGap: 3,
        });

      doc.moveDown(0.5);
    });
  }

  addUserDetails(doc, evaluation) {
    // Add a page break if needed
    if (doc.y > 650) {
      doc.addPage();
    }

    doc
      .fontSize(16)
      .fillColor("#1f2937")
      .font("Helvetica-Bold")
      .text("Application Details");

    doc.moveDown(0.5);

    // Box for details
    const boxY = doc.y;
    doc.roundedRect(50, boxY, 495, 90, 5).fillAndStroke("#f9fafb", "#e5e7eb");

    // Details
    const leftColumn = 60;
    const rightColumn = 300;
    let detailY = boxY + 15;

    // Name
    doc
      .fontSize(10)
      .fillColor("#6b7280")
      .font("Helvetica")
      .text("Applicant Name:", leftColumn, detailY);
    doc
      .fontSize(11)
      .fillColor("#1f2937")
      .font("Helvetica-Bold")
      .text(evaluation.user.name, leftColumn, detailY + 12);

    // Email
    doc
      .fontSize(10)
      .fillColor("#6b7280")
      .font("Helvetica")
      .text("Email:", rightColumn, detailY);
    doc
      .fontSize(11)
      .fillColor("#1f2937")
      .font("Helvetica-Bold")
      .text(evaluation.user.email, rightColumn, detailY + 12);

    detailY += 35;

    // Phone (if exists)
    if (evaluation.user.phone) {
      doc
        .fontSize(10)
        .fillColor("#6b7280")
        .font("Helvetica")
        .text("Phone:", leftColumn, detailY);
      doc
        .fontSize(11)
        .fillColor("#1f2937")
        .font("Helvetica-Bold")
        .text(evaluation.user.phone, leftColumn, detailY + 12);
    }

    // Submitted date
    doc
      .fontSize(10)
      .fillColor("#6b7280")
      .font("Helvetica")
      .text("Submitted On:", rightColumn, detailY);
    doc
      .fontSize(11)
      .fillColor("#1f2937")
      .font("Helvetica-Bold")
      .text(
        new Date(evaluation.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        rightColumn,
        detailY + 12
      );

    doc.y = boxY + 100;
  }

  addFooter(doc) {
    // Add footer to current page (no page switching needed for single-page reports)
    const currentY = doc.y;

    // Ensure footer is at the bottom
    const footerY = 770;

    // Footer line
    doc
      .strokeColor("#e5e7eb")
      .lineWidth(1)
      .moveTo(50, footerY)
      .lineTo(545, footerY)
      .stroke();

    // Footer text
    doc
      .fontSize(9)
      .fillColor("#9ca3af")
      .font("Helvetica")
      .text(
        "This report is generated by Multi-Country Visa Evaluation Tool",
        50,
        footerY + 10,
        {
          width: 300,
          align: "left",
        }
      );

    doc
      .fontSize(9)
      .fillColor("#9ca3af")
      .text("Page 1", 300, footerY + 10, {
        width: 245,
        align: "right",
      });

    doc
      .fontSize(9)
      .fillColor("#9ca3af")
      .text(
        new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        50,
        footerY + 25,
        { align: "left" }
      );
  }
}

export default new PDFService();
