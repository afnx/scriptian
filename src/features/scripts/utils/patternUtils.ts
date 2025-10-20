export interface PatternValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates a URL pattern string to ensure it meets specific criteria.
 *
 * The validation checks include:
 * - The pattern is not empty or whitespace.
 * - The pattern does not contain invalid characters: `<`, `>`, `"`, `|`, or `\`.
 * - The pattern can be converted to a valid regular expression using `globToRegex`.
 *
 * @param pattern - The URL pattern string to validate.
 * @returns An object indicating whether the pattern is valid and, if invalid, an error message.
 */
export const validateUrlPattern = (
  pattern: string
): PatternValidationResult => {
  if (!pattern.trim()) {
    return { valid: false, error: "Pattern cannot be empty" };
  }

  const trimmedPattern = pattern.trim();

  // Check for invalid characters
  const invalidChars = /[<>"|\\]/;
  if (invalidChars.test(trimmedPattern)) {
    return { valid: false, error: "Pattern contains invalid characters" };
  }

  try {
    // Convert glob pattern to regex and test if it's valid
    const regexPattern = globToRegex(trimmedPattern);
    new RegExp(regexPattern, "i");
    return { valid: true };
  } catch {
    return { valid: false, error: "Invalid pattern format" };
  }
};

export const globToRegex = (pattern: string): string => {
  return pattern
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&") // Escape special regex chars
    .replace(/\\\*/g, ".*") // Convert * to .*
    .replace(/\\\?/g, "."); // Convert ? to .
};

/**
 * Creates a regular expression from a URL pattern string, supporting wildcards.
 *
 * @param pattern - The URL pattern string, which may include '*' wildcards.
 * @returns A RegExp object that matches URLs according to the given pattern.
 *
 * @example
 * createPatternRegex("*.example.com");
 * Matches: "https://sub.example.com", "http://foo.bar.example.com"
 *
 * createPatternRegex("example.com/path*");
 * Matches: "https://example.com/path", "https://example.com/path/to/resource"
 */
export function createPatternRegex(pattern: string): RegExp {
  // Escape regex special characters except '*'
  let escaped = pattern.replace(/[-/\\^$+?.()|[\]{}]/g, "\\$&");
  // Replace '*' with '.*'
  escaped = escaped.replace(/\*/g, ".*");

  // Build the final regex string
  let regexStr = "^(https?:\\/\\/)?";
  if (pattern.startsWith("*.")) {
    // Wildcard subdomain
    regexStr += "([\\w-]+\\.)+" + escaped.slice(2);
  } else {
    regexStr += escaped;
  }

  // Determine if pattern allows paths
  if (pattern.endsWith("/*") || pattern.endsWith("*")) {
    regexStr += "(\\/.*)?$";
  } else {
    regexStr += "\\/?$"; // Only allow optional trailing slash, not paths
  }

  return new RegExp(regexStr, "i");
}
