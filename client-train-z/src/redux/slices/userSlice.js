import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userDetails: null,
};

export const userSlice = createSlice({
  name: "userDetails",
  initialState,
  reducers: {
    instantiateUser: (state, action) => {
      state.userDetails = action.payload;
    },
    removeCurrentUser: (state) => {
      state.userDetails = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const { instantiateUser, removeCurrentUser } = userSlice.actions;

export default userSlice.reducer;
