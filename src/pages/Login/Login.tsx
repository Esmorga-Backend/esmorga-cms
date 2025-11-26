import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./Login.module.css";
import paths from "../../routers/paths";
import Loader from "../../components/Loader";
import {
  validateEmail,
  validatePassword,
  EMAIL_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
} from "../../validations/loginValidations";
import { login } from "../../api/account";
import { ApiError } from "../../api/errors";

type FieldErrors = {
  email?: string;
  password?: string;
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailBlur = () => {
    setFieldErrors((prev) => ({
      ...prev,
      email: validateEmail(email),
    }));
  };

  const handlePasswordBlur = () => {
    setFieldErrors((prev) => ({
      ...prev,
      password: validatePassword(password),
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    setFieldErrors({ email: emailError, password: passwordError });
    setSubmitError(undefined);

    if (emailError || passwordError) return;

    try {
      setIsSubmitting(true);

      await login(email.trim(), password);
      navigate(paths.management);
    } catch (error) {
      if (error instanceof ApiError) {
        setSubmitError(error.message);
      } else {
        setSubmitError(t("default_error_request_fail"));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordInlineError = fieldErrors.password || submitError;

  return (
    <div className={styles.screen}>
      <main className={styles.card}>
        <div className={styles.logoContainer} aria-hidden="true">
          <img src="/esmorga_icon.svg" alt="Esmorga Logo" className={styles.logo} />
        </div>

        <h1 className={styles.title}>{t("screen_login_title")}</h1>

        <form
          className={styles.form}
          onSubmit={handleSubmit}
          noValidate
          aria-label="Formulario de inicio de sesión"
        >
          <div className={styles.fieldGroup}>
            <label htmlFor="email" className={styles.label}>
              {t("field_title_email")}
            </label>
            <input
              type="email"
              id="email"
              placeholder={t("placeholder_email")}
              className={styles.input}
              value={email}
              maxLength={EMAIL_MAX_LENGTH}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={handleEmailBlur}
              autoComplete="email"
              aria-invalid={!!fieldErrors.email}
              aria-describedby={fieldErrors.email ? "email-error" : undefined}
            />
            <span id="email-error" className={styles.error}>
              {fieldErrors.email || "\u00A0"}
            </span>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="password" className={styles.label}>
              {t("field_title_password")}
            </label>

            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder={t("placeholder_password")}
                value={password}
                minLength={PASSWORD_MIN_LENGTH}
                maxLength={PASSWORD_MAX_LENGTH}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={handlePasswordBlur}
                autoComplete="current-password"
                aria-invalid={!!passwordInlineError}
                aria-describedby={passwordInlineError ? "password-error" : undefined}
              />

              <button
                type="button"
                className={styles.eyeButton}
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? t("hide_password") : t("show_password")}
                aria-pressed={showPassword}
              >
                <img
                  src={showPassword ? "/eye-off.svg" : "/eye.svg"}
                  className={styles.eyeIcon}
                  alt=""
                  aria-hidden="true"
                />
              </button>
            </div>

            <span id="password-error" className={styles.error}>
              {passwordInlineError || "\u00A0"}
            </span>
          </div>

          <button
            type="submit"
            className={`${styles.button} ${styles.submitButton}`}
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? <Loader size={20} color="#fff" /> : t("button_login")}
          </button>
        </form>
      </main>
    </div>
  );
};

export default Login;
