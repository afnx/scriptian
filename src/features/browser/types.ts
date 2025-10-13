export interface BrowserTab {
  id: string;
  url: string;
  title: string;
  favicon?: string;
  isLoading: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
  activeScripts: string[];
}

export interface BrowserState {
  tabs: BrowserTab[];
  activeTabId: string;
  showTabs: boolean;
  bookmarks: string[];
}
