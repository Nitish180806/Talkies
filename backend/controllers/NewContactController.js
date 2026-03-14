import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";

export const createNewContact = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      const existingUser = emailExists.toObject();
      delete existingUser.password;
      return res
        .status(200)
        .json({ message: "User already exists", user: existingUser });
    }

    const userName = `${name} (${email})`;

    const userNameExists = await User.findOne({ userName });
    if (userNameExists) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      userName,
      password: hashedPassword,
    });

    const userResponse = newUser.toObject();
    delete userResponse.password;

    return res.status(201).json(userResponse);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const contactId = req.params.id;
    const currentUserId = req.userId;

    if (!contactId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid contact ID format" });
    }

    if (contactId === currentUserId) {
      return res.status(400).json({ message: "You cannot delete yourself" });
    }

    const contact = await User.findById(contactId);
    if (!contact) return res.status(404).json({ message: "Contact not found" });

    await User.findByIdAndDelete(contactId);

    return res
      .status(200)
      .json({ message: "Contact deleted successfully", contactId });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
