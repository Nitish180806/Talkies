import genToken from "../config/Token.js";
import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";

export const SignUp = async (req, res) => {
  try {
    const { userName, email, password, name } = req.body;

    // Check user by username
    if (await User.findOne({ userName })) {
      return res.status(400).json({ message: "Username already exists!" });
    }

    // Check user by email
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "Email already exists!" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      userName,
      email,
      password: hashPassword,
      name,
    });

    const token = genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "lax", // allow cross-origin localhost ports
      secure: false, // true in production with HTTPS
    });

    user.password = undefined; // Remove password from response
    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ message: `signup error: ${error.message}` });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User doesn't exist!" });

    const IsMatch = await bcrypt.compare(password, user.password);
    if (!IsMatch)
      return res.status(400).json({ message: "Incorrect password!" });

    const token = genToken(user._id); // Fixed: added missing await removed async

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
      secure: false,
    });

    user.password = undefined; // Remove password from response
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `login error: ${error.message}` });
  }
};

export const Logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: `logout error: ${error.message}` });
  }
};
