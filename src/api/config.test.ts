import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { apiClient, API_BASE_URL } from "./config";

describe("Config - unit test", () => {
  const mockFetch = vi.fn();

  describe("apiClient", () => {
    beforeEach(() => {
      globalThis.fetch = mockFetch;
      mockFetch.mockClear();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("calls fetch with correct URL", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
      } as Response);

      await apiClient("/v1/test");

      expect(mockFetch).toHaveBeenCalledWith(`${API_BASE_URL}/v1/test`, expect.any(Object));
    });

    it("adds default Content-Type header", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
      } as Response);

      await apiClient("/v1/test");

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: {
            "Content-Type": "application/json",
          },
        })
      );
    });

    it("mix custom headers with defaults", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
      } as Response);

      await apiClient("/v1/test", {
        headers: {
          Authorization: "Bearer token123",
        },
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer token123",
          },
        })
      );
    });

    it("passes other options to fetch", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
      } as Response);

      await apiClient("/v1/test", {
        method: "POST",
        body: JSON.stringify({ data: "test" }),
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ data: "test" }),
        })
      );
    });

    it("returns fetch response", async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: async () => ({ success: true }),
      } as Response;

      mockFetch.mockResolvedValue(mockResponse);

      const response = await apiClient("/v1/test");

      expect(response).toBe(mockResponse);
    });
  });
});
