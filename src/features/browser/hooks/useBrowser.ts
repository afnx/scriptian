import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../../store";
import {
  addBookmark,
  addTab,
  closeTab,
  navigateToUrl,
  removeBookmark,
  switchTab,
  toggleTabView,
  updateTab,
} from "../browserSlice";
import { BrowserTab } from "../types";

export const useBrowser = () => {
  const dispatch = useAppDispatch();
  const browserState = useAppSelector((state) => state.browser);

  // Tab management operations
  const createNewTab = (url?: string) => {
    dispatch(addTab(url));
  };

  const closeTabById = (tabId: string) => {
    dispatch(closeTab(tabId));
  };

  const updateTabById = (tabId: string, updates: Partial<BrowserTab>) => {
    dispatch(updateTab({ tabId, updates }));
  };

  const switchToTab = (tabId: string) => {
    dispatch(switchTab(tabId));
  };

  const toggleTabs = () => {
    dispatch(toggleTabView());
  };

  // Navigation operations
  const navigateTab = (tabId: string, url: string) => {
    dispatch(navigateToUrl({ tabId, url }));
  };

  // Bookmark operations
  const toggleBookmark = useCallback(
    (url: string) => {
      if (browserState.bookmarks.includes(url)) {
        dispatch(removeBookmark(url));
      } else {
        dispatch(addBookmark(url));
      }
    },
    [dispatch, browserState.bookmarks]
  );

  const isBookmarked = (url: string) => {
    return browserState.bookmarks.includes(url);
  };

  // Computed values
  const activeTab = browserState.tabs.find(
    (tab) => tab.id === browserState.activeTabId
  );
  const tabCount = browserState.tabs.length;
  const hasMultipleTabs = tabCount > 1;

  return {
    // State
    tabs: browserState.tabs,
    activeTabId: browserState.activeTabId,
    showTabs: browserState.showTabs,
    bookmarks: browserState.bookmarks,
    activeTab,
    tabCount,
    hasMultipleTabs,

    // Actions
    createNewTab,
    closeTabById,
    updateTabById,
    switchToTab,
    toggleTabs,
    navigateTab,
    toggleBookmark,
    isBookmarked,
  };
};
