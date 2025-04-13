import React, { useEffect, useState } from "react";
import { BookA, NotebookPen } from "lucide-react";
import {useDisPatch, useSelector} from "react-redux";
import {toggleReadBookPopup,toggleRecordBookPopup,} from "../store/slices/popUpSlice";
import {toast} from "react-toastify"

import {fetchAllBooks,resetBookSlice} from "../store/slices/bookSlice";
import {fetchAllBorrowedBooks,resetBorrowSlice} from "..store/slices/borrowSlice"
import e from "express";

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
  const [readbook,setReadBook] = useState({});
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
  const searchedBooks = books.filter(book => {
    book.title.toLowerCase().includes(searchedKeyword);
  });
  return <>
    <main className="relative flex-1 p-6 pt-28">
      <Headers></Headers>
    </main>
  </>;
};

export default BookManagement;
