import { useState, type ChangeEvent, type FormEvent, type JSX } from 'react';
import { useLocation, useNavigate, type Location, type NavigateFunction } from 'react-router-dom';
import { PasswordInput, Spinner } from '@/components';
import { useAuth, useI18n } from '@/contexts';
import { AuthMode } from '@/enums';
import { apiErrorMessage } from '@/lib';
import { Paths } from '@/routes/paths';
import type { LoginFieldErrors, LoginLocationState } from '@/types';
import './LoginPage.css';

const EmailRegex = /^[^\s@]+@([^\s@.]+\.)+[^\s@.]{2,}$/;
const PasswordRegex = /^(?=.*[A-Za-z])(?=.*\d)[\x20-\x7E]{8,72}$/;
const NameMaxLength = 255;

export const LoginPage = (): JSX.Element => {
    const { t } = useI18n();
    const { login, register } = useAuth();
    const navigate: NavigateFunction = useNavigate();
    const location: Location = useLocation();
    const [mode, setMode] = useState<AuthMode>(AuthMode.Login);
    const [email, setEmail] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const isRegister: boolean = mode === AuthMode.Register;

    const validate = (): LoginFieldErrors => {
        const errors: LoginFieldErrors = {};

        if (!email) errors.email = 'emailRequired';
        else if (!EmailRegex.test(email.trim())) errors.email = 'emailInvalid';

        if (isRegister && !name.trim()) errors.name = 'nameRequired';

        if (!password) errors.password = 'passwordRequired';
        else if (isRegister && !PasswordRegex.test(password)) {
            errors.password = 'passwordInvalid';
        }

        if (isRegister) {
            if (!confirmPassword) errors.confirmPassword = 'confirmPasswordRequired';
            else if (confirmPassword !== password) {
                errors.confirmPassword = 'passwordMismatch';
            }
        }

        return errors;
    };

    const fieldErrors: LoginFieldErrors = validate();
    const visibleErrors: LoginFieldErrors = submitted ? fieldErrors : {};

    const handleClearState = (): void => {
        setEmail('');
        setName('');
        setPassword('');
        setConfirmPassword('');
        setError('');
        setSubmitted(false);
    };

    const handleToggleMode = (): void => {
        setMode(isRegister ? AuthMode.Login : AuthMode.Register);
        handleClearState();
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setSubmitted(true);
        setError('');

        if (Object.keys(fieldErrors).length > 0) return;

        setLoading(true);
        try {
            if (isRegister) await register({ email: email.trim(), name: name.trim(), password });
            else await login({ email: email.trim(), password });

            const from: Location | undefined = (location.state as LoginLocationState | null)?.from;
            navigate(from ? from.pathname + from.search : Paths.quiz, { replace: true });
        } catch (err) {
            setError(apiErrorMessage(err, t));
            setLoading(false);
        }
    };

    return (
        <div className="card login">
            <div className="login-kanji" lang="ja">
                学
            </div>
            <h2>{isRegister ? t('register') : t('login')}</h2>
            <p className="hint">{t('loginHint')}</p>
            <form className="form" onSubmit={(e: FormEvent<HTMLFormElement>): void => void handleSubmit(e)} noValidate>
                <div>
                    <input
                        type="email"
                        placeholder={t('email')}
                        autoComplete="email"
                        value={email}
                        onChange={(e: ChangeEvent<HTMLInputElement>): void => setEmail(e.target.value)}
                        aria-invalid={Boolean(visibleErrors.email)}
                        required
                    />
                    {visibleErrors.email ? (
                        <div className="msg ng">{t(visibleErrors.email)}</div>
                    ) : (
                        isRegister && <div className="login-rule">{t('emailRule')}</div>
                    )}
                </div>
                {isRegister && (
                    <div>
                        <input
                            placeholder={t('displayName')}
                            autoComplete="name"
                            maxLength={NameMaxLength}
                            value={name}
                            onChange={(e: ChangeEvent<HTMLInputElement>): void => setName(e.target.value)}
                            aria-invalid={Boolean(visibleErrors.name)}
                            required
                        />
                        {visibleErrors.name && <div className="msg ng">{t(visibleErrors.name)}</div>}
                    </div>
                )}
                <div>
                    <PasswordInput
                        placeholder={t('passwordPh')}
                        autoComplete={isRegister ? 'new-password' : 'current-password'}
                        value={password}
                        onChange={(e: ChangeEvent<HTMLInputElement>): void => setPassword(e.target.value)}
                        aria-invalid={Boolean(visibleErrors.password)}
                        required
                    />
                    {visibleErrors.password ? (
                        <div className="msg ng">{t(visibleErrors.password)}</div>
                    ) : (
                        isRegister && <div className="login-rule">{t('passwordRule')}</div>
                    )}
                </div>
                {isRegister && (
                    <div>
                        <PasswordInput
                            placeholder={t('confirmPasswordPh')}
                            autoComplete="new-password"
                            value={confirmPassword}
                            onChange={(e: ChangeEvent<HTMLInputElement>): void => setConfirmPassword(e.target.value)}
                            aria-invalid={Boolean(visibleErrors.confirmPassword)}
                            required
                        />
                        {visibleErrors.confirmPassword ? (
                            <div className="msg ng">{t(visibleErrors.confirmPassword)}</div>
                        ) : (
                            <div className="login-rule">{t('confirmPasswordRule')}</div>
                        )}
                    </div>
                )}
                {error && <div className="msg ng">{error}</div>}
                <button className="btn" disabled={loading}>
                    {loading ? (
                        <>
                            <Spinner />
                            {t('processing')}
                        </>
                    ) : isRegister ? (
                        t('registerAndStart')
                    ) : (
                        t('login')
                    )}
                </button>
            </form>
            <div className="center" style={{ marginTop: 14 }}>
                <button className="link" onClick={handleToggleMode} disabled={loading}>
                    {isRegister ? t('haveAccount') : t('noAccount')}
                </button>
            </div>
        </div>
    );
};
