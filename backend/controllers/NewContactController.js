// controllers/NewContactController.js - FIXED VERSION
import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";

// ✅ FIX 1: Properly hash passwords when creating contacts
export const createNewContact = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // ✅ Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // ✅ Email format validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    // ✅ Password length validation
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    // ✅ Check if email already exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      // ✅ FIX: Return existing user instead of error (for adding contacts)
      const existingUser = emailExists.toObject();
      delete existingUser.password;
      return res.status(200).json({
        message: "User already exists",
        user: existingUser,
      });
    }

    // ✅ Generate unique userName
    const userName = `${name} (${email})`;

    // ✅ Check if userName exists
    const userNameExists = await User.findOne({ userName });
    if (userNameExists) {
      return res.status(400).json({
        message: "Username already exists",
      });
    }

    // ✅ CRITICAL FIX: Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create new user
    const newUser = await User.create({
      name,
      email,
      userName,
      password: hashedPassword, // ✅ Use hashed password
    });

    // ✅ Remove password from response
    const userResponse = newUser.toObject();
    delete userResponse.password;

    console.log("✅ New contact created:", newUser._id);

    return res.status(201).json(userResponse);
  } catch (error) {
    console.error("❌ createNewContact error:", error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

// ✅ FIX 2: Enhanced delete with validation
export const deleteContact = async (req, res) => {
  try {
    const contactId = req.params.id;
    const currentUserId = req.userId; // ✅ From IsAuth middleware

    // ✅ Validate contactId format
    if (!contactId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        message: "Invalid contact ID format",
      });
    }

    // ✅ Prevent self-deletion
    if (contactId === currentUserId) {
      return res.status(400).json({
        message: "You cannot delete yourself",
      });
    }

    // ✅ Find contact
    const contact = await User.findById(contactId);
    if (!contact) {
      return res.status(404).json({
        message: "Contact not found",
      });
    }

    // ✅ Delete contact
    await User.findByIdAndDelete(contactId);

    console.log("✅ Contact deleted:", contactId);

    return res.status(200).json({
      message: "Contact deleted successfully",
      contactId,
    });
  } catch (error) {
    console.error("❌ deleteContact error:", error);
    return res.status(500).json({
      message: error.message,
    });
  }
};
