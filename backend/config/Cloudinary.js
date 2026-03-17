import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs/promises";

// ✅ Load environment variables from .env
dotenv.config();

// ✅ Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// ✅ Log config (for debugging only — remove later if you want)
console.log("Cloudinary Config Loaded:", {
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY ? "✅ Loaded" : "❌ Missing",
  api_secret: process.env.API_SECRET ? "✅z Loaded" : "❌ Missing",
});

const UploadOnCloudinary = async (filePath) => {
  if (!filePath) throw new Error("No file path provided");

  try {
    console.log("Uploading to Cloudinary:", filePath);
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
      folder: "chatAppProfiles",
    });
    console.log("Upload success:", uploadResult.secure_url);
    return uploadResult.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  } finally {
    // Always delete local temp file
    await fs
      .unlink(filePath)
      .catch((err) => console.error("Failed to delete temp file:", err));
  }
};

export default UploadOnCloudinary;
