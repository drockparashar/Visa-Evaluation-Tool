import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";
import connectDB from "../config/database.js";

dotenv.config();

/**
 * Script to create an admin user
 * Usage: node src/scripts/create-admin.js
 */

async function createAdmin() {
  try {
    await connectDB();

    const adminData = {
      name: "Admin User",
      email: "admin@visaeval.com",
      password: "admin123", // Change this!
      role: "super_admin",
    };

    // Check if admin exists
    const existingAdmin = await Admin.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log("❌ Admin with this email already exists!");
      process.exit(1);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(adminData.password, salt);

    // Create admin
    const admin = new Admin({
      name: adminData.name,
      email: adminData.email,
      passwordHash,
      role: adminData.role,
      isActive: true,
    });

    await admin.save();

    console.log("✅ Admin created successfully!");
    console.log("");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📧 Email:", adminData.email);
    console.log("🔑 Password:", adminData.password);
    console.log("👤 Role:", adminData.role);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("");
    console.log("⚠️  Please change the password after first login!");
    console.log("");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  }
}

createAdmin();
