import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { Book } from "../models/bookModel.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { User } from "../models/userModel.js";

// Thêm sách
export const addBook = catchAsyncErrors(async (req, res, next) => {
    const { title, author, description, price, quantity } = req.body;

    if (!title || !author || !description || !price || !quantity) {
        return next(new ErrorHandler("Vui lòng điền đầy đủ thông tin", 400));
    }

    const book = await Book.create({ title, author, description, price, quantity,availability: quantity > 0 });

    res.status(201).json({
        success: true,
        message: "Sách đã thêm thành công",
        book,
    });
});

// Xóa sách
export const deleteBook = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const book = await Book.findById(id);
    if (!book) {
        return next(new ErrorHandler("Sách không tìm thấy", 404));
    }

    await book.deleteOne();

    res.status(200).json({
        success: true,
        message: "Sách đã xóa thành công",
    });
});

// Lấy tất cả sách
export const getAllBooks = catchAsyncErrors(async (req, res, next) => {
    const books = await Book.find();

    res.status(200).json({
        success: true,
        books,
    });
});
