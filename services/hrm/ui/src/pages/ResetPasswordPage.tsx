import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle2, ArrowLeft, XCircle } from 'lucide-react';
import { TextField, Button, Alert, AlertDescription } from '@venizia/ardor-ui-kit';
import { confirmPasswordResetApi, ApiUnavailableError } from '@/utils/auth-api';

const translations = {
  en: {
    title: 'Set New Password',
    description: 'Enter your new password below.',
    newPassword: 'New password',
    confirmPassword: 'Confirm password',
    submit: 'Reset password',
    submitting: 'Resetting...',
    backToLogin: 'Back to sign in',
    successTitle: 'Password reset!',
    successMessage: 'Your password has been reset successfully. You can now sign in with your new password.',
    signIn: 'Sign in',
    // Validation
    passwordMinLength: 'Password must be at least 8 characters.',
    passwordsNoMatch: 'Passwords do not match.',
    // Errors
    invalidToken: 'Invalid or expired reset link. Please request a new one.',
    missingToken: 'No reset token found. Please use the link from your email.',
    serviceUnavailable: 'Service temporarily unavailable. Please try again later.',
  },
  vi: {
    title: 'Đặt mật khẩu mới',
    description: 'Nhập mật khẩu mới của bạn bên dưới.',
    newPassword: 'Mật khẩu mới',
    confirmPassword: 'Xác nhận mật khẩu',
    submit: 'Đặt lại mật khẩu',
    submitting: 'Đang đặt lại...',
    backToLogin: 'Quay lại đăng nhập',
    successTitle: 'Đã đặt lại mật khẩu!',
    successMessage: 'Mật khẩu của bạn đã được đặt lại thành công. Bây giờ bạn có thể đăng nhập với mật khẩu mới.',
    signIn: 'Đăng nhập',
    // Validation
    passwordMinLength: 'Mật khẩu phải có ít nhất 8 ký tự.',
    passwordsNoMatch: 'Mật khẩu không khớp.',
    // Errors
    invalidToken: 'Liên kết đặt lại không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu liên kết mới.',
    missingToken: 'Không tìm thấy mã đặt lại. Vui lòng sử dụng liên kết từ email của bạn.',
    serviceUnavailable: 'Dịch vụ tạm thời không khả dụng. Vui lòng thử lại sau.',
  },
} as const;

const PasswordToggle = ({ show, onToggle }: { show: boolean; onToggle: () => void }) => (
  <button
    type="button"
    onClick={onToggle}
    className="text-muted-foreground hover:text-foreground"
  >
    {show
      ? <EyeOff className="h-[18px] w-[18px]" strokeWidth={1.5} />
      : <Eye className="h-[18px] w-[18px]" strokeWidth={1.5} />
    }
  </button>
);

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorKey, setErrorKey] = useState<keyof typeof translations.en | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [lang, setLang] = useState<'en' | 'vi'>('en');

  const t = translations[lang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorKey(null);

    if (!token) {
      setErrorKey('missingToken');
      return;
    }

    if (newPassword.length < 8) {
      setErrorKey('passwordMinLength');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorKey('passwordsNoMatch');
      return;
    }

    setIsSubmitting(true);
    try {
      await confirmPasswordResetApi(token, newPassword);
      setSuccess(true);
    } catch (err) {
      if (err instanceof ApiUnavailableError) {
        setErrorKey('serviceUnavailable');
      } else {
        setErrorKey('invalidToken');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted px-4">
      <div className="w-full max-w-[448px]">
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
          </div>

          <div className="px-8 pb-8">
            {!token ? (
              /* Missing token state */
              <div className="flex flex-col items-center gap-4 py-4">
                <XCircle className="h-12 w-12 text-destructive" strokeWidth={1.5} />
                <p className="text-center text-sm leading-5 text-muted-foreground">
                  {t.missingToken}
                </p>
                <Button
                  type="button"
                  variant="link"
                  onClick={() => navigate('/login')}
                  className="mt-2 gap-1.5 text-[#00a63e] hover:text-[#00a63e]"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {t.backToLogin}
                </Button>
              </div>
            ) : success ? (
              /* Success state */
              <div className="flex flex-col items-center gap-4 py-4">
                <CheckCircle2 className="h-12 w-12 text-[#00a63e]" strokeWidth={1.5} />
                <h2 className="text-lg font-semibold text-foreground">{t.successTitle}</h2>
                <p className="text-center text-sm leading-5 text-muted-foreground">
                  {t.successMessage}
                </p>
                <Button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="mt-2 h-12 w-full bg-[#1ab443] text-white hover:bg-[#15a03b]"
                >
                  {t.signIn}
                </Button>
              </div>
            ) : (
              /* Reset form */
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">{t.title}</h2>
                  <p className="mt-1 text-sm leading-5 text-muted-foreground">{t.description}</p>
                </div>

                {errorKey && (
                  <Alert variant="destructive">
                    <AlertDescription>{t[errorKey]}</AlertDescription>
                  </Alert>
                )}

                <TextField
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder={t.newPassword}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  startIcon={<Lock className="h-[18px] w-[18px]" strokeWidth={1.5} />}
                  endIcon={
                    <PasswordToggle
                      show={showNewPassword}
                      onToggle={() => setShowNewPassword(!showNewPassword)}
                    />
                  }
                />

                <TextField
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder={t.confirmPassword}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  startIcon={<Lock className="h-[18px] w-[18px]" strokeWidth={1.5} />}
                  endIcon={
                    <PasswordToggle
                      show={showConfirmPassword}
                      onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                    />
                  }
                />

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-12 w-full bg-[#1ab443] text-white hover:bg-[#15a03b] disabled:opacity-60"
                >
                  {isSubmitting ? t.submitting : t.submit}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigate('/login')}
                  className="gap-1.5 text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {t.backToLogin}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
