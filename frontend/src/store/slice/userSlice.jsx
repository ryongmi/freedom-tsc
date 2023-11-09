import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userName: "",
  loginId: "",
  profileImgUrl: "",
  broadcasterType: "",
  isLoggedIn: false,
  adminFlag: "N",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: {
      prepare({
        userName = "",
        loginId = "",
        profileImgUrl = "",
        broadcasterType = "",
        isLoggedIn = false,
        adminFlag = "N",
      }) {
        return {
          payload: {
            userName,
            loginId,
            profileImgUrl,
            broadcasterType,
            isLoggedIn,
            adminFlag,
          },
        };
      },
      reducer(state, action) {
        state.userName = action.payload.userName;
        state.loginId = action.payload.loginId;
        state.profileImgUrl = action.payload.profileImgUrl;
        state.broadcasterType = action.payload.broadcasterType;
        state.isLoggedIn = action.payload.isLoggedIn;
        state.adminFlag = action.payload.adminFlag;
      },
    },
  },
});

export const { updateUser } = userSlice.actions;

export default userSlice.reducer;
