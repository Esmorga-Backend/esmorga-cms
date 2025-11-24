export const EMAIL_MAX_LENGTH = 100;
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 50;

export const validateEmail = (value: string): string | undefined => {
  const trimmed = value.trim();

  if (!trimmed) return "Campo requerido";
  if (trimmed.length > EMAIL_MAX_LENGTH) return "Email incorrecto";
  if (trimmed.includes(" ") || trimmed.includes("+")) return "Email incorrecto";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) return "Email incorrecto";

  return undefined;
};

export const validatePassword = (value: string): string | undefined => {
  if (!value) return "Campo requerido";

  if (value.length < PASSWORD_MIN_LENGTH || value.length > PASSWORD_MAX_LENGTH)
    return "Contraseña incorrecta";

  const hasLetter = /[A-Za-z]/.test(value);
  const hasDigit = /\d/.test(value);
  const hasSymbol = /[^A-Za-z0-9]/.test(value);

  if (!hasLetter || !hasDigit || !hasSymbol) return "Contraseña incorrecta";

  return undefined;
};
