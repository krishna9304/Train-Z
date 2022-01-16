import { createSlice } from "@reduxjs/toolkit";

// export interface UserState {
//   user: unknown;
// }

const initialState = {
  user: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    instantiateUser: (state, action) => {
      state.user = action.payload;
    },
    removeCurrentUser: (state) => {
      state.user = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const { instantiateUser, removeCurrentUser } = userSlice.actions;

export default userSlice.reducer;
