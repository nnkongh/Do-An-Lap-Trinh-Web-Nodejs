import React, { useEffect, useState } from "react";
import { BookA, NotebookPen, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleAddBookPopup, toggleReadBookPopup, toggleRecordBookPopup } from "../store/slices/popUpSlice";
import { toast } from "react-toastify";
import { fetchAllBooks, resetBookSlice, deleteBook } from "../store/slices/bookSlice";
import { fetchAllBorrowedBooks, resetBorrowSlice } from "../store/slices/borrowSlice";
import AddBookPopup from "../popups/AddBookPopup";
import ReadBookPopup from "../popups/ReadBookPopup";
import RecordBookPopup from "../popups/RecordBookPopup";

const BookManagement = () => {
  const dispatch = useDispatch();
  const { loading, error, message, books } = useSelector((state) => state.book);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { addBookPopup, readBookPopup, recordBookPopup } = useSelector((state) => state.popup);
  const { loading: borrowSliceLoading, error: borrowSliceError, message: borrowSliceMessage } = useSelector(state => state.borrow);

  const [readBook, setReadBook] = useState({});
  const openReadPopup = (id) => {
    const foundBook = books.find(book => book._id === id);
    setReadBook(foundBook);
    dispatch(toggleReadBookPopup());
  };

  const [borrowBookId, setBorrowBookId] = useState("");
  const openRecordBookPopup = (bookId) => {
    setBorrowBookId(bookId);
    dispatch(toggleRecordBookPopup());
  };

  // Thêm hàm delete book
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      dispatch(deleteBook(id));
    }
  };

  useEffect(() => {
    if (message || borrowSliceMessage) {
      toast.success(message || borrowSliceMessage);
      dispatch(fetchAllBooks());
      dispatch(fetchAllBorrowedBooks());
      dispatch(resetBookSlice());
      dispatch(resetBorrowSlice());
    }

    if (error || borrowSliceError) {
      toast.error(error || borrowSliceError);
      dispatch(resetBookSlice());
      dispatch(resetBorrowSlice());
    }
  }, [dispatch, message, error, loading, borrowSliceError, borrowSliceLoading, borrowSliceMessage]);

  const [searchedKeyword, setSearchedKeyword] = useState("");
  const handleSearch = (e) => {
    setSearchedKeyword(e.target.value.toLowerCase());
  };

  const searchedBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchedKeyword)
  );

  return (
    <>
      <main className="relative flex-1 p-6 pt-28">
        <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
          <h2 className="text-xl font-medium md:text-2x1 md:font-semibold">{user && user.role === "Admin" ? "Book Management" : "Books"}</h2>
          <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
            {
              isAuthenticated && user?.role === "Admin" && (
                <button onClick={() => dispatch(toggleAddBookPopup())} className="relative pl-14 w-full sm:w-52 flex gap-4 justify-center items-center py-2 px-4 bg-black text-white rounded-md hover:bg-gray-800">
                  <span className="bg-white flex justify-center items-center overflow-hidden rounded-full text-black w-[25px] h-[25px] text-[27px] absolute left-5">+</span>
                  Add Book
                </button>
              )
            }
            <input type="text" placeholder="Search books.." className="w-full sm:w-52 border p-2" value={searchedKeyword} onChange={handleSearch} />
          </div>
        </header>

        {
          books && books.length > 0 ? (
            <div className="mt-6 overflow-auto bg-white rounded-md shadow-lg">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2 text-left">Id</th>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Author</th>
                    {
                      isAuthenticated && user?.role === "Admin" && (
                        <th className="px-4 py-2 text-left">Quantity</th>
                      )
                    }
                    <th className="px-4 py-2 text-left">Price</th>
                    <th className="px-4 py-2 text-left">Availability</th>
                    {
                      isAuthenticated && user?.role === "Admin" && (
                        <th className="px-4 py-2 text-center">Actions</th>
                      )
                    }
                  </tr>
                </thead>
                <tbody>
                  {
                    searchedBooks.map((book, index) => (
                      <tr key={book._id} className={(index + 1) % 2 === 0 ? "bg-gray-50" : ""}>
                        <td className="px-4 py-2">{index + 1}</td>
                        <td className="px-4 py-2">{book.title}</td>
                        <td className="px-4 py-2">{book.author}</td>
                        {
                          isAuthenticated && user?.role === "Admin" && (
                            <td className="px-4 py-2">{book.quantity}</td>
                          )
                        }
                        <td className="px-4 py-2">{`$${book.price}`}</td>
                        <td>{book.availability ? "Available" : "Unavailable"}</td>
                        {
                          isAuthenticated && user?.role === "Admin" && (
                            <td className="px-4 py-2 flex space-x-3 my-3 justify-center items-center">
                              <BookA
                                className="cursor-pointer hover:text-blue-600"
                                onClick={() => openReadPopup(book._id)}
                              />
                              <NotebookPen
                                className="cursor-pointer hover:text-green-600"
                                onClick={() => openRecordBookPopup(book._id)}
                              />
                              <Trash2
                                className="cursor-pointer hover:text-red-600"
                                onClick={() => {
                                  if (window.confirm(`Are you sure to delete "${book.title}"?`)) {
                                    dispatch(deleteBook(book._id));
                                  }
                                }}
                              />
                            </td>
                          )
                        }
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          ) : (
            <h3 className="text-3xl mt-5 font-medium">No books found in library</h3>
          )
        }
      </main>

      {addBookPopup && <AddBookPopup />}
      {readBookPopup && <ReadBookPopup book={readBook} />}
      {recordBookPopup && <RecordBookPopup bookId={borrowBookId} />}
    </>
  );
};

export default BookManagement;
