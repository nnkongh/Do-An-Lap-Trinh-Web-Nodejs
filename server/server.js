import { app } from "./app.js";
import createDefaultAdmin from "./seedAdmin/createAdmin.js";
import {v2 as cloudinary} from "cloudinary";
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLIENT_NAME,
    api_key:process.env.CLOUDINARY_CLIENT_API,
    api_secret:process.env.CLOUDINARY_CLIENT_SECRET,
});
app.listen(process.env.PORT, async ()=>{
    try {
        // Chờ tạo tài khoản admin mặc định
        await createDefaultAdmin();
        console.log("Admin đã được tạo!");

        console.log(`Server đang chạy ở ${process.env.PORT}`);
    } catch (err) {
        console.error("Lỗi khi tạo admin:", err);
    }
});

