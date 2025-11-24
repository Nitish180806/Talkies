import User from "../models/UserModel.js";

// CREATE NEW CONTACT
export const createNewContact = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if email or username already exists
    const emailExists = await User.findOne({ email });
    if (emailExists)
      return res.status(400).json({ message: "Email already exists" });

    const userName = `${name} (${email})`;

    const newUser = await User.create({
      name,
      email,
      userName,
      password, // optional: hash later if needed
    });

    return res.status(201).json(newUser);
  } catch (error) {
    console.error("createNewContact error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// DELETE CONTACT
export const deleteContact = async (req, res) => {
  try {
    const contactId = req.params.id;

    const contact = await User.findById(contactId);
    if (!contact) return res.status(404).json({ message: "Contact not found" });

    await User.findByIdAndDelete(contactId);

    return res
      .status(200)
      .json({ message: "Contact deleted successfully", contactId });
  } catch (error) {
    console.error("deleteContact error:", error);
    return res.status(500).json({ message: error.message });
  }
};
