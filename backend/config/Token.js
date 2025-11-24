import jwt from "jsonwebtoken";

// Fixed: remove async since jwt.sign is sync
const genToken = (userId) => {
  try {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    return token;
  } catch (error) {
    console.error("genToken error:", error);
    throw new Error("Failed to generate token");
  }
};
   
export default genToken;     