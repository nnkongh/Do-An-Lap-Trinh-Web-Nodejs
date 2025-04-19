import React, { useEffect, useState } from "react";
import {useDispatch, useSelector} from "react-redux";
import {addBook,fetchAllBooks} from "../store/slices/bookSlice"
import {toggleAddBookPopup} from "../store/slices/popUpSlice"
const AddBookPopup = () => {
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [author,setAuthor] = useState("");
  const [price,setPrice] = useState("");
  const [quantity,setQuantity] =useState("")
  const [description,setDescription] = useState("");

  const handleAddBook = (e) => {
    e.preventDefault();
    const data = {
      title,
      author,
      price: Number(price),
      quantity: Number(quantity),
      description,
    };
    dispatch(addBook(data))
    
    
  };
 
  return <>
   <div className="fixed inset-0 bg-black bg-opacity-50 p-5 flex items-center justify-center z-50">
        <div className="w-full bg-white rounded-lg shadow-lg md:w-1/3">
          <div className="p-6">
            <h3 className="text-xl font-bold mb-4">Sổ ghi chép</h3>
            <form onSubmit={handleAddBook}>
              <div className="mb-4">
                <label className="block text-gray-900">Tiêu đề</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Tiêu đề"
                  className="w-full px-4 py-2 border-2 border-black rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-900">Tác giả</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Tác giả"
                  className="w-full px-4 py-2 border-2 border-black rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-900">Giá sách (giá cho mượn sách)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Giá sách"
                  className="w-full px-4 py-2 border-2 border-black rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-900">Số lượng sách</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Số lượng sách"
                  className="w-full px-4 py-2 border-2 border-black rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-900">Mô tả</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Mô tả"
                 rows={4} className="w-full px-4 py-2 border-2 border-black rounded-md"/>
                
              </div>
              <div className="flex justify-end space-x-4">
                <button className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300" type="button" onClick={()=>{
                  dispatch(toggleAddBookPopup())
                }}>Đóng</button>
                <button type="submit" className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800">Thêm</button>
              </div>
            </form>
          </div>
        </div>
      </div>
  </>;
};

export default AddBookPopup;
