/**
 * A collection of icon name constants used throughout the application UI.
 *
 * @remarks
 * - All icon names are marked as `const` to ensure type safety and prevent accidental modification.
 * - The keys are grouped by their usage context for clarity.
 *
 * @example
 * ```typescript
 * import { Icons } from './constants/Icons';
 *
 * // Use an icon for a back button
 * const backIcon = Icons.back; // "chevron-back"
 * ```
 */
export const Icons = {
  // Bottom toolbar navigation
  back: "chevron-back" as const,
  forward: "chevron-forward" as const,
  share: "share-outline" as const,
  bookmarks: "book-outline" as const,
  tabs: "copy-outline" as const,

  // Address bar icons
  refresh: "refresh" as const,
  stop: "close" as const,
  secure: "lock-closed" as const,
  insecure: "warning" as const,
  search: "search" as const,
  microphone: "mic-outline" as const,
  deleteInput: "close-circle" as const,
  readerOutline: "reader-outline" as const,

  // Tab management
  closeTab: "close" as const,
  addTab: "add" as const,
  tabOverview: "albums-outline" as const,

  // Menu and settings
  menu: "ellipsis-horizontal" as const,
  settings: "settings-outline" as const,
  more: "ellipsis-vertical" as const,

  // Browser actions
  reload: "refresh" as const,
  home: "home-outline" as const,
  downloads: "download-outline" as const,
  history: "time-outline" as const,

  // Script management
  scripts: "code-outline" as const,
  scriptActive: "code" as const,
  scriptDisabled: "code-slash-outline" as const,

  // Reader and accessibility
  reader: "reader-outline" as const,
  textSize: "text" as const,

  // Bookmarks and favorites
  bookmark: "book-outline" as const,
  bookmarkFilled: "book" as const,
  star: "star-outline" as const,
  starFilled: "star" as const,

  // General UI
  check: "checkmark" as const,
  error: "alert-circle" as const,
  info: "information-circle" as const,
  edit: "create-outline" as const,
  delete: "trash-outline" as const,
  copy: "copy-outline" as const,
} as const;

export type Icon = (typeof Icons)[keyof typeof Icons];

export const IconSizes = {
  small: 16,
  medium: 20,
  large: 24,
  xlarge: 28,
  toolbar: 24,
  tab: 20,
} as const;
