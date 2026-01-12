import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import Login from "./Login";
import * as accountApi from "../../api/account";
import { ApiError } from "../../api/errors";
import translations from "../../i18n/translations/es.json";

const t = (key: keyof typeof translations) => translations[key];

const renderLogin = () => {
  return render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
};

describe("Login", () => {
  beforeEach(() => {
    renderLogin();
  });

  it("Login Screen - Content", () => {
    expect(screen.getByAltText("Esmorga Logo")).toBeInTheDocument();
    expect(screen.getByText(t("screen_login_title"))).toBeInTheDocument();
    expect(screen.getByLabelText(t("field_title_email"))).toBeInTheDocument();
    expect(screen.getByLabelText(t("field_title_password"))).toBeInTheDocument();
    expect(screen.getByRole("button", { name: t("button_login") })).toBeInTheDocument();
  });

  it("Login Screen - Blocked Button", async () => {
    const user = userEvent.setup();

    let resolveLogin: (value: accountApi.LoginResponse) => void;
    const loginPromise = new Promise<accountApi.LoginResponse>((resolve) => {
      resolveLogin = resolve;
    });
    vi.spyOn(accountApi, "login").mockReturnValue(loginPromise);

    const emailInput = screen.getByLabelText(t("field_title_email"));
    await user.type(emailInput, "test@example.com");

    const passwordInput = screen.getByLabelText(t("field_title_password"));
    await user.type(passwordInput, "Password123!");

    const loginButton = screen.getByRole("button", { name: t("button_login") });

    await act(async () => {
      await user.click(loginButton);
    });

    expect(accountApi.login).toHaveBeenCalledWith("test@example.com", "Password123!");

    await waitFor(() => {
      expect(loginButton).toBeDisabled();
    });

    await act(async () => {
      resolveLogin!({
        accessToken: "token",
        refreshToken: "refresh",
        ttl: 3600,
        profile: {
          name: "Test",
          lastName: "User",
          email: "test@example.com",
          role: "ADMIN",
        },
      });
    });
  });

  it.each([
    { password: "aa", description: "min chars" },
    {
      password: "a".repeat(51),
      description: "max chars",
    },
    { password: "a".repeat(15), description: "no one digit, one letter and one symbol" },
    { password: "", description: "empty cell" },
  ])(
    "Login screen - Password invalid format validation - $description",
    async ({ password, description }) => {
      const user = userEvent.setup();

      const emailInput = screen.getByLabelText(t("field_title_email"));
      await user.type(emailInput, "test@example.com");

      const passwordInput = screen.getByLabelText(t("field_title_password"));
      if (password) {
        await user.type(passwordInput, password);
      } else {
        await user.click(passwordInput);
      }
      await user.tab();

      const errorMessage =
        description === "empty cell" ? t("inline_error_empty_field") : t("inline_error_password");

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    }
  );

  it.each([
    {
      email: `${"a".repeat(101)}@example.com`,
      description: "max chars",
    },
    { email: "space@domain .com", description: "spaces" },
    { email: "invalidemail", description: "no domain" },
    { email: "user+alias@domain.com", description: "invalid character" },
    { email: "", description: "empty cell" },
    { email: "invalid@domain,com", description: "invalid domain" },
    { email: "invalid@domain.c", description: "invalid domain" },
    { email: "invalid@dom", description: "invalid domain" },
  ])(
    "Login screen - Email invalid format validation - $description",
    async ({ email, description }) => {
      const user = userEvent.setup();

      const emailInput = screen.getByLabelText(t("field_title_email"));
      if (email) {
        await user.type(emailInput, email);
      }
      await user.click(emailInput);
      await user.tab();

      const errorMessage =
        description === "empty cell" ? t("inline_error_empty_field") : t("inline_error_email");

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    }
  );

  it("Login screen - Error 403: Invalid user", async () => {
    const user = userEvent.setup();

    vi.spyOn(accountApi, "login").mockRejectedValue(
      new ApiError(t("inline_error_unverified_user"), 403)
    );

    const emailInput = screen.getByLabelText(t("field_title_email"));
    await user.type(emailInput, "test@example.com");

    const passwordInput = screen.getByLabelText(t("field_title_password"));
    await user.type(passwordInput, "Password123!");

    const loginButton = screen.getByRole("button", { name: t("button_login") });
    await user.click(loginButton);

    expect(accountApi.login).toHaveBeenCalledWith("test@example.com", "Password123!");

    await waitFor(() => {
      expect(screen.getByText(t("inline_error_unverified_user"))).toBeInTheDocument();
    });
  });

  it("Login screen - Error 401: Invalid credentials", async () => {
    const user = userEvent.setup();

    vi.spyOn(accountApi, "login").mockRejectedValue(
      new ApiError(t("inline_error_invalid_login_credentials"), 401)
    );

    const emailInput = screen.getByLabelText(t("field_title_email"));
    await user.type(emailInput, "wrong@example.com");

    const passwordInput = screen.getByLabelText(t("field_title_password"));
    await user.type(passwordInput, "WrongPass1!");

    const loginButton = screen.getByRole("button", { name: t("button_login") });
    await user.click(loginButton);

    expect(accountApi.login).toHaveBeenCalledWith("wrong@example.com", "WrongPass1!");

    await waitFor(() => {
      expect(screen.getByText(t("inline_error_invalid_login_credentials"))).toBeInTheDocument();
    });
  });

  it("Login Screen - Error 423: Blocked user", async () => {
    const user = userEvent.setup();

    vi.spyOn(accountApi, "login").mockRejectedValue(
      new ApiError(t("inline_error_blocked_user"), 423)
    );

    const emailInput = screen.getByLabelText(t("field_title_email"));
    await user.type(emailInput, "blocked@example.com");

    const passwordInput = screen.getByLabelText(t("field_title_password"));
    await user.type(passwordInput, "Password123!");

    const loginButton = screen.getByRole("button", { name: t("button_login") });
    await user.click(loginButton);

    expect(accountApi.login).toHaveBeenCalledWith("blocked@example.com", "Password123!");

    await waitFor(() => {
      expect(screen.getByText(t("inline_error_blocked_user"))).toBeInTheDocument();
    });
  });

  it("Login Screen - Generic error", async () => {
    const user = userEvent.setup();

    vi.spyOn(accountApi, "login").mockRejectedValue(new Error("Network error"));

    const emailInput = screen.getByLabelText(t("field_title_email"));
    await user.type(emailInput, "test@example.com");

    const passwordInput = screen.getByLabelText(t("field_title_password"));
    await user.type(passwordInput, "Password123!");

    const loginButton = screen.getByRole("button", { name: t("button_login") });
    await user.click(loginButton);

    expect(accountApi.login).toHaveBeenCalledWith("test@example.com", "Password123!");

    await waitFor(() => {
      expect(screen.getByText(t("default_error_request_fail"))).toBeInTheDocument();
    });
  });

  it("Login Screen - Error 401: No permissions to access", async () => {
    const user = userEvent.setup();

    vi.spyOn(accountApi, "login").mockRejectedValue(
      new ApiError(t("inline_error_invalid_login_credentials"), 401)
    );

    const emailInput = screen.getByLabelText(t("field_title_email"));
    await user.type(emailInput, "user@example.com");

    const passwordInput = screen.getByLabelText(t("field_title_password"));
    await user.type(passwordInput, "Password123!");

    const loginButton = screen.getByRole("button", { name: t("button_login") });
    await user.click(loginButton);

    expect(accountApi.login).toHaveBeenCalledWith("user@example.com", "Password123!");

    await waitFor(() => {
      expect(screen.getByText(t("inline_error_invalid_login_credentials"))).toBeInTheDocument();
    });
  });
});
