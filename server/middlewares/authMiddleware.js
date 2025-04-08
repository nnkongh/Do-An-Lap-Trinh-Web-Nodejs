import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./errorMiddlewares.js";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

// Middleware kiểm tra xác thực người dùng
export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return next(new ErrorHandler("Người dùng chưa xác thực", 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findById(decoded.id);

        if (!user) {
            return next(new ErrorHandler("Người dùng không tồn tại", 404));
        }

        req.user = user; // Gán thông tin người dùng vào request
        next();
    } catch (error) {
        return next(new ErrorHandler("Token không hợp lệ hoặc đã hết hạn", 403));
    }
});

// Middleware kiểm tra quyền truy cập
export const isAuthorized = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(
                    `Người dùng với quyền "${req.user.role}" không có quyền truy cập`,
                    403
                )
            );
        }
        next(); // Cho phép tiếp tục nếu có quyền
    };
};