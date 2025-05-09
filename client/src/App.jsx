import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import ForgotPassword from "./pages/ForgotPassword";
import Login from "./pages/Login";
import OTP from "./pages/OTP";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "./store/slices/authSlice.js";
import { fetchAllUsers } from "./store/slices/userSlice.js";
import { fetchAllBooks } from "./store/slices/bookSlice.js";
import { fetchAllBorrowedBooks, fetchUserBorrowedBooks } from "./store/slices/borrowSlice.js";
import MyBorrowedBooks from "./components/MyBorrowedBooks";
const App = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(getUser());
    dispatch(fetchAllBooks());
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthenticated || !user?.role) return;

    if (user.role === "User") {
      dispatch(fetchUserBorrowedBooks());
    }

    if (user.role === "Admin") {
      dispatch(fetchAllUsers());
      console.log("Đã gọi fetchAllUsers()");  
      dispatch(fetchAllBorrowedBooks());
    }
  }, [dispatch, isAuthenticated, user?.role]);

  console.log("App loaded");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/otp-verification/:email" element={<OTP />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />
        <Route path="/borrowed-books" element={<MyBorrowedBooks />} />
      </Routes>
      <ToastContainer theme="dark" />
    </Router>
  );
};

export default App;
