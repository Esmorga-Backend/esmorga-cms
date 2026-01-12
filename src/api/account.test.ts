import { describe, it, expect, vi, beforeEach } from "vitest";
import { login } from "./account";
import * as config from "./config";
import { ApiError, NetworkError } from "./errors";
import i18n from "../i18n/config";

vi.mock("./config", () => ({
  apiClient: vi.fn(),
}));

describe("Account - unit test", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Login", () => {
    it("returns LoginResponse when successful", async () => {
      const mockLoginData = {
        accessToken: "test-access-token",
        refreshToken: "test-refresh-token",
        ttl: 3600,
        profile: {
          name: "Jane",
          lastName: "Doe",
          email: "jane@example.com",
          role: "ADMIN",
        },
      };

      const mockResponse = {
        ok: true,
        json: async () => mockLoginData,
      };

      vi.mocked(config.apiClient).mockResolvedValue(mockResponse as Response);

      const result = await login("jane@example.com", "Password123!");
      expect(result).toEqual(mockLoginData);

      expect(config.apiClient).toHaveBeenCalledWith("/v1/account/login", {
        method: "POST",
        body: JSON.stringify({
          email: "jane@example.com",
          password: "Password123!",
        }),
      });
    });

    it("throws 401 error for invalid credentials", async () => {
      const mockResponse = {
        ok: false,
        status: 401,
        json: async () => ({}),
      };

      vi.mocked(config.apiClient).mockResolvedValue(mockResponse as Response);

      await expect(login("wrong@example.com", "WrongPass!")).rejects.toThrow(ApiError);
      await expect(login("wrong@example.com", "WrongPass!")).rejects.toThrow(
        i18n.t("inline_error_invalid_login_credentials")
      );
    });

    it("throws 403 error for unverified user", async () => {
      const mockResponse = {
        ok: false,
        status: 403,
        json: async () => ({}),
      };

      vi.mocked(config.apiClient).mockResolvedValue(mockResponse as Response);

      await expect(login("unverified@example.com", "Password123!")).rejects.toThrow(ApiError);
      await expect(login("unverified@example.com", "Password123!")).rejects.toThrow(
        i18n.t("inline_error_unverified_user")
      );
    });

    it("throws 423 error for blocked user", async () => {
      const mockResponse = {
        ok: false,
        status: 423,
        json: async () => ({}),
      };

      vi.mocked(config.apiClient).mockResolvedValue(mockResponse as Response);

      await expect(login("blocked@example.com", "Password123!")).rejects.toThrow(ApiError);
      await expect(login("blocked@example.com", "Password123!")).rejects.toThrow(
        i18n.t("inline_error_blocked_user")
      );
    });

    it("throws default error", async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        json: async () => ({}),
      };

      vi.mocked(config.apiClient).mockResolvedValue(mockResponse as Response);

      await expect(login("test@example.com", "Password123!")).rejects.toThrow(ApiError);
      await expect(login("test@example.com", "Password123!")).rejects.toThrow(
        i18n.t("default_error_request_fail")
      );
    });

    it("throws 401 error when user role is not ADMIN", async () => {
      const mockLoginData = {
        accessToken: "test-access-token",
        refreshToken: "test-refresh-token",
        ttl: 3600,
        profile: {
          name: "John",
          lastName: "User",
          email: "user@example.com",
          role: "USER",
        },
      };

      const mockResponse = {
        ok: true,
        json: async () => mockLoginData,
      };

      vi.mocked(config.apiClient).mockResolvedValue(mockResponse as Response);

      await expect(login("user@example.com", "Password123!")).rejects.toThrow(ApiError);
      await expect(login("user@example.com", "Password123!")).rejects.toThrow(
        i18n.t("inline_error_invalid_login_credentials")
      );
    });

    it("throws NetworkError", async () => {
      vi.mocked(config.apiClient).mockRejectedValue(new TypeError("Network failure"));

      await expect(login("test@example.com", "Password123!")).rejects.toThrow(NetworkError);
      await expect(login("test@example.com", "Password123!")).rejects.toThrow(
        i18n.t("default_error_request_fail")
      );
    });
  });
});
