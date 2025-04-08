import {catchAsyncErrors} from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from  "../middlewares/errorMiddlewares.js";
import { Borrow } from "../models/borrowModel.js";
import { Book} from "../models/bookModel.js";
import { User} from "../models/userModel.js";
import { calculateFine } from "../utils/fineCalculator.js";


export const borrowedBooks = catchAsyncErrors(async(req,res,next)=>{
    const {borrowedBooks} = req.user;
    res.status(200).json({
        success: true,
        borrowedBooks,
    });
});
export const recordBorrowedBook= catchAsyncErrors(
    async(req,res,next)=>{
        const {id} = req.params;
        const {email} = req.body;
        const book = await Book.findById(id);
        if (!book) {
            return next(new ErrorHandler("sách không tìm thấy", 404));
        }
        const user = await User.findOne({email});
        if (!user){
            return next(new ErrorHandler("người dùng không tìm thấy", 404));
        }
        if (book.quantity === 0){
            return next(new ErrorHandler ("Sách đã hết hoặc chưa có hàng", 404));
        }
        const isAlreadyBorrowed = user.borrowedBooks.find(
            b => b.bookId.toString() === id && b.returned === false
        );
        if(isAlreadyBorrowed){
            return next(new ErrorHandler("Sách đã được mượn", 400));
        }
        book.quantity -= 1;
        book.availability = book.quantity > 0;
        await book.save();
        user.borrowedBooks.push({
            bookId: book._id,
            bookTitle: book.title,
            borrowedDate: new Date(),
            dueDate: new Date(Date.now()+7*24*60*60*1000),
        });
        await user.save();
        await Borrow.create({
            user:{
                id:user._id,
                name:user.name,
                email:user.email
            },
            book: book._id,
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            price: book.price
        });
        res.status(200).json({
            success: true,
            message: " Sách đã mượn thành công",
        });
    });
export const getBorrowedBooksForAdmin= catchAsyncErrors(
    async(req,res,next)=>{
        const borrowedBooks = await Borrow.find();
        res.status(200).json({
            success: true,
            borrowedBooks,
    });
}
);
export const returnBorrowBook= catchAsyncErrors(async(req,res,next)=>{
    const {bookId} = req.params;
    const {email} = req.body;
    const book = await Book.findById(bookId);
    if (!book) {
        return next(new ErrorHandler("sách không tìm thấy", 404));
    }
    const user = await User.findOne({email, accountVerified: true});
    if (!user){
        return next(new ErrorHandler("người dùng không tìm thấy", 404));
    }
    const borrowedBook = user.borrowedBooks.find(
        (b) => b.bookId.toString() === bookId && b.returned === false
    );
    if (!borrowedBook){
        return next (new ErrorHandler ("Bạn chưa chọn sách này hoặc sách đã được trả", 400));
    }
    borrowedBook.returned= true;
    await user.save();
    book.quantity += 1;
    book.availability = book.quantity > 0;
    await book.save();
    const borrow = await Borrow.findOne({
        book: bookId,
        "user.email": email,
        returnDate: null,
    });
    if (!borrow){
        return next(new ErrorHandler("Bạn chưa mượn sách này", 400));
    }
    borrow.returnDate = new Date();
    const fine = calculateFine(borrow.dueDate);
    borrow.fine = fine;
    await borrow.save();
    res.status(200).json({
        success: true,
        message: fine > 0 
            ? `Sách đã được hoàn trả thành công. Phí trễ hạn là $${fine.toFixed(2)}. Tổng phí: $${(fine + book.price).toFixed(2)}`
            : `Sách đã được hoàn trả thành công. Tổng phí: $${book.price}`,

    });
});