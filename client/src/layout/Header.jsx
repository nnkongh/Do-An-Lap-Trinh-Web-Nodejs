import React, { useEffect, useState } from "react";
import settingIcon from "../assets/setting.png";
import userIcon from "../assets/user.png";
import { useDispatch, useSelector } from "react-redux";

const Header = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth); // sửa userSelector thành useSelector
  const [currentTime, setCurrentTime] = useState(""); // sửa userState thành useState
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const hours = now.getHours() % 12 || 12;
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const ampm = now.getHours() >= 12 ? "PM" : "AM";
      setCurrentTime(`${hours}:${minutes} ${ampm}`);

      const options = { month: "short", day: "numeric", year: "numeric" }; // sửa 'dat' thành 'day'
      setCurrentDate(now.toLocaleDateString("en-US", options));
    };

    updateDateTime();
    const intervalID = setInterval(updateDateTime, 1000);
    return () => clearInterval(intervalID);
  }, []);

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
          <img src={settingIcon} alt="settings" className="w-6 h-6" />
        </div>
      </header>
    </>
  );
};

export default Header;