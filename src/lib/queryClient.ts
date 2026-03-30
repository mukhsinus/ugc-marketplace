// src/lib/queryClient.ts
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered fresh for 30 seconds
      staleTime: 1000 * 30,

      // Don't refetch on window focus
      refetchOnWindowFocus: false,

      // Retry failed requests 3 times with exponential backoff
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors (except 429 rate limit)
        if (error?.statusCode >= 400 && error?.statusCode < 500 && error?.statusCode !== 429) {
          return false;
        }
        // Retry up to 3 times for server errors and rate limits
        return failureCount < 3;
      },

      // Exponential backoff: 1s, 2s, 4s
      retryDelay: (attemptIndex) => {
        return Math.min(1000 * Math.pow(2, attemptIndex), 30000);
      },

      // Timeout after 30 seconds
      networkMode: "online"
    },

    mutations: {
      // Retry mutations 1 time for retriable errors
      retry: (failureCount, error: any) => {
        if (error?.retriable && failureCount < 1) {
          return true;
        }
        return false;
      },

      // Exponential backoff for mutations
      retryDelay: (attemptIndex) => {
        return Math.min(1000 * Math.pow(2, attemptIndex), 10000);
      }
    }
  }
});