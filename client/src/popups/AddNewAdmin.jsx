import React from "react";
import closeIcon from "../assets/close-square.png";
import placeHolder from "../assets/placeholder.jpg";
import keyIcon from "../assets/key.png";

const AddNewAdmin = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <img
          src={closeIcon}
          alt="Close"
          className="absolute top-4 right-4 cursor-pointer w-6 h-6"
          onClick={() => {
            // Đóng popup ở đây, cần dispatch toggleAddNewAdminPopup nếu có access
          }}
        />
        <h2 className="text-xl font-semibold mb-4">Add New Admin</h2>
        <form>
          <input
            type="text"
            placeholder="Username"
            className="w-full border border-gray-300 rounded p-2 mb-3"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 rounded p-2 mb-3"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 rounded p-2 mb-4"
          />
          <button className="bg-black text-white px-4 py-2 rounded w-full">
            Create Admin
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddNewAdmin;
