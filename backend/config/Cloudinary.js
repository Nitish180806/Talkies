import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs/promises";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const UploadOnCloudinary = async (filePath) => {
  if (!filePath) throw new Error("No file path provided");

  try {
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
      folder: "chatAppProfiles",
    });
    return uploadResult.secure_url;
  } catch (error) {
    throw error;
  } finally {
    await fs.unlink(filePath).catch(() => {});
  }
};

export default UploadOnCloudinary;
