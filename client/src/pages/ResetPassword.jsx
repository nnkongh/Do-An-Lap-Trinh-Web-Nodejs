import React, { useState, useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";
import { useDispatch, useSelector } from "react-redux";
import { resetAuthSlice, resetPassword } from "../store/slices/authSlice";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { token } = useParams();
  const dispatch = useDispatch();

  const { loading, error, message, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const handleResetPassword = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);
    dispatch(resetPassword(formData, token));
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
    }
  }, [message, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
  }, [error, dispatch]);

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  return (
    <>
      <div className="flex flex-col justify-center md:flex-row h-screen">
        {/* LEFT SECTION */}
        <div className="hidden w-full md:w-1/2 bg-black text-white md:flex flex-col items-center justify-center p-8 rounded-tr-[80px] rounded-br-[80px]">
          <div className="text-center h-[450px]">
            <div className="flex justify-center mb-12">
              <img src={logo_with_title} alt="logo" className="mb-12 h-44 w-auto" />
            </div>
            <h3 className="text-gray-300 mb-12 max-w-[320px] mx-auto text-3xl font-medium leading-relaxed">
            Thư viện số hàng đầu để bạn mượn và đọc sách!
            </h3>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8 relative">
          <Link
            to={"/password/forgot"}
            className="border-2 border-black rounded-3xl font-bold w-32 py-2 px-4 absolute top-10 left-8 hover:bg-black hover:text-white transition duration-300"
          >
            Quay lại
          </Link>

          <div className="w-full max-w-sm">
            <div className="flex justify-center mb-12">
              <img src={logo} alt="logo" className="h-24 w-auto" />
            </div>

            <h1 className="text-4xl font-medium text-center mb-5">Reset mật khẩu</h1>
            <p className="text-gray-800 text-center mb-12">Vui lòng nhập mật khẩu mới</p>

            <form onSubmit={handleResetPassword}>
              <div className="mb-4">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-4 py-3 border border-black rounded-md focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  className="w-full px-4 py-3 border border-black rounded-md focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`border-2 mt-5 border-black w-full font-semibold py-2 rounded-lg transition ${
                  loading
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-black text-white hover:bg-white hover:text-black"
                }`}
              >
                {loading ? "Loading..." : "RESET PASSWORD"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
