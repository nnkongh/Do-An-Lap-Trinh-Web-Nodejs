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

//export default Login;
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fakeLogin } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import logo_with_title from "../assets/logo-with-title.png";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(fakeLogin({ email, password }));
    navigate("/home"); // hoặc đường dẫn tùy bạn
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <img src={logo_with_title} alt="Logo" className="w-60 mb-8" />
      <div className="bg-white p-6 rounded-lg shadow-md w-80">
        <h2 className="text-xl font-semibold mb-4 text-center">Đăng nhập</h2>

        {error && (
          <div className="text-red-500 text-sm text-center mb-2">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-3 border border-gray-300 rounded"
            required
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition duration-200"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;


