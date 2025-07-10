import { createSlice } from "@reduxjs/toolkit";

// Load user from localStorage if available
const savedUser = JSON.parse(localStorage.getItem("user"));

const userSlice = createSlice({
  name: "user",
  initialState: savedUser || null,
  reducers: {
    setUser: (state, action) => {
      const userData = action.payload;
      localStorage.setItem("user", JSON.stringify(userData));
      return userData;
    },
    logoutUser: () => {
      localStorage.removeItem("user");
      return null;
    },
  },
});

export const { setUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
