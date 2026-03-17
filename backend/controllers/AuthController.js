// controllers/AuthController.js - FIXED VERSION
import genToken from "../config/Token.js";
import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";

// ✅ FIX 1: Improved SignUp with better validation
export const SignUp = async (req, res) => {
  try {
    const { userName, email, password, name } = req.body;

    // ✅ Validate required fields
    if (!userName || !email || !password) {
      return res.status(400).json({
        message: "Username, email, and password are required",
      });
    }

    // ✅ Email format validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    // ✅ Check username exists
    const existingUserName = await User.findOne({ userName });
    if (existingUserName) {
      return res.status(400).json({
        message: "Username already exists!",
      });
    }

    // ✅ Check email exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        message: "Email already exists!",
      });
    }

    // ✅ Password validation
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    // ✅ Hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // ✅ Create user
    const user = await User.create({
      userName,
      email,
      password: hashPassword,
      name: name || userName, // ✅ Default name to userName if not provided
    });

    // ✅ Generate token
    const token = genToken(user._id);

    // ✅ Set cookie with proper settings
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production", // ✅ true in production
    });

    // ✅ Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    console.log("✅ User signed up successfully:", user._id);

    return res.status(201).json(userResponse);
  } catch (error) {
    console.error("❌ SignUp error:", error);
    return res.status(500).json({
      message: `Signup error: ${error.message}`,
    });
  }
};

// ✅ FIX 2: Improved Login with better error handling
export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // ✅ Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password", // ✅ Generic message for security
      });
    }

    // ✅ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password", // ✅ Generic message for security
      });
    }

    // ✅ Generate token
    const token = genToken(user._id);

    // ✅ Set cookie with proper settings
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    // ✅ Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    console.log("✅ User logged in successfully:", user._id);

    return res.status(200).json(userResponse);
  } catch (error) {
    console.error("❌ Login error:", error);
    return res.status(500).json({
      message: `Login error: ${error.message}`,
    });
  }
};

// ✅ FIX 3: Improved Logout with proper cookie clearing
export const Logout = async (req, res) => {
  try {
    // ✅ Clear cookie with same settings used when setting it
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    console.log("✅ User logged out successfully");

    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("❌ Logout error:", error);
    return res.status(500).json({
      message: `Logout error: ${error.message}`,
    });
  }
};
