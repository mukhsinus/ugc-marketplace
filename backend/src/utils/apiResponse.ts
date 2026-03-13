// backend/src/utils/apiResponse.ts
export function success(data: any) {
  return {
    data,
    error: null
  };
}

export function failure(message: string) {
  return {
    data: null,
    error: message
  };
}