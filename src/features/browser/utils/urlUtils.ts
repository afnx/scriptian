/**
 * Determines whether a given string is a valid URL.
 *
 * @param url - The string to validate as a URL.
 * @returns `true` if the string is a valid URL, `false` otherwise.
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Checks if a given string is a valid domain name.
 *
 * @param domain - The domain name string to validate.
 * @returns `true` if the domain is valid, otherwise `false`.
 */
export const isValidDomain = (domain: string): boolean => {
  const domainRegex =
    /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return domainRegex.test(domain);
};

/**
 * Normalizes a given input string into a valid URL or a Google search URL.
 *
 * @param input - The string to normalize as a URL or search query.
 * @returns The normalized URL or search URL.
 */
export const normalizeUrl = (input: string): string => {
  if (!input.trim()) {
    return "";
  }

  const trimmedInput = input.trim();

  // If it looks like a search query (contains spaces or no dots), use Google search
  if (
    trimmedInput.includes(" ") ||
    (!trimmedInput.includes(".") && !trimmedInput.startsWith("localhost"))
  ) {
    return `https://www.google.com/search?q=${encodeURIComponent(
      trimmedInput
    )}`;
  }

  // Handle localhost
  if (trimmedInput.startsWith("localhost")) {
    return trimmedInput.startsWith("http")
      ? trimmedInput
      : `http://${trimmedInput}`;
  }

  // Add protocol if missing
  if (
    !trimmedInput.startsWith("http://") &&
    !trimmedInput.startsWith("https://")
  ) {
    return `https://${trimmedInput}`;
  }

  return trimmedInput;
};

export const extractDomain = (url: string): string => {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
};

export const extractProtocol = (url: string): string => {
  try {
    return new URL(url).protocol;
  } catch {
    return "https:";
  }
};

/**
 * Determines if a given URL is considered secure.
 *
 * @param url - The URL string to check.
 * @returns `true` if the URL is secure, otherwise `false`.
 */
export const isSecureUrl = (url: string): boolean => {
  return url.startsWith("https://") || url.startsWith("localhost");
};

/**
 * Formats a given URL string for display by extracting the hostname,
 * pathname (if not root), and search parameters.
 * If the input is not a valid URL, returns the original string.
 *
 * @param url - The URL string to format for display.
 * @returns A formatted string suitable for display, or the original string if invalid.
 */
export const formatUrlForDisplay = (url: string): string => {
  try {
    const urlObj = new URL(url);
    let displayUrl = urlObj.hostname;

    // if (urlObj.pathname !== "/") {
    //   displayUrl += urlObj.pathname;
    // }

    // if (urlObj.search) {
    //   displayUrl += urlObj.search;
    // }

    return displayUrl;
  } catch {
    return url;
  }
};

export const getUrlWithoutProtocol = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return url.replace(`${urlObj.protocol}//`, "");
  } catch {
    return url;
  }
};

export const isSameOrigin = (url1: string, url2: string): boolean => {
  try {
    const urlObj1 = new URL(url1);
    const urlObj2 = new URL(url2);
    return urlObj1.origin === urlObj2.origin;
  } catch {
    return false;
  }
};

/**
 * Builds a search URL for the specified search engine using the provided query.
 *
 * @param query - The search query string to be encoded and appended to the URL.
 * @param searchEngine - The search engine to use ("google", "bing", or "duckduckgo"). Defaults to "google".
 * @returns The complete search URL for the specified search engine.
 */
export const buildSearchUrl = (
  query: string,
  searchEngine: string = "google"
): string => {
  const encodedQuery = encodeURIComponent(query);

  const searchEngines = {
    google: `https://www.google.com/search?q=${encodedQuery}`,
    bing: `https://www.bing.com/search?q=${encodedQuery}`,
    duckduckgo: `https://duckduckgo.com/?q=${encodedQuery}`,
  };

  return (
    searchEngines[searchEngine as keyof typeof searchEngines] ||
    searchEngines.google
  );
};
