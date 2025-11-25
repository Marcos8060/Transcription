'use client'
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
 
};

const nexusSlice = createSlice({
  name: "nexus",
  initialState,
  reducers: {
    setNexus: (state, action) => {},
  },
});

export const { setNexus } = nexusSlice.actions;

export default nexusSlice.reducer;
