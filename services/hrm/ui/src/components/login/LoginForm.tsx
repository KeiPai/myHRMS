import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, KeyRound, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { TextField, Button, CheckboxInput, Alert, AlertDescription } from '@venizia/ardor-ui-kit';
import { requestPasswordResetApi, ApiUnavailableError } from '@/utils/auth-api';

const REQUIRED_DOMAIN = '@nexpando.com';

const translations = {
  en: {
    tagline: 'Growing Together',
    emailPlaceholder: 'Company email',
    passwordPlaceholder: 'Password',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot password?',
    signIn: 'Sign in',
    signingIn: 'Signing in...',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    // Validation
    invalidDomain: 'Only @nexpando.com email addresses are allowed.',
    invalidCredentials: 'Invalid email or password. Please try again.',
    // Forgot password
    resetPassword: 'Reset Password',
    resetDescription: 'Enter your company email and we\'ll send you a link to reset your password.',
    resetEmailPlaceholder: 'Company email',
    sendResetLink: 'Send reset link',
    sending: 'Sending...',
    backToLogin: 'Back to sign in',
    resetSuccess: 'Reset link sent!',
    resetSuccessMessage: 'If this email is registered, you\'ll receive a password reset link shortly. Please check your inbox.',
    resetInvalidDomain: 'Only @nexpando.com email addresses are accepted.',
    resetEmailNotFound: 'This email is not registered in our system.',
    serviceUnavailable: 'Service temporarily unavailable. Please try again later.',
  },
  vi: {
    tagline: 'Cùng Nhau Phát Triển',
    emailPlaceholder: 'Email công ty',
    passwordPlaceholder: 'Mật khẩu',
    rememberMe: 'Ghi nhớ đăng nhập',
    forgotPassword: 'Quên mật khẩu?',
    signIn: 'Đăng nhập',
    signingIn: 'Đang đăng nhập...',
    privacyPolicy: 'Chính sách bảo mật',
    termsOfService: 'Điều khoản dịch vụ',
    // Validation
    invalidDomain: 'Chỉ chấp nhận email có đuôi @nexpando.com.',
    invalidCredentials: 'Email hoặc mật khẩu không đúng. Vui lòng thử lại.',
    // Forgot password
    resetPassword: 'Đặt lại mật khẩu',
    resetDescription: 'Nhập email công ty và chúng tôi sẽ gửi liên kết đặt lại mật khẩu cho bạn.',
    resetEmailPlaceholder: 'Email công ty',
    sendResetLink: 'Gửi liên kết đặt lại',
    sending: 'Đang gửi...',
    backToLogin: 'Quay lại đăng nhập',
    resetSuccess: 'Đã gửi liên kết!',
    resetSuccessMessage: 'Nếu email này đã được đăng ký, bạn sẽ nhận được liên kết đặt lại mật khẩu. Vui lòng kiểm tra hộp thư.',
    resetInvalidDomain: 'Chỉ chấp nhận email có đuôi @nexpando.com.',
    resetEmailNotFound: 'Email này chưa được đăng ký trong hệ thống.',
    serviceUnavailable: 'Dịch vụ tạm thời không khả dụng. Vui lòng thử lại sau.',
  },
} as const;

function isNexpandoEmail(email: string): boolean {
  return email.toLowerCase().endsWith(REQUIRED_DOMAIN);
}

interface LoginFormProps {
  onSubmit: (email: string, password: string, remember: boolean) => void;
  isLoading?: boolean;
  error?: string | null;
}

