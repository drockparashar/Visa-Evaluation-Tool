import geminiService from "./src/services/gemini.service.js";
import connectDB from "./src/config/database.js";
import { COUNTRIES } from "./src/config/countries.js";

console.log("🧪 Running backend tests...\n");

// Test 1: Check countries configuration
console.log("✅ Test 1: Countries Configuration");
console.log(`   Loaded ${COUNTRIES.length} countries`);
COUNTRIES.forEach((country) => {
  console.log(
    `   - ${country.flag} ${country.name}: ${country.visaTypes.length} visa types`
  );
});

// Test 2: Test MongoDB connection
console.log("\n🔄 Test 2: MongoDB Connection");
try {
  await connectDB();
  console.log("   ✅ MongoDB connected successfully");
} catch (error) {
  console.log("   ❌ MongoDB connection failed:", error.message);
}

// Test 3: Test Gemini API
console.log("\n🔄 Test 3: Gemini API Connection");
try {
  const isConnected = await geminiService.testConnection();
  if (isConnected) {
    console.log("   ✅ Gemini API connected successfully");
  } else {
    console.log("   ❌ Gemini API connection failed");
  }
} catch (error) {
  console.log("   ❌ Gemini API error:", error.message);
}

console.log("\n✨ Tests completed!\n");
process.exit(0);
