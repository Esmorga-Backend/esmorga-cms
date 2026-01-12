import { describe, it, expect } from "vitest";
import {
  ApiError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
  NetworkError,
  handleApiError,
} from "./errors";
import i18n from "../i18n/config";

describe("Errors - unit test", () => {
  describe("ApiError", () => {
    it("creates error with all properties", () => {
      const error = new ApiError("Test error message", 500, "TEST_CODE");

      expect(error.message).toBe("Test error message");
      expect(error.status).toBe(500);
      expect(error.code).toBe("TEST_CODE");
      expect(error.name).toBe("ApiError");
      expect(error instanceof Error).toBe(true);
    });

    it("creates error without code", () => {
      const error = new ApiError("Test message", 400);

      expect(error.message).toBe("Test message");
      expect(error.status).toBe(400);
      expect(error.code).toBeUndefined();
    });
  });

  describe("UnauthorizedError", () => {
    it("creates error with custom message", () => {
      const error = new UnauthorizedError();

      expect(error.message).toBe("No autorizado");
      expect(error.status).toBe(401);
      expect(error.code).toBe("UNAUTHORIZED");
      expect(error.name).toBe("UnauthorizedError");
      expect(error instanceof ApiError).toBe(true);
    });
  });

  describe("ForbiddenError", () => {
    it("creates error with custom message", () => {
      const error = new ForbiddenError();

      expect(error.message).toBe("Acceso denegado");
      expect(error.status).toBe(403);
      expect(error.code).toBe("FORBIDDEN");
      expect(error.name).toBe("ForbiddenError");
      expect(error instanceof ApiError).toBe(true);
    });
  });

  describe("NotFoundError", () => {
    it("creates error with custom message", () => {
      const error = new NotFoundError();

      expect(error.message).toBe("No encontrado");
      expect(error.status).toBe(404);
      expect(error.code).toBe("NOT_FOUND");
      expect(error.name).toBe("NotFoundError");
      expect(error instanceof ApiError).toBe(true);
    });
  });

  describe("ValidationError", () => {
    it("creates error with custom message", () => {
      const error = new ValidationError();

      expect(error.message).toBe("Datos incorrectos");
      expect(error.status).toBe(422);
      expect(error.code).toBe("VALIDATION_ERROR");
      expect(error.name).toBe("ValidationError");
      expect(error instanceof ApiError).toBe(true);
    });
  });

  describe("NetworkError", () => {
    it("creates error with custom message", () => {
      const error = new NetworkError();

      expect(error.message).toBe("Error de conexión");
      expect(error.status).toBe(0);
      expect(error.code).toBe("NETWORK_ERROR");
      expect(error.name).toBe("NetworkError");
      expect(error instanceof ApiError).toBe(true);
    });
  });
});

describe("handleApiError", () => {
  it("uses default errorMap message", () => {
    const errorMap = {
      400: "Custom bad request error",
      500: "Custom server error",
    };

    expect(() => handleApiError(400, errorMap)).toThrow(ApiError);
    expect(() => handleApiError(400, errorMap)).toThrow("Custom bad request error");

    try {
      handleApiError(500, errorMap);
    } catch (error) {
      expect(error instanceof ApiError).toBe(true);
      expect((error as ApiError).message).toBe("Custom server error");
      expect((error as ApiError).status).toBe(500);
    }
  });

  it("throws UnauthorizedError for 401", () => {
    expect(() => handleApiError(401)).toThrow(UnauthorizedError);
    expect(() => handleApiError(401)).toThrow("No autorizado");
  });

  it("throws ForbiddenError for 403", () => {
    expect(() => handleApiError(403)).toThrow(ForbiddenError);
    expect(() => handleApiError(403)).toThrow("Acceso denegado");
  });

  it("throws NotFoundError for 404", () => {
    expect(() => handleApiError(404)).toThrow(NotFoundError);
    expect(() => handleApiError(404)).toThrow("No encontrado");
  });

  it("throws ValidationError for 422", () => {
    expect(() => handleApiError(422)).toThrow(ValidationError);
    expect(() => handleApiError(422)).toThrow("Datos incorrectos");
  });

  it("throws ApiError for unknown status", () => {
    expect(() => handleApiError(500)).toThrow(ApiError);
    expect(() => handleApiError(500)).toThrow(i18n.t("default_error_request_fail"));

    try {
      handleApiError(502);
    } catch (error) {
      expect(error instanceof ApiError).toBe(true);
      expect((error as ApiError).message).toBe(i18n.t("default_error_request_fail"));
      expect((error as ApiError).status).toBe(502);
    }
  });

  it("throws default errorMap over custom", () => {
    const errorMap = {
      401: "Custom 401 message",
    };

    expect(() => handleApiError(401, errorMap)).toThrow("Custom 401 message");
    expect(() => handleApiError(401, errorMap)).not.toThrow("No autorizado");
  });
});
