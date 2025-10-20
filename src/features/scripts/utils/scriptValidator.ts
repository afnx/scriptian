export interface ValidationResult {
  valid: boolean;
  error?: string;
  warnings?: string[];
}

const DANGEROUS_PATTERNS = [
  /eval\s*\(/gi,
  /Function\s*\(/gi,
  /setTimeout\s*\(\s*['"`][^'"`]*['"`]/gi,
  /setInterval\s*\(\s*['"`][^'"`]*['"`]/gi,
  /document\.write/gi,
  /innerHTML\s*=/gi,
  /outerHTML\s*=/gi,
  /\.src\s*=/gi,
  /window\.location/gi,
  /document\.location/gi,
  /XMLHttpRequest/gi,
  /fetch\s*\(/gi,
];

const BLOCKED_GLOBALS = [
  "eval",
  "Function",
  "WebAssembly",
  "importScripts",
  "Worker",
  "SharedWorker",
  "ServiceWorker",
];

/**
 * Validates a script code string for safety, syntax, and length.
 *
 * @param code - The script code to validate.
 * @returns A {@link ValidationResult} object containing the validation status,
 *          error message if invalid, and any warnings about unsafe patterns.
 */
export function validateScript(code: string): ValidationResult {
  if (!code || !code.trim()) {
    return {
      valid: false,
      error: "Script code cannot be empty",
    };
  }

  const trimmedCode = code.trim();
  const warnings: string[] = [];

  // Check for dangerous patterns
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(trimmedCode)) {
      warnings.push(`Potentially unsafe pattern detected: ${pattern.source}`);
    }
  }

  // Check for blocked globals
  for (const globalVar of BLOCKED_GLOBALS) {
    const regex = new RegExp(`\\b${globalVar}\\b`, "gi");
    if (regex.test(trimmedCode)) {
      return {
        valid: false,
        error: `Blocked global variable or function: ${globalVar}`,
      };
    }
  }

  // Basic syntax validation
  try {
    // Try to parse as function body
    new Function(trimmedCode);
  } catch (syntaxError) {
    return {
      valid: false,
      error: `Syntax error: ${(syntaxError as Error).message}`,
    };
  }

  // Check script length
  if (trimmedCode.length > 50000) {
    return {
      valid: false,
      error: "Script is too large (maximum 50KB allowed)",
    };
  }

  return {
    valid: true,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

/**
 * Sanitizes a script by trimming whitespace and removing comments.
 *
 * @param code - The script code to sanitize.
 * @returns The sanitized script code with comments removed and whitespace trimmed.
 */
export function sanitizeScript(code: string): string {
  let sanitized = code.trim();

  // Remove potentially harmful patterns
  sanitized = sanitized.replace(/\/\*[\s\S]*?\*\//g, ""); // Remove block comments
  sanitized = sanitized.replace(/\/\/.*$/gm, ""); // Remove line comments

  return sanitized;
}

/**
 * Analyzes the complexity of a given script by counting lines, functions, loops, and conditionals.
 *
 * @param code - The source code to analyze as a string.
 * @returns An object containing the number of lines, functions, loops, and conditionals in the code.
 */
export function analyzeScriptComplexity(code: string): {
  lines: number;
  functions: number;
  loops: number;
  conditionals: number;
} {
  const lines = code.split("\n").length;
  const functions = (code.match(/function\s+\w+/g) || []).length;
  const loops = (code.match(/\b(for|while|do)\s*\(/g) || []).length;
  const conditionals = (code.match(/\b(if|else|switch)\s*\(/g) || []).length;

  return { lines, functions, loops, conditionals };
}
