import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ThemeMode = "light" | "dark" | "system";
export type Language = "en" | "ar";

interface UiState {
  theme: ThemeMode;
  language: Language;
  sidebarOpen: boolean;
}

const initialState: UiState = {
  theme: "system",
  language: "en",
  sidebarOpen: false,
};

const uiSlice = createSlice({
  name: "ui",

  initialState,

  reducers: {
    setTheme(state, action: PayloadAction<ThemeMode>) {
      state.theme = action.payload;
    },

    setLanguage(state, action: PayloadAction<Language>) {
      state.language = action.payload;
    },

    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },

    closeSidebar(state) {
      state.sidebarOpen = false;
    },
  },
});

export const {
  setTheme,
  setLanguage,
  toggleSidebar,
  closeSidebar,
} = uiSlice.actions;

export default uiSlice.reducer;