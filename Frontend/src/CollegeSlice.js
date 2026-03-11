import { createSlice } from '@reduxjs/toolkit';

// Retrieve initial state from localStorage if it exists, otherwise default to "Select College"
const initialState = {
  selectedCollege: localStorage.getItem('selectedCollege') || 'Select College',
};

export const collegeSlice = createSlice({
  name: 'college',
  initialState,
  reducers: {
    setSelectedCollege: (state, action) => {
      state.selectedCollege = action.payload;
      // Persist the selection so it survives page reloads
      localStorage.setItem('selectedCollege', action.payload);
    },
  },
});

export const { setSelectedCollege } = collegeSlice.actions;

export const selectCurrentCollege = (state) => state.college.selectedCollege;

export default collegeSlice.reducer;
