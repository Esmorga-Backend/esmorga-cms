import i18n from "../i18n/config";

export const EMAIL_MAX_LENGTH = 100;
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 50;

export const validateEmail = (value: string): string | undefined => {
  const trimmed = value.trim();

  if (!trimmed) return i18n.t("inline_error_empty_field");
  if (trimmed.length > EMAIL_MAX_LENGTH) return i18n.t("inline_error_email");
  if (trimmed.includes(" ") || trimmed.includes("+")) return i18n.t("inline_error_email");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(trimmed)) return i18n.t("inline_error_email");

  return undefined;
};

export const validatePassword = (value: string): string | undefined => {
  if (!value) return i18n.t("inline_error_empty_field");

  if (value.length < PASSWORD_MIN_LENGTH || value.length > PASSWORD_MAX_LENGTH)
    return i18n.t("inline_error_password");

  const hasLetter = /[A-Za-z]/.test(value);
  const hasDigit = /\d/.test(value);
  const hasSymbol = /[^A-Za-z0-9]/.test(value);

  if (!hasLetter || !hasDigit || !hasSymbol) return i18n.t("inline_error_password");

  return undefined;
};
