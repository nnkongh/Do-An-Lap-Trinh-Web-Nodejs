import React from "react";
import { useSelector } from "react-redux";
import Header from "../layout/Headers";

const Users = () => {
  const { users } = useSelector((state) => state.user);

  const formatDate = (timeStamp) => {
    const date = new Date(timeStamp);

    const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getFullYear())}`;

    const formattedTime = `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
    const result=`${formattedDate} ${formattedTime}`;

    return result;
  };
  
  return <>
  <main className="relative flex-` p-6 pt-28">
    <Header/>
    <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
      <h2 className="text-xl font-medium md:text-2xl md:font-semibold">Người dùng đăng ký</h2>
    </header>
    {
      users && users.filter((u) => u.role === "User").length > 0 ? (
        <div className="mt-6 overflow-auto bg-white rounded-md shadow-lg">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
              <th className="px-4 py-2 text-left">Id</th>
                <th className="px-4 py-2 text-left">Tên</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Vai trò</th>
                <th className="px-4 py-2 text-center">Sách đã mượn</th>
                <th className="px-4 py-2 text-center">Đăng ký lúc</th>
              </tr>
            </thead>
            <tbody>
              {
                users.filter(u => u.role === "User").map((user,index) => (
                  <tr key={user._id} className={(index + 1) % 2 === 0 ? "bg-gray-50" : ""}>
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.role}</td>
                    <td className="px-4 text-center">{user?.borrowedBooks.length}</td>
                    <td className="px-4 text-center">{formatDate(user.createdAt)}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      ) : (
        <h3 className="text-3xl mt-5 font-medium">Không có tài khoản nào đăng ký</h3>
      )

    }
  </main>
 </>;
};

export default Users;