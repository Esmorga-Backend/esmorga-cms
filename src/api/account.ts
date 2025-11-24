import i18n from "../i18n/config";
import { apiClient } from "./config";
import { handleApiError, NetworkError } from "./errors";

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  ttl: number;
  profile: {
    name: string;
    lastName: string;
    email: string;
    role: string;
  };
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await apiClient("/v1/account/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const errorMap = {
      401: i18n.t("inline_error_invalid_login_credentials"),
      403: i18n.t("inline_error_unverified_user"),
      423: i18n.t("inline_error_blocked_user"),
    };

    if (!response.ok) {
      handleApiError(response.status, errorMap);
    }

    const data: LoginResponse = await response.json();

    if (data.profile.role !== "ADMIN") {
      handleApiError(401, errorMap);
    }

    return data;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new NetworkError();
    }
    throw error;
  }
};
