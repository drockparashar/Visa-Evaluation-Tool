import dotenv from "dotenv";
import app from "./src/app.js";
import connectDB from "./src/config/database.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║   🌍 Multi-Country Visa Evaluation API                ║
║                                                       ║
║   Status:  ✅ Server running                         ║
║   Port:    ${PORT}                                        ║
║   Mode:    ${
    process.env.NODE_ENV || "development"
  }                               ║
║   URL:     http://localhost:${PORT}                       ║
║                                                       ║
║   API Endpoints:                                      ║
║   • GET    /api/countries                            ║
║   • GET    /api/countries/:code                      ║
║   • POST   /api/evaluations                          ║
║   • GET    /api/evaluations/:id                      ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Promise Rejection:", err);
  console.log("Shutting down server...");
  process.exit(1);
});
