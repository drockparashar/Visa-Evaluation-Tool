import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";
import { generateToken } from "../utils/jwt.js";

class AuthController {
  /**
   * Admin login
   * POST /api/auth/login
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required",
        });
      }

      // Find admin
      const admin = await Admin.findOne({ email: email.toLowerCase() });

      if (!admin) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      // Check if active
      if (!admin.isActive) {
        return res.status(401).json({
          success: false,
          message: "Account is inactive. Please contact support.",
        });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(
        password,
        admin.passwordHash
      );

      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      // Update last login
      admin.lastLoginAt = new Date();
      await admin.save();

      // Generate JWT token
      const token = generateToken({
        adminId: admin._id,
        email: admin.email,
        role: admin.role,
      });

      res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          token,
          admin: {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
          },
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: "Login failed",
        error: error.message,
      });
    }
  }

  /**
   * Get current admin
   * GET /api/auth/me
   */
  async getCurrentAdmin(req, res) {
    try {
      const admin = await Admin.findById(req.admin.adminId).select(
        "-passwordHash"
      );

      if (!admin) {
        return res.status(404).json({
          success: false,
          message: "Admin not found",
        });
      }

      res.status(200).json({
        success: true,
        data: admin,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching admin details",
      });
    }
  }

  /**
   * Logout (client-side token removal)
   * POST /api/auth/logout
   */
  async logout(req, res) {
    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  }
}

export default new AuthController();
