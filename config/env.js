// config/env.js
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

console.log("✅ ENV chargé :", {
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? "OK" : "MISSING",
});
