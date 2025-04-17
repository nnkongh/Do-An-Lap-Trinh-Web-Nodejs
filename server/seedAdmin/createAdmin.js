// Tạo file createDefaultAdmin.js
import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";

const createDefaultAdmin = async () => {
  try {

    const adminExists = await User.findOne({ role: "Admin", accountVerified: true });
    
    if (!adminExists) {
     
      const hashedPassword = await bcrypt.hash("admin123", 10);
      
      const admin = await User.create({
        name: "Admin",
        email: "    ",
        password: hashedPassword,
        role: "Admin",
        accountVerified: true,
      });
      
      console.log("Tài khoản admin mặc định đã được tạo:", admin.email);
    } else {
      console.log("Tài khoản admin đã tồn tại:", adminExists.email);
    }
  } catch (error) {
    console.error("Lỗi khi tạo tài khoản admin mặc định:", error);
  }
};

export default createDefaultAdmin;