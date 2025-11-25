'use client'
import { configureStore } from "@reduxjs/toolkit";
import nexusReducer from "./features/index";
import interviewReducer from "./features/interviewSlice";

export const store = configureStore({
  reducer: {
    nexus: nexusReducer,
    interview: interviewReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
