import { combineReducers } from "@reduxjs/toolkit";

import { authReducer } from "@/features/auth/store";
import { uiReducer } from "@/features/ui/store";
import { carsReducer } from "@/features/cars/store";

export const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  cars: carsReducer,
});