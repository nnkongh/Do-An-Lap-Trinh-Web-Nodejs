// import React from "react";
// import logo_with_title from "../assets/logo-with-title.png";

// const Login = () => {
//   console.log("đăng nhập thành")
//   return (
//     <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
//       <img src={logo_with_title} alt="Logo" className="w-60 mb-8" />
//       <div className="bg-white p-6 rounded-lg shadow-md w-80">
//         <h2 className="text-xl font-semibold mb-4 text-center">Login</h2>
//         <form>
//           <input
//             type="text"
//             placeholder="Username"
//             className="w-full p-2 mb-3 border border-gray-300 rounded"
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             className="w-full p-2 mb-4 border border-gray-300 rounded"
//           />
//           <button className="w-full bg-black text-white py-2 rounded">
//             Login
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;
/////////////////////////////////////////////////////////////////////
// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fakeLogin } from "../store/slices/authSlice";
// import { useNavigate } from "react-router-dom";
// import logo_with_title from "../assets/logo-with-title.png";

// const Login = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     dispatch(fakeLogin({ email, password }));
//     navigate("/home"); // hoặc đường dẫn tùy bạn
//   };

//   return (
//     <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
//       <img src={logo_with_title} alt="Logo" className="w-60 mb-8" />
//       <div className="bg-white p-6 rounded-lg shadow-md w-80">
//         <h2 className="text-xl font-semibold mb-4 text-center">Đăng nhập</h2>

//         {error && (
//           <div className="text-red-500 text-sm text-center mb-2">{error}</div>
//         )}

//         <form onSubmit={handleSubmit}>
//           <input
//             type="text"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full p-2 mb-3 border border-gray-300 rounded"
//             required
//           />
//           <input
//             type="password"
//             placeholder="Mật khẩu"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full p-2 mb-4 border border-gray-300 rounded"
//             required
//           />
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition duration-200"
//           >
//             {loading ? "Đang đăng nhập..." : "Đăng nhập"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };
// export default Login;
import React, { useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo_with_title.png";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { login, resetAuthSlice } from "../store/slices/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, message, user, isAuthenticated } = useSelector((state) => state.auth);

  const handleLogin = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("email", email);
    data.append("password", password);
    dispatch(login(data));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
    }
  }, [message, error, dispatch]);

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <div className="flex flex-col justify-center md:flex-row h-screen">
        {/* LEFT SIDE */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8 relative">
          <div className="max-w-sm w-full">
            <div className="flex justify-center mb-12">
              <div className="rounded-full flex items-center justify-center">
                <img src={logo} alt="logo" className="h-24 w-auto" />
              </div>
            </div>
            <h1 className="text-4xl font-medium text-center mb-8">Welcome Back!!!</h1>
            <p className="text-gray-800 text-center mb-6">Please enter your credentials to log in</p>
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full px-4 py-3 border border-black rounded-md focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-4 py-3 border border-black rounded-md focus:outline-none"
                />
              </div>
              <Link to="/password/forgot" className="font-semibold text-black mb-12 block">Forgot Password</Link>
              <div className="block md:hidden font-semibold mt-5">
                <p>
                  New to our platform?{" "}
                  <Link to="/register" className="text-sm text-gray-500 hover:underline">
                    Sign Up
                  </Link>
                </p>
              </div>
              <button
                type="submit"
                className={`border-2 mt-5 border-black w-full font-semibold py-2 rounded-lg transition ${
                  loading
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-black text-white hover:bg-white hover:text-black"
                }`}
                disabled={loading}
              >
                SIGN IN
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="hidden w-full md:w-1/2 bg-black text-white md:flex flex-col items-center justify-center p-8 rounded-tr-[80px] rounded-br-[80px]">
          <div className="text-center h-[400px]">
            <div className="flex justify-center mb-12">
              <img src={logo_with_title} alt="logo" className="mb-12 h-44 w-auto" />
            </div>
            <p className="text-gray-300 mb-12">New to our platform? Sign up now.</p>
            <Link
              to="/register"
              className="border-2 border-white px-8 font-semibold py-2 rounded-lg hover:bg-white hover:text-black transition"
            >
              SIGN UP
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;


