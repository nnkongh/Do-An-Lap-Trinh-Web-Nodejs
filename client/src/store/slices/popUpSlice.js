import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  settingPopup: false,
  addBookPopup: false,
  readBookPopup: false,
  recordBookPopup: false,
  returnBookPopup: false,
  addNewAdminPopup: false,
};

const popUpSlice = createSlice({
  name: "popup",
  initialState,
  reducers: {
    toggleSettingPopup(state) {
      state.settingPopup = !state.settingPopup;
    },
    toggleAddBookPopup(state) {
      state.addBookPopup = !state.addBookPopup;
    },
    toggleReadBookPopup(state) {
      state.readBookPopup = !state.readBookPopup;
    },
    toggleRecordBookPopup(state) {
      state.recordBookPopup = !state.recordBookPopup;
    },
    toggleAddNewAdminPopup(state) {
      state.addNewAdminPopup = !state.addNewAdminPopup;
    },
    toggleReturnBookPopup(state) {  // Đổi ở đây cho khớp state
      state.returnBookPopup = !state.returnBookPopup;
    },
    closeAllPopup(state) {
      state.addBookPopup = false;
      state.readBookPopup = false;
      state.recordBookPopup = false;
      state.returnBookPopup = false;
      state.addNewAdminPopup = false;
      state.settingPopup = false;
    },
  },
});

export const {
  closeAllPopup,
  toggleAddBookPopup,
  toggleAddNewAdminPopup,
  toggleReadBookPopup,
  toggleRecordBookPopup,
  toggleReturnBookPopup,  // Và export đúng tên này
  toggleSettingPopup,
} = popUpSlice.actions;

export default popUpSlice.reducer;
