import type { RootState } from "@/store/store";

export const selectTheme = (state: RootState) => state.ui.theme;

export const selectLanguage = (state: RootState) => state.ui.language;

export const selectSidebarOpen = (state: RootState) =>
  state.ui.sidebarOpen;