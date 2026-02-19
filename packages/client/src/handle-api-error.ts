import { ResponseError } from "../generated";

/**
 * Processes API errors by extracting the error message from the response.
 * Returns an Error object with the extracted message or the fallback message.
 */
export async function processApiError(
  error: unknown,
  fallbackMessage: string = "An unexpected error occurred",
): Promise<Error> {
  if (error instanceof ResponseError) {
    let message = fallbackMessage;
    try {
      const responseData = await error.response.json();
      if (responseData?.message) {
        message = responseData.message;
      }
    } catch {
      // If parsing fails, use the fallback message
    }
    return new Error(message);
  }

  if (error instanceof Error) {
    return error;
  }

  return new Error(fallbackMessage);
}
