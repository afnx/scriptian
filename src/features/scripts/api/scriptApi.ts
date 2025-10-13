/**
 * Fetches and returns the contents of a script from a given URL.
 * @param url - The URL of the script to import.
 * @returns The script code as a string.
 * @throws If the fetch fails or the URL is invalid.
 */
export async function importScript(url: string): Promise<string> {
  if (!url || typeof url !== "string") {
    throw new TypeError("A valid URL string must be provided.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(
        `Failed to import script: ${response.status} ${response.statusText}`
      );
    }
    return await response.text();
  } catch (error) {
    throw new Error(`Error importing script: ${(error as Error).message}`);
  } finally {
    clearTimeout(timeout);
  }
}
