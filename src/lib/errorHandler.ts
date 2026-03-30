/**
 * API Error Class with status code and retry information
 */
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public retriable: boolean = false
  ) {
    super(message);
    this.name = "APIError";
  }
}

/**
 * Network Error Class for connectivity issues
 */
export class NetworkError extends Error {
  constructor(message: string = "Network request failed") {
    super(message);
    this.name = "NetworkError";
  }
}

/**
 * Handle errors from API calls
 * Routes errors to appropriate handlers based on status code
 */
export function handleError(error: unknown): APIError {
  // Convert non-Error objects to Error
  if (!(error instanceof Error)) {
    const message = typeof error === "string" ? error : "An unknown error occurred";
    return new APIError(message, 500, true);
  }

  // Already an APIError
  if (error instanceof APIError) {
    return error;
  }

  // Network/fetch errors
  if (error instanceof TypeError && error.message.includes("fetch")) {
    console.error("Network error:", error);
    return new APIError(
      "Network connection failed. Please check your internet connection.",
      0,
      true
    );
  }

  // Generic error
  console.error("Unhandled error:", error);
  return new APIError(error.message || "An unknown error occurred", 500, true);
}

/**
 * Format error message for user display
 */
export function formatErrorMessage(error: APIError): string {
  switch (error.statusCode) {
    case 0:
      return "Unable to connect to the server. Please check your internet connection.";
    case 400:
      return error.message || "Invalid request. Please check your input.";
    case 401:
      return "Your session has expired. Please log in again.";
    case 403:
      return "You don't have permission to perform this action.";
    case 404:
      return "The requested resource was not found.";
    case 429:
      return "Too many requests. Please wait a moment and try again.";
    case 500:
    case 502:
    case 503:
      return "Server error. Please try again later.";
    case 504:
      return "Server is taking too long to respond. Please try again.";
    default:
      return error.message || "An error occurred. Please try again.";
  }
}

/**
 * Parse fetch response and throw APIError if not ok
 */
export async function handleFetchResponse<T>(
  response: Response
): Promise<T> {
  if (!response.ok) {
    let errorData: { error?: string; message?: string } = {};
    try {
      errorData = await response.json();
    } catch {
      // Response wasn't JSON
    }

    const message = errorData.error || errorData.message || `HTTP ${response.status}`;
    const retriable = response.status >= 500 || response.status === 429;

    throw new APIError(message, response.status, retriable);
  }

  try {
    return await response.json() as T;
  } catch (error) {
    throw new APIError("Failed to parse response", 500, false);
  }
}
