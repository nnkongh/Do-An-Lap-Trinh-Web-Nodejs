import React, { useEffect, useState } from "react";
import settingIcon from "../assets/setting.png";
import userIcon from "../assets/user.png";
import { useDispatch, useSelector } from "react-redux";
import { toggleSettingPopup } from "../store/slices/popUpSlice"; // Import action toggleSettingPopup

const Header = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { settingPopup } = useSelector((state) => state.popup); // Lấy trạng thái settingPopup từ Redux
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const hours = now.getHours() % 12 || 12;
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const ampm = now.getHours() >= 12 ? "PM" : "AM";
      setCurrentTime(`${hours}:${minutes} ${ampm}`);

      const options = { month: "short", day: "numeric", year: "numeric" };
      setCurrentDate(now.toLocaleDateString("en-US", options));
    };

    updateDateTime();
    const intervalID = setInterval(updateDateTime, 1000);
    return () => clearInterval(intervalID);
  }, []);

  // Hàm mở/đóng popup cài đặt
  const handleSettingsClick = () => {
    dispatch(toggleSettingPopup());  // Toggle trạng thái settingPopup trong Redux
  };

  return (
    <>
      <header className="absolute top-0 bg-white w-full py-4 px-6 left-0 shadow-md flex justify-between items-center">
        {/* LEFT SIDE */}
        <div className="flex items-center gap-3">
          <img src={userIcon} alt="userIcon" className="w-10 h-10" />
          <div className="flex flex-col">
            <span className="text-sm font-medium sm:text-lg lg:text-x1 sm:font-semibold">
              {user && user.name}
            </span>
            <span className="text-sm font-medium sm:text-lg sm:font-medium">
              {user && user.role}
            </span>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-gray-800 font-semibold">{currentTime}</div>
            <div className="text-gray-500 text-sm">{currentDate}</div>
          </div>
          <img
            src={settingIcon}
            alt="settings"
            className="w-6 h-6 cursor-pointer"
            onClick={handleSettingsClick}  // Khi nhấp vào biểu tượng cài đặt
          />
        </div>
      </header>

      {/* Hiển thị popup cài đặt khi settingPopup là true */}
      {settingPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 p-5 flex items-center justify-center z-50">
          <div className="w-full bg-white rounded-lg shadow-lg sm:w-auto lg:w-1/2 2xl:w-1/3">
            {/* Nội dung của popup */}
            <div className="p-6">
              <header className="flex justify-between items-center mb-7 pb-5 border-b-[1px] border-black">
                <div className="flex items-center gap-3">
                  <img
                    src={settingIcon}
                    alt="setting-icon"
                    className="bg-gray-300 p-5 rounded-lg"
                  />
                  <h3 className="text-xl font-bold">Change Credentials</h3>
                </div>
                <button
                  onClick={() => dispatch(toggleSettingPopup())}  // Đóng popup khi nhấp vào nút đóng
                >
                  X
                </button>
              </header>
              <form>
                {/* Form để thay đổi mật khẩu */}
                <div className="mb-4">
                  <label className="block text-gray-900 font-medium">Current Password</label>
                  <input type="password" className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-900 font-medium">New Password</label>
                  <input type="password" className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-900 font-medium">Confirm New Password</label>
                  <input type="password" className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                </div>
                <div className="flex gap-4 mt-10">
                  <button
                    type="button"
                    onClick={() => dispatch(toggleSettingPopup())}  // Đóng popup
                    className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    CANCEL
                  </button>
                  <button type="submit" className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800">
                    CONFIRM
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
