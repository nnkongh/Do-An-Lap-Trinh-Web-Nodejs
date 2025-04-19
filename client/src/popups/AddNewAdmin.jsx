import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toggleAddNewAdminPopup } from "../store/slices/popUpSlice";
import closeIcon from "../assets/close-square.png";

const AddNewAdmin = () => {
  const dispatch = useDispatch();

  // Khai báo state cho form
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);



  // Hàm đóng popup
  const handleClose = () => {
    dispatch(toggleAddNewAdminPopup());
  };

  // Hàm xử lý khi submit form
  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    
    if (!avatar) {
      alert("Vui lòng chọn avatar cho Admin!");
      return;
    }
    
    // Dùng FormData để gửi cả file và dữ liệu text
    const formData = new FormData();
    formData.append("name", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("role", "Admin");
    formData.append("avatar", avatar);
    
    try {
      const res = await fetch("http://localhost:4000/api/v1/user/add/new-admin", {
        method: "POST",
        // Không đặt Content-Type khi dùng FormData, browser sẽ tự đặt
        body: formData,
        credentials: "include",
      });
  
      const data = await res.json();
      console.log("Server response:", data);
  
      if (res.ok) {
        alert("Tạo admin thành công!");
        dispatch(toggleAddNewAdminPopup());
      } else {
        alert(data.message || "Tạo admin thất bại!");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Có lỗi xảy ra!");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <img
          src={closeIcon}
          alt="Close"
          className="absolute top-4 right-4 cursor-pointer w-6 h-6"
          onClick={handleClose}
        />
        <h2 className="text-xl font-semibold mb-4">Thêm Admin mới</h2>
        <form onSubmit={handleCreateAdmin}>
          <input
            type="text"
            placeholder="Username"
            className="w-full border border-gray-300 rounded p-2 mb-3"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 rounded p-2 mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 rounded p-2 mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="w-full border border-gray-300 rounded p-2 mb-3"
            onChange={(e) => setAvatar(e.target.files[0])}
/>
          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded w-full"
          >
            Tạo Admin
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddNewAdmin;

