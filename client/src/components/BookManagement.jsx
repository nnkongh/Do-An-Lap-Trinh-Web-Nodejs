import React, { useEffect, useState } from "react";
import { BookA, NotebookPen } from "lucide-react";
import {useDisPatch, useSelector} from "react-redux";
import {toggleAddBookPopup, toggleReadBookPopup,toggleRecordBookPopup,} from "../store/slices/popUpSlice";
import {toast} from "react-toastify"

import {fetchAllBooks,resetBookSlice} from "../store/slices/bookSlice";
import {fetchAllBorrowedBooks,resetBorrowSlice} from "../store/slices/borrowSlice"
import AddBookPopup from "../popups/AddBookPopup"
import ReadBookPopup from "../popups/ReadBookPopup"
import RecordBookPopup from "../popups/RecordBookPopup"
const BookManagement = () => {
  const dispatch = useDisPatch();
  const {loading, error, message, books} = useSelector((state) => state.book);
  const {isAuthenticated, user} = useSelector((state) => state.auth);
  const {
    addBookPopup,
    readBookPopup,
    recordBookPopup,
  } = useSelector((state) => state.popup);


  const {loading: borrowSliceLoading, error:borrowSliceError, message:borrowSliceMessage } = useSelector(state => state.borrow)
  const [readBook,setReadBook] = useState({});
  const openReadPopup = (id) => {
    const book = book.find(book => book._id === id);
    setReadBook(book);
    dispatch(toggleReadBookPopup());
  };
  const [borrowBookId,setBorrowBookId] = useState("");
  const openRecordBookPopup = (bookId) => {
    setBorrowBookId(bookId);
    dispatch(toggleRecordBookPopup());
  };
  //-----------NGAY ĐÂY NÀY----------
  useEffect(() => {
    if(message || borrowSliceMessage ){
      toast.sucsses(message || borrowSliceMessage);
      dispatch(fetchAllBooks());
      dispatch(fetchAllBorrowedBooks());
      dispatch(resetBookSlice());
      dispatch(resetBorrowSlice());
    };
    ///-----------NGAY ĐÂY NÀY----------
    if(error|| borrowSliceError){
      toast.error(error || borrowSliceError);
      dispatch(resetBookSlice());
      dispatch(resetBorrowSlice());
    };
  },[dispatch, message,error,loading,borrowSliceError,borrowSliceLoading,borrowSliceMessage]);
  const [searchedKeyword,setSearchedKeyword] = useState(); //
  const handleSearch = (e)=>{
    setSearchedKeyword(e.target.value.toLowerCase());
  };
  const searchedBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchedKeyword)
  );
  if(books){
    console.log(books);
    consolse.log(searchedBooks);
  }
  return <>
    <main className="relative flex-1 p-6 pt-28">
      <Headers/>
      {/*Sub header*/}
      <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
        <h2 className="text-xl font-medium md:text-2x1 md:font-semibold">{user && user.role === "Admin" ? "Book Management" : "Books"}</h2>
        <div className="flex  flex-col lg:flex-row spacy-y-4 lg:space-y-0 lg:space-x-4">
          {
            isAuthenticated && user?.role === "Admin" && (
              <button onClick={() => dispatch(toggleAddBookPopup)} className="relative pl-14 w-full sm:w-52 flex gap-4 justify-center items-center py-2 px-4 bg-black text-while rounded-md hover:bg-gray-800">
                <span className="bg-white flex justify-center items-center overflow-hidden rounded-full text-black w-[25px] h-[25px] text-[27px] absolute left-5">+</span>
                Add Book</button>
            )
          }
          <input type="text" placeholder="Search books.." className="w-ful sm:w-52 border p-2" value={searchedKeyword} onChange={handleSearch}/>

        </div>
      </header>

      {/*Table*/}
      {/* Table */}
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
            <th className="px-4 py-2 text-left">Avaibility</th>
            {
              isAuthenticated && user?.role === "Admin" && (
                <th className="px-4 py-2 text-center">Record Book</th>
              )
            }
            {/* thêm dispatch(fetchAllBooks()); */}
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
                <td className="px-4 py-2">{book.available ? "Available" : "Unavailable"}</td>
                {
                  isAuthenticated && user?.role === "Admin" && (
                    <td className="px-4 py-2 flex space-x-2 my-3 justify-center">
                      <BookA onClick={() => openReadPopup(book._id)}/>
                        <NotebookPen onClick={() => openReadPopup(book._id)}/>
                      <button className="text-blue-600 hover:underline">Edit</button>
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
    {addBookPopup && <AddBookPopup/>}
    {readBookPopup && <ReadBookPopup book={readBook}/>}
    {readBookPopup && <RecordBookPopup bookId={borrowBookId}/>}
     {/* RecordBook {bookId} */}
  </>;
};

export default BookManagement;
