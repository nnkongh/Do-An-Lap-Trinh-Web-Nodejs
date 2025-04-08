import { isAuthenticated, isAuthorized } from "../middlewares/authMiddleware.js";
import { addBook, deleteBook, getAllBooks } from "../controllers/bookController.js";
import express from "express";

const router = express.Router();

// API chỉ dành cho Admin
router.post("/admin/add", isAuthenticated, isAuthorized("Admin"), addBook);
router.delete("/delete/:id", isAuthenticated, isAuthorized("Admin"), deleteBook);

// API cho tất cả người dùng đã đăng nhập
router.get("/all", isAuthenticated, getAllBooks);

export default router;
