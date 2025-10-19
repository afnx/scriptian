import { act } from "@testing-library/react-native";
import {
  createMockTab,
  defaultBrowserState,
  renderHookWithStore,
} from "../../../../__tests__/utils/testUtils";
import { useBrowser } from "../useBrowser";

describe("useBrowser Hook", () => {
  describe("Initial State", () => {
    it("should return initial browser state correctly", () => {
      const { result } = renderHookWithStore(() => useBrowser());

      expect(result.current.tabs).toHaveLength(1);
      expect(result.current.activeTabId).toBe("tab-1");
      expect(result.current.showTabs).toBe(false);
      expect(result.current.bookmarks).toEqual(["https://bookmark.com"]);
      expect(result.current.activeTab).toEqual({
        id: "tab-1",
        url: "https://example.com",
        title: "Example",
        isLoading: false,
        canGoBack: false,
        canGoForward: false,
        activeScripts: [],
      });
    });

    it("should return computed values correctly", () => {
      const { result } = renderHookWithStore(() => useBrowser(), {
        initialState: {
          browser: {
            ...defaultBrowserState,
            tabs: [
              createMockTab({
                id: "tab-1",
                url: "https://example.com",
                title: "Example",
              }),
              createMockTab({
                id: "tab-2",
                url: "https://google.com",
                title: "Google",
              }),
            ],
          },
        },
      });

      expect(result.current.tabCount).toBe(2);
      expect(result.current.hasMultipleTabs).toBe(true);
    });

    it("should handle no active tab correctly", () => {
      const { result } = renderHookWithStore(() => useBrowser(), {
        initialState: {
          browser: {
            ...defaultBrowserState,
            tabs: [],
            activeTabId: "",
          },
        },
      });

      expect(result.current.activeTab).toBeUndefined();
      expect(result.current.tabCount).toBe(0);
      expect(result.current.hasMultipleTabs).toBe(false);
    });
  });

  describe("Tab Management", () => {
    it("should create new tab with default URL", () => {
      const { result, store } = renderHookWithStore(() => useBrowser());

      act(() => {
        result.current.createNewTab();
      });

      const state = store.getState().browser;
      expect(state.tabs).toHaveLength(2);
      expect(state.tabs[1].url).toBe(
        process.env.EXPO_PUBLIC_HOME_PAGE_URL || "https://www.google.com"
      );
    });

    it("should create new tab with custom URL", () => {
      const { result, store } = renderHookWithStore(() => useBrowser());

      act(() => {
        result.current.createNewTab("https://custom.com");
      });

      const state = store.getState().browser;
      expect(state.tabs).toHaveLength(2);
      expect(state.tabs[1].url).toBe("https://custom.com");
    });

    it("should close tab by id", () => {
      const { result, store } = renderHookWithStore(() => useBrowser(), {
        initialState: {
          browser: {
            ...defaultBrowserState,
            tabs: [
              createMockTab({
                id: "tab-1",
                url: "https://example.com",
                title: "Example",
              }),
              createMockTab({
                id: "tab-2",
                url: "https://google.com",
                title: "Google",
              }),
            ],
          },
        },
      });

      act(() => {
        result.current.closeTabById("tab-1");
      });

      const state = store.getState().browser;
      expect(state.tabs).toHaveLength(1);
      expect(state.tabs[0].id).toBe("tab-2");
    });

    it("should update tab by id", () => {
      const { result, store } = renderHookWithStore(() => useBrowser());

      act(() => {
        result.current.updateTabById("tab-1", {
          title: "Updated Title",
          isLoading: true,
        });
      });

      const state = store.getState().browser;
      const updatedTab = state.tabs.find((tab) => tab.id === "tab-1");
      expect(updatedTab?.title).toBe("Updated Title");
      expect(updatedTab?.isLoading).toBe(true);
    });

    it("should switch to tab", () => {
      const { result, store } = renderHookWithStore(() => useBrowser(), {
        initialState: {
          browser: {
            ...defaultBrowserState,
            tabs: [
              createMockTab({
                id: "tab-1",
                url: "https://example.com",
                title: "Example",
              }),
              createMockTab({
                id: "tab-2",
                url: "https://google.com",
                title: "Google",
              }),
            ],
            activeTabId: "tab-1",
          },
        },
      });

      act(() => {
        result.current.switchToTab("tab-2");
      });

      const state = store.getState().browser;
      expect(state.activeTabId).toBe("tab-2");
      expect(state.showTabs).toBe(false);
    });

    it("should toggle tab view", () => {
      const { result, store } = renderHookWithStore(() => useBrowser(), {
        initialState: {
          browser: {
            ...defaultBrowserState,
            showTabs: false,
          },
        },
      });

      act(() => {
        result.current.toggleTabs();
      });

      const state = store.getState().browser;
      expect(state.showTabs).toBe(true);
    });
  });

  describe("Navigation", () => {
    it("should navigate tab to URL", () => {
      const { result, store } = renderHookWithStore(() => useBrowser());

      act(() => {
        result.current.navigateTab("tab-1", "https://newurl.com");
      });

      const state = store.getState().browser;
      const tab = state.tabs.find((t) => t.id === "tab-1");
      expect(tab?.url).toBe("https://newurl.com");
      expect(tab?.isLoading).toBe(true);
    });
  });

  describe("Bookmarks", () => {
    it("should add bookmark when URL is not bookmarked", () => {
      const { result, store } = renderHookWithStore(() => useBrowser(), {
        initialState: {
          browser: {
            ...defaultBrowserState,
            bookmarks: ["https://existing.com"],
          },
        },
      });

      act(() => {
        result.current.toggleBookmark("https://newbookmark.com");
      });

      const state = store.getState().browser;
      expect(state.bookmarks).toContain("https://newbookmark.com");
      expect(state.bookmarks).toHaveLength(2);
    });

    it("should remove bookmark when URL is already bookmarked", () => {
      const { result, store } = renderHookWithStore(() => useBrowser(), {
        initialState: {
          browser: {
            ...defaultBrowserState,
            bookmarks: ["https://existing.com", "https://tobedeleted.com"],
          },
        },
      });

      act(() => {
        result.current.toggleBookmark("https://tobedeleted.com");
      });

      const state = store.getState().browser;
      expect(state.bookmarks).not.toContain("https://tobedeleted.com");
      expect(state.bookmarks).toHaveLength(1);
    });

    it("should correctly identify bookmarked URLs", () => {
      const { result } = renderHookWithStore(() => useBrowser(), {
        initialState: {
          browser: {
            ...defaultBrowserState,
            bookmarks: ["https://bookmarked.com"],
          },
        },
      });

      expect(result.current.isBookmarked("https://bookmarked.com")).toBe(true);
      expect(result.current.isBookmarked("https://notbookmarked.com")).toBe(
        false
      );
    });
  });

  describe("Function Stability", () => {
    it("should maintain function reference stability for memoized functions", () => {
      const { result, rerender } = renderHookWithStore(() => useBrowser());

      const firstRender = {
        toggleBookmark: result.current.toggleBookmark,
      };

      rerender({});

      const secondRender = {
        toggleBookmark: result.current.toggleBookmark,
      };

      // toggleBookmark should maintain reference stability due to useCallback
      expect(firstRender.toggleBookmark).toBe(secondRender.toggleBookmark);
    });

    it("should create new function references for non-memoized functions", () => {
      const { result, rerender } = renderHookWithStore(() => useBrowser());

      const firstRender = {
        createNewTab: result.current.createNewTab,
        closeTabById: result.current.closeTabById,
      };

      rerender({});

      const secondRender = {
        createNewTab: result.current.createNewTab,
        closeTabById: result.current.closeTabById,
      };

      // These functions are not memoized, so they should be different references
      expect(firstRender.createNewTab).not.toBe(secondRender.createNewTab);
      expect(firstRender.closeTabById).not.toBe(secondRender.closeTabById);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty tab array", () => {
      const { result } = renderHookWithStore(() => useBrowser(), {
        initialState: {
          browser: {
            ...defaultBrowserState,
            tabs: [],
            activeTabId: "",
          },
        },
      });

      expect(result.current.tabs).toHaveLength(0);
      expect(result.current.activeTab).toBeUndefined();
      expect(result.current.tabCount).toBe(0);
      expect(result.current.hasMultipleTabs).toBe(false);
    });

    it("should handle invalid active tab id", () => {
      const { result } = renderHookWithStore(() => useBrowser(), {
        initialState: {
          browser: {
            ...defaultBrowserState,
            activeTabId: "non-existent-tab",
          },
        },
      });

      expect(result.current.activeTab).toBeUndefined();
    });
  });
});
