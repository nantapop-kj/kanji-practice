import { useState, type FormEvent } from "react";
import { useLocation, useNavigate, type Location } from "react-router-dom";
import { PasswordInput } from "@/components/PasswordInput";
import { Spinner } from "@/components/Spinner";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n, type TKey } from "@/i18n";
import { authErrorMessage } from "@/lib/auth-error";
import { Paths } from "@/routes/paths";
import "./LoginPage.css";

const EmailRegex = /^[^\s@]+@([^\s@.]+\.)+[^\s@.]{2,}$/;
const PasswordRegex = /^(?=.*[A-Za-z])(?=.*\d)[\x20-\x7E]{8,72}$/;
const NameMaxLength = 255;

type Mode = "login" | "register";
type FieldErrors = Partial<Record<"email" | "name" | "password" | "confirmPassword", TKey>>;

export const LoginPage = () => {
  const { t } = useI18n();
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = (): FieldErrors => {
    const errors: FieldErrors = {};

    if (!email) errors.email = "emailRequired";
    else if (!EmailRegex.test(email.trim())) errors.email = "emailInvalid";

    if (mode === "register" && !name.trim()) errors.name = "nameRequired";

    if (!password) errors.password = "passwordRequired";
    else if (mode === "register" && !PasswordRegex.test(password)) {
      errors.password = "passwordInvalid";
    }

    if (mode === "register") {
      if (!confirmPassword) errors.confirmPassword = "confirmPasswordRequired";
      else if (confirmPassword !== password) {
        errors.confirmPassword = "passwordMismatch";
      }
    }

    return errors;
  };

  const fieldErrors = validate();
  const visibleErrors = submitted ? fieldErrors : {};

  const handleClearState = () => {
    setEmail("");
    setName("");
    setPassword("");
    setConfirmPassword("");
    setError("");
    setSubmitted(false);
  };

  const handleToggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
    handleClearState();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setError("");

    if (Object.keys(fieldErrors).length > 0) return;
    
    setLoading(true);
    try {
      if (mode === "login") await login({ email: email.trim(), password });
      else await register({ email: email.trim(), name: name.trim(), password });

      const from = (location.state as { from?: Location } | null)?.from;
      navigate(from ? from.pathname + from.search : Paths.quiz, { replace: true });
    } catch (err) {
      setError(authErrorMessage(err, t));
      setLoading(false);
    }
  };

  return (
    <div className="card login">
      <div className="login-kanji" lang="ja">
        学
      </div>
      <h2>{mode === "login" ? t("login") : t("register")}</h2>
      <p className="hint">{t("loginHint")}</p>
      <form className="form" onSubmit={handleSubmit} noValidate>
        <div>
          <input
            type="email"
            placeholder={t("email")}
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={Boolean(visibleErrors.email)}
            required
          />
          {visibleErrors.email ? (
            <div className="msg ng">{t(visibleErrors.email)}</div>
          ) : (
            mode === "register" && (
              <div className="login-rule">{t("emailRule")}</div>
            )
          )}
        </div>
        {mode === "register" && (
          <div>
            <input
              placeholder={t("displayName")}
              autoComplete="name"
              maxLength={NameMaxLength}
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={Boolean(visibleErrors.name)}
              required
            />
            {visibleErrors.name && (
              <div className="msg ng">{t(visibleErrors.name)}</div>
            )}
          </div>
        )}
        <div>
          <PasswordInput
            placeholder={t("passwordPh")}
            autoComplete={
              mode === "login" ? "current-password" : "new-password"
            }
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={Boolean(visibleErrors.password)}
            required
          />
          {visibleErrors.password ? (
            <div className="msg ng">{t(visibleErrors.password)}</div>
          ) : (
            mode === "register" && (
              <div className="login-rule">{t("passwordRule")}</div>
            )
          )}
        </div>
        {mode === "register" && (
          <div>
            <PasswordInput
              placeholder={t("confirmPasswordPh")}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              aria-invalid={Boolean(visibleErrors.confirmPassword)}
              required
            />
            {visibleErrors.confirmPassword ? (
              <div className="msg ng">{t(visibleErrors.confirmPassword)}</div>
            ) : (
              <div className="login-rule">{t("confirmPasswordRule")}</div>
            )}
          </div>
        )}
        {error && <div className="msg ng">{error}</div>}
        <button className="btn" disabled={loading}>
          {loading ? (
            <>
              <Spinner />
              {t("processing")}
            </>
          ) : mode === "login" ? (
            t("login")
          ) : (
            t("registerAndStart")
          )}
        </button>
      </form>
      <div className="center" style={{ marginTop: 14 }}>
        <button className="link" onClick={handleToggleMode} disabled={loading}>
          {mode === "login" ? t("noAccount") : t("haveAccount")}
        </button>
      </div>
    </div>
  );
};
