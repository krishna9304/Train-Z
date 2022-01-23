import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// export interface UserManagementState {
//   approvedUsers: Array<any>;
//   waitingUsers: Array<any>;
//   rejectedUsers: Array<any>;
// }

const initialState = {
  approvedUsers: [],
  waitingUsers: [],
  rejectedUsers: [],
};

export const UserManagementSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addApprovedUsers: (state, action) => {
      state.approvedUsers = action.payload;
    },
    addRejectedUsers: (state, action) => {
      state.rejectedUsers = action.payload;
    },
    addWaitingUsers: (state, action) => {
      state.waitingUsers = action.payload;
    },
    removeApprovedUsers: (state, action) => {
      state.approvedUsers = state.approvedUsers.filter(
        (user) => user.email !== action.payload
      );
    },
    removeRejectedUsers: (state, action) => {
      state.rejectedUsers = state.rejectedUsers.filter(
        (user) => user.email !== action.payload
      );
    },
    removeWaitingUsers: (state, action) => {
      state.waitingUsers = state.waitingUsers.filter(
        (user) => user.email !== action.payload
      );
    },
    addOneToApprovedUsers: (state, action) => {
      state.approvedUsers.push(action.payload);
    },
    addOneToRejectedUsers: (state, action) => {
      state.rejectedUsers.push(action.payload);
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  addApprovedUsers,
  addRejectedUsers,
  addWaitingUsers,
  removeApprovedUsers,
  removeRejectedUsers,
  addOneToApprovedUsers,
  addOneToRejectedUsers,
  removeWaitingUsers,
} = UserManagementSlice.actions;

export default UserManagementSlice.reducer;
