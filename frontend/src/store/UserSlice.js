import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isError: false,
  isLoggedIn: false,
  _id: "",
  username: "",
  email: "",
  name: "",
  isAdmin: false,
  token: "",
  errorMessage: "",
  userList: [],
  adminEditUser: {
    email: "",
    name: "",
    isAdmin: false,
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.isError = false;
      state.errorMessage = "";
      state.isLoggedIn = true;

      const user = action.payload;

      state._id = user._id;
      state.name = user.name;
      state.username = user.username;
      state.email = user.email;
      state.isAdmin = user.isAdmin;
      state.token = user.token;

      localStorage.setItem("user", JSON.stringify(state));
    },
    setError: (state, action) => {
      state.isError = true;
      state.isLoggedIn = false;

      state.errorMessage = action.payload;
    },

    logout: (state, action) => {
      state.isLoggedIn = false;
      state._id = "";
      state.name = "";
      state.username = "";
      state.email = "";
      state.isAdmin = false;
      state.token = "";

      localStorage.setItem("user", JSON.stringify(state));
    },

    loadFromLocalStorage: (state, action) => {
      state.isError = false;
      state.errorMessage = "";

      const user = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : state;
      state.isLoggedIn = user.isLoggedIn;

      state._id = user._id;
      state.name = user.name;
      state.username = user.username;
      state.email = user.email;
      state.isAdmin = user.isAdmin;
      state.token = user.token;
    },

    setUserList: (state, action) => {
      state.userList = action.payload;
    },

    setAdminEditUser: (state, action) => {
      state.adminEditUser.email = action.payload.email;
      state.adminEditUser.name = action.payload.name;
      state.adminEditUser.isAdmin = action.payload.isAdmin;
    },
  },
});

export const {
  setUser,
  setError,
  logout,
  setUserList,
  loadFromLocalStorage,
  setAdminEditUser,
} = userSlice.actions;
export default userSlice.reducer;
