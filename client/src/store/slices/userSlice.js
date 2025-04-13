import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const userSlice = createSlice({
  name: "user",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {
    fetchAllUsersRequest(state) {
      state.loading = true;
    },
    fetchAllUsersSuccess(state, action) {
      state.loading = false;
      state.users = action.payload;
      state.error = null;
    },
    fetchAllUsersFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    addNewAdminRequest(state) {
      state.loading = true;
    },
    addNewAdminSuccess(state) {
      state.loading = false;
      state.error = null;
    },
    addNewAdminFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

// Actions
export const fetchAllUsers = () => async (dispatch) => {
  dispatch(userSlice.actions.fetchAllUsersRequest());
  try {
    const res = await axios.get("http://localhost:4000/api/v1/user/all", {
      withCredentials: true,
    });
    dispatch(userSlice.actions.fetchAllUsersSuccess(res.data.users));
  } catch (err) {
    dispatch(
      userSlice.actions.fetchAllUsersFailed(
        err.response?.data?.message || "Có lỗi xảy ra khi tải danh sách user"
      )
    );
  }
};

export const addNewAdmin = (data) => async (dispatch) => {
  dispatch(userSlice.actions.addNewAdminRequest());
  try {
    const res = await axios.post(
      "http://localhost:4000/api/v1/user/add/new-admin",
      data,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    dispatch(userSlice.actions.addNewAdminSuccess());
    toast.success(res.data.message);
  } catch (err) {
    dispatch(
      userSlice.actions.addNewAdminFailed(
        err.response?.data?.message || "Có lỗi khi thêm admin mới"
      )
    );
    toast.error(err.response?.data?.message || "Có lỗi khi thêm admin mới");
  }
};

// Export reducer
export default userSlice.reducer;
