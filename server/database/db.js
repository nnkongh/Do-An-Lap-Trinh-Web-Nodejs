import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config()

export const connectDB = () => {
  mongoose
    .connect(process.env.MONGODB_URI, {
      dbName: "BookLibrary", // Đổi tên database cho phù hợp
      
    })
    .then(() => {
      console.log(`Kết nối thành công`);
    })
    .catch((err) => {
      console.log(`Lỗi kết nối:`, err);
    });
};