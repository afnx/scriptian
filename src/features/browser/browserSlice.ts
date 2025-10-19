import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";
import { BrowserState, BrowserTab } from "./types";

const homePageUrl =
  process.env.EXPO_PUBLIC_HOME_PAGE_URL || "https://www.google.com";

const initialState: BrowserState = {
  tabs: [
    {
      id: "1",
      url: homePageUrl,
      title: "Homepage",
      isLoading: false,
      canGoBack: false,
      canGoForward: false,
      activeScripts: [],
    },
  ],
  activeTabId: "1",
  showTabs: false,
  bookmarks: [],
};

const browserSlice = createSlice({
  name: "browser",
  initialState,
  reducers: {
    addTab: {
      reducer: (state, action: PayloadAction<{ id: string; url?: string }>) => {
        const newTab: BrowserTab = {
          id: action.payload.id,
          url: action.payload.url || homePageUrl,
          title: "New Tab",
          isLoading: false,
          canGoBack: false,
          canGoForward: false,
          activeScripts: [],
        };
        state.tabs.push(newTab);
        state.activeTabId = newTab.id;
        state.showTabs = false;
      },
      prepare: (url?: string) => {
        return {
          payload: {
            id: nanoid(),
            url,
          },
        };
      },
    },
    closeTab: (state, action: PayloadAction<string>) => {
      const tabId = action.payload;
      state.tabs = state.tabs.filter((tab) => tab.id !== tabId);

      if (state.activeTabId === tabId && state.tabs.length > 0) {
        state.activeTabId = state.tabs[0].id;
      }

      if (state.tabs.length <= 1) {
        state.showTabs = false;
      }
    },

    updateTab: (
      state,
      action: PayloadAction<{
        tabId: string;
        updates: Partial<BrowserTab>;
      }>
    ) => {
      const { tabId, updates } = action.payload;
      const tab = state.tabs.find((t) => t.id === tabId);
      if (tab) {
        Object.assign(tab, updates);
      }
    },

    switchTab: (state, action: PayloadAction<string>) => {
      state.activeTabId = action.payload;
      state.showTabs = false;
    },

    toggleTabView: (state) => {
      state.showTabs = !state.showTabs;
    },

    navigateToUrl: (
      state,
      action: PayloadAction<{ tabId: string; url: string }>
    ) => {
      const { tabId, url } = action.payload;
      const tab = state.tabs.find((t) => t.id === tabId);
      if (tab) {
        tab.url = url;
        tab.isLoading = true;
        tab.canGoBack = false;
        tab.canGoForward = false;
      }
    },

    addBookmark: (state, action: PayloadAction<string>) => {
      if (!state.bookmarks.includes(action.payload)) {
        state.bookmarks.push(action.payload);
      }
    },

    removeBookmark: (state, action: PayloadAction<string>) => {
      state.bookmarks = state.bookmarks.filter(
        (bookmark) => bookmark !== action.payload
      );
    },
  },
});

export const {
  addTab,
  closeTab,
  updateTab,
  switchTab,
  toggleTabView,
  navigateToUrl,
  addBookmark,
  removeBookmark,
} = browserSlice.actions;

export default browserSlice.reducer;
