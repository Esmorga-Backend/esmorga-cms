export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const apiClient = async (endpoint: string, options?: RequestInit): Promise<Response> => {
  const { headers, ...restOptions } = options || {};

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...restOptions,
  });

  return response;
};
