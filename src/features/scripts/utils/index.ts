export interface ScriptValidationResult {
  valid: boolean;
  error: string | null;
}

/**
 * Validates the syntax of a given script code string.
 *
 * @param code - The script code to validate.
 * @returns An object containing the validation result:
 * - `valid`: `true` if the code is syntactically correct, `false` otherwise.
 * - `error`: The error message if validation fails, or `null` if validation succeeds.
 */
export function validateScript(code: string): ScriptValidationResult {
  try {
    new Function(code); // Basic syntax check
    return { valid: true, error: null };
  } catch (error) {
    return { valid: false, error: (error as Error).message };
  }
}

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