export function LoginForm({ onSubmit, isLoading = false, error }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [lang, setLang] = useState<'en' | 'vi'>('en');
  const [localErrorKey, setLocalErrorKey] = useState<keyof typeof translations.en | null>(null);

  // Forgot password state
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetErrorKey, setResetErrorKey] = useState<keyof typeof translations.en | null>(null);
  const [resetSending, setResetSending] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const t = translations[lang];
  const displayError = localErrorKey
    ? t[localErrorKey]
    : error
      ? (error in t ? t[error as keyof typeof translations.en] : t.invalidCredentials)
      : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalErrorKey(null);

    if (!isNexpandoEmail(email)) {
      setLocalErrorKey('invalidDomain');
      return;
    }

    onSubmit(email, password, remember);
  };

  const handleForgotPassword = () => {
    setResetEmail(email); // pre-fill with login email
    setResetErrorKey(null);
    setResetSent(false);
    setShowForgotPassword(true);
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetErrorKey(null);

    if (!isNexpandoEmail(resetEmail)) {
      setResetErrorKey('resetInvalidDomain');
      return;
    }

    setResetSending(true);
    try {
      await requestPasswordResetApi(resetEmail);
      setResetSent(true);
    } catch (err) {
      if (err instanceof ApiUnavailableError) {
        setResetErrorKey('serviceUnavailable');
      } else {
        setResetErrorKey('resetEmailNotFound');
      }
    } finally {
      setResetSending(false);
    }
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setResetEmail('');
    setResetErrorKey(null);
    setResetSent(false);
  };

  return (
    <div className="w-full max-w-[448px]">
      {/* Login Card */}
      <div className="rounded-2xl bg-white shadow-[0_8px_8.75px_-6px_rgba(0,0,0,0.1),0_20px_21.875px_-5px_rgba(0,0,0,0.1)]">
        {/* Language Toggle */}
        <div className="flex justify-end px-8 pt-8">
          <div className="flex items-center gap-1 rounded-[10px] bg-muted p-0.5">
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                lang === 'en'
                  ? 'bg-white text-foreground shadow-[0_1px_1.75px_-1px_rgba(0,0,0,0.1),0_1px_2.625px_rgba(0,0,0,0.1)]'
                  : 'text-muted-foreground'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLang('vi')}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                lang === 'vi'
                  ? 'bg-white text-foreground shadow-[0_1px_1.75px_-1px_rgba(0,0,0,0.1),0_1px_2.625px_rgba(0,0,0,0.1)]'
                  : 'text-muted-foreground'
              }`}
            >
              VI
            </button>
          </div>
        </div>

        {/* Brand */}
        <div className="pb-4 text-center">
          <h1 className="text-[30px] font-bold leading-[1.2] tracking-[0.4px] text-foreground">
            NEXPANDO
          </h1>
          <p className="mt-1 text-xs font-normal tracking-[0.6px] text-muted-foreground uppercase">
            {t.tagline}
          </p>
        </div>

        {showForgotPassword ? (
          /* ── Forgot Password View ── */
          <div className="px-8 pb-8">
            {resetSent ? (
              /* Success state */
              <div className="flex flex-col items-center gap-4 py-4">
                <CheckCircle2 className="h-12 w-12 text-[#00a63e]" strokeWidth={1.5} />
                <h2 className="text-lg font-semibold text-foreground">{t.resetSuccess}</h2>
                <p className="text-center text-sm leading-5 text-muted-foreground">
                  {t.resetSuccessMessage}
                </p>
                <Button
                  type="button"
                  variant="link"
                  onClick={handleBackToLogin}
                  className="mt-2 gap-1.5 text-[#00a63e] hover:text-[#00a63e]"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {t.backToLogin}
                </Button>
              </div>
            ) : (
              /* Reset form */
              <form onSubmit={handleResetSubmit} className="flex flex-col gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">{t.resetPassword}</h2>
                  <p className="mt-1 text-sm leading-5 text-muted-foreground">{t.resetDescription}</p>
                </div>

                {resetErrorKey && (
                  <Alert variant="destructive">
                    <AlertDescription>{t[resetErrorKey]}</AlertDescription>
                  </Alert>
                )}

                <TextField
                  type="email"
                  placeholder={t.resetEmailPlaceholder}
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  startIcon={<Mail className="h-[18px] w-[18px]" strokeWidth={1.5} />}
                />

                <Button
                  type="submit"
                  disabled={resetSending}
                  className="h-12 w-full bg-[#1ab443] text-white hover:bg-[#15a03b] disabled:opacity-60"
                >
                  {resetSending ? t.sending : t.sendResetLink}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleBackToLogin}
                  className="gap-1.5 text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {t.backToLogin}
                </Button>
              </form>
            )}
          </div>
        ) : (
          /* ── Login Form View ── */
          <form onSubmit={handleSubmit} className="px-8 pb-8">
            <div className="flex flex-col gap-4">
              {displayError && (
                <Alert variant="destructive">
                  <AlertDescription>{displayError}</AlertDescription>
                </Alert>
              )}

              {/* Email Input */}
              <TextField
                type="email"
                placeholder={t.emailPlaceholder}
                value={email}
                onChange={(e) => { setEmail(e.target.value); setLocalErrorKey(null); }}
                required
                startIcon={<Mail className="h-[18px] w-[18px]" strokeWidth={1.5} />}
              />

              {/* Password Input */}
              <TextField
                type={showPassword ? 'text' : 'password'}
                placeholder={t.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                startIcon={<Lock className="h-[18px] w-[18px]" strokeWidth={1.5} />}
                endIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {showPassword
                      ? <EyeOff className="h-[18px] w-[18px]" strokeWidth={1.5} />
                      : <Eye className="h-[18px] w-[18px]" strokeWidth={1.5} />
                    }
                  </button>
                }
              />

              {/* Remember Me + Forgot Password */}
              <div className="flex items-center justify-between">
                <CheckboxInput
                  checked={remember}
                  onCheckedChange={(checked) => setRemember(checked === true)}
                  label={
                    <span className="text-base font-medium leading-6 tracking-[-0.3px] text-muted-foreground">
                      {t.rememberMe}
                    </span>
                  }
                  orientation="horizontal"
                />
                <Button
                  type="button"
                  variant="link"
                  onClick={handleForgotPassword}
                  className="h-auto gap-1 p-0 text-[#00a63e] hover:text-[#00a63e]"
                >
                  <KeyRound className="h-3.5 w-3.5" strokeWidth={1.17} />
                  <span className="text-base leading-6 tracking-[-0.3px]">{t.forgotPassword}</span>
                </Button>
              </div>

              {/* Sign In Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="h-12 w-full bg-[#1ab443] text-white hover:bg-[#15a03b] disabled:opacity-60"
              >
                {isLoading ? t.signingIn : t.signIn}
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Footer */}
      <p className="mt-6 text-center text-sm leading-5 tracking-[-0.15px] text-muted-foreground">
        <a href="#" className="hover:underline">{t.privacyPolicy}</a>
        {' - '}
        <a href="#" className="hover:underline">{t.termsOfService}</a>
      </p>
    </div>
  );
}
