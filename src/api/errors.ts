export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = "No autorizado") {
    super(message, 401, "UNAUTHORIZED");
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = "Acceso denegado") {
    super(message, 403, "FORBIDDEN");
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends ApiError {
  constructor(message = "No encontrado") {
    super(message, 404, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}

export class ValidationError extends ApiError {
  constructor(message = "Datos incorrectos") {
    super(message, 422, "VALIDATION_ERROR");
    this.name = "ValidationError";
  }
}

export class NetworkError extends ApiError {
  constructor(message = "Error de conexión") {
    super(message, 0, "NETWORK_ERROR");
    this.name = "NetworkError";
  }
}

export type ErrorMap = Record<number, string>;

import i18n from "../i18n/config";

/**
 * Handles HTTP errors with custom mapping per endpoint
 * @param status - HTTP status code
 * @param defaultErrorMap - Default error mapping for this specific endpoint
 */
export const handleApiError = (status: number, defaultErrorMap?: ErrorMap): never => {
  if (defaultErrorMap && defaultErrorMap[status]) {
    throw new ApiError(defaultErrorMap[status], status);
  }

  switch (status) {
    case 401:
      throw new UnauthorizedError();
    case 403:
      throw new ForbiddenError();
    case 404:
      throw new NotFoundError();
    case 422:
      throw new ValidationError();
    default:
      throw new ApiError(i18n.t("default_error_request_fail"), status);
  }
};
