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
