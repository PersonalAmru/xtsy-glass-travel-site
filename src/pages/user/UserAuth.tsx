/**
 * User Authentication Page - Supabase Auth
 * Glassmorphic two-column layout with hero image + testimonials
 * Email/Password signin only with OTP-based password recovery (2-min expiry)
 */

import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from '@/lib/router-compat';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator
} from '@/components/ui/input-otp';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  ArrowRight, 
  Loader2, 
  ArrowLeft,
  CheckCircle2,
  Timer,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import xtsyFavicon from '@/assets/xtsy-favicon.png';
import { SignInLayout, OrDivider, type Testimonial } from '@/components/ui/sign-in';

type AuthView = 'signin' | 'signup' | 'signup-success' | 'forgot' | 'otp-verify' | 'new-password' | 'reset-success' | 'success';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80';

const TESTIMONIALS: Testimonial[] = [
  {
    avatarSrc: 'https://randomuser.me/api/portraits/women/57.jpg',
    name: 'Priya Sharma',
    handle: '@priya_travels',
    text: 'XTSY made our Meghalaya trip unforgettable. Seamless booking and amazing local experiences!',
  },
  {
    avatarSrc: 'https://randomuser.me/api/portraits/men/64.jpg',
    name: 'Rahul Mehta',
    handle: '@rahul.adventure',
    text: 'The best platform for Northeast India stays. Clean, reliable, and genuinely helpful.',
  },
  {
    avatarSrc: 'https://randomuser.me/api/portraits/men/32.jpg',
    name: 'Arjun Das',
    handle: '@arjun.explores',
    text: 'From Shillong to Tawang — XTSY helped us plan the perfect road trip with trusted homestays.',
  },
];

export default function UserAuth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    user, 
    isLoading, 
    isInitialized,
    error, 
    signInEmail, 
    signUpEmail,
    clearError 
  } = useUserAuth();

  const [view, setView] = useState<AuthView>('signin');
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  
  // OTP state
  const [otp, setOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  // Get redirect path from state, ?next= (validated same-origin relative), or default to home
  const nextParam = new URLSearchParams(location.search).get('next');
  const safeNext =
    nextParam && nextParam.startsWith('/') && !nextParam.startsWith('//')
      ? nextParam
      : null;
  const redirectPath = safeNext || (location.state as any)?.from || '/';

  // Countdown timer for OTP expiry
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // Redirect if already authenticated
  useEffect(() => {
    if (user && isInitialized) {
      setView('success');
      const timer = setTimeout(() => {
        navigate(redirectPath, { replace: true });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [user, isInitialized, navigate, redirectPath]);

  // Clear errors when switching views
  useEffect(() => {
    clearError();
    setLocalError(null);
  }, [view, clearError]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    
    if (!email) {
      setLocalError('Please enter your email address.');
      return;
    }
    
    if (!password) {
      setLocalError('Please enter your password.');
      return;
    }
    
    try {
      await signInEmail(email, password);
    } catch {
      // Error handled by context
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    
    if (!email || !password || !confirmPassword) {
      setLocalError('Please fill in all fields.');
      return;
    }
    
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }
    
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      return;
    }
    
    try {
      await signUpEmail(email, password);
      if (!user) {
        setView('signup-success');
      }
    } catch {
      // Error handled by context
    }
  };

  // Request OTP for password reset
  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setOtpLoading(true);
    
    if (!email) {
      setLocalError('Please enter your email address.');
      setOtpLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase.functions.invoke('password-reset-otp', {
        body: { action: 'request', email: email.trim().toLowerCase() }
      });
      
      if (error) throw error;
      
      if (data?.success) {
        setCountdown(120);
        setView('otp-verify');
      } else {
        setLocalError(data?.error || 'Failed to send OTP');
      }
    } catch (err: any) {
      console.error('OTP request error:', err);
      setLocalError('Failed to send OTP. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  // Verify OTP and proceed to new password
  const handleVerifyOTP = async () => {
    setLocalError(null);
    setOtpLoading(true);
    
    if (otp.length !== 6) {
      setLocalError('Please enter the complete 6-digit OTP.');
      setOtpLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase.functions.invoke('password-reset-otp', {
        body: { action: 'verify', email: email.trim().toLowerCase(), otp }
      });
      
      if (error) throw error;
      
      if (data?.success && data?.verified) {
        setView('new-password');
      } else {
        setLocalError(data?.error || 'Invalid or expired OTP');
        setOtp('');
      }
    } catch (err: any) {
      console.error('OTP verify error:', err);
      setLocalError('Verification failed. Please try again.');
      setOtp('');
    } finally {
      setOtpLoading(false);
    }
  };

  // Reset password with OTP
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setOtpLoading(true);
    
    if (!newPassword) {
      setLocalError('Please enter a new password.');
      setOtpLoading(false);
      return;
    }
    
    if (newPassword.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      setOtpLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase.functions.invoke('password-reset-otp', {
        body: { 
          action: 'reset', 
          email: email.trim().toLowerCase(), 
          otp, 
          newPassword 
        }
      });
      
      if (error) throw error;
      
      if (data?.success) {
        setView('reset-success');
      } else {
        setLocalError(data?.error || 'Failed to reset password');
      }
    } catch (err: any) {
      console.error('Password reset error:', err);
      setLocalError('Failed to reset password. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (countdown > 0) return;
    await handleRequestOTP({ preventDefault: () => {} } as React.FormEvent);
  };

  const handleBack = () => {
    if (view === 'forgot' || view === 'signup') {
      setView('signin');
    } else if (view === 'signup-success') {
      setView('signin');
    } else if (view === 'otp-verify' || view === 'new-password') {
      setView('forgot');
      setOtp('');
    } else if (view === 'reset-success') {
      setView('signin');
    } else {
      navigate(-1);
    }
  };

  const displayError = localError || error;

  // Show loading while initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-lg shadow-primary/20 overflow-hidden">
            <img src={xtsyFavicon} alt="XTSY" className="w-12 h-12 object-contain" />
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <p className="text-sm text-muted-foreground">Preparing your experience...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <SignInLayout heroImageSrc={HERO_IMAGE} testimonials={TESTIMONIALS}>
      {/* Back button + XTSY branding */}
      <div className="flex items-center justify-between mb-8">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleBack}
          className="rounded-full hover:bg-muted/80"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <Link to="/" className="text-xl font-bold text-primary">
          XTSY
        </Link>
        <div className="w-10" />
      </div>

      {/* Animated views */}
      <AnimatePresence mode="wait">
        {view === 'success' ? (
          <SuccessView key="success" />
        ) : view === 'reset-success' ? (
          <ResetSuccessView key="reset-success" onContinue={() => setView('signin')} />
        ) : view === 'new-password' ? (
          <NewPasswordView
            key="new-password"
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            showNewPassword={showNewPassword}
            setShowNewPassword={setShowNewPassword}
            onSubmit={handleResetPassword}
            isLoading={otpLoading}
            error={displayError}
          />
        ) : view === 'otp-verify' ? (
          <OTPVerifyView
            key="otp-verify"
            email={email}
            otp={otp}
            setOtp={setOtp}
            countdown={countdown}
            onVerify={handleVerifyOTP}
            onResend={handleResendOTP}
            isLoading={otpLoading}
            error={displayError}
          />
        ) : view === 'forgot' ? (
          <ForgotPasswordView
            key="forgot"
            email={email}
            setEmail={setEmail}
            onSubmit={handleRequestOTP}
            isLoading={otpLoading}
            error={displayError}
            onBack={() => setView('signin')}
          />
        ) : view === 'signup-success' ? (
          <SignUpSuccessView 
            key="signup-success" 
            email={email}
            onContinue={() => setView('signin')} 
          />
        ) : view === 'signup' ? (
          <SignUpView
            key="signup"
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
            onSubmit={handleEmailSignUp}
            isLoading={isLoading}
            error={displayError}
            onSwitchToSignIn={() => setView('signin')}
          />
        ) : (
          <SignInView
            key="signin"
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            onSubmit={handleEmailSignIn}
            isLoading={isLoading}
            error={displayError}
            onForgotPassword={() => setView('forgot')}
            onSwitchToSignUp={() => setView('signup')}
          />
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-border/30 text-center">
        <p className="text-xs text-muted-foreground">
          By continuing, you agree to our{' '}
          <Link to="/terms-of-service" className="underline hover:text-foreground transition-colors">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="underline hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
        </p>
      </div>
    </SignInLayout>
  );
}

// ============================================================
// SUB-VIEWS
// ============================================================

// Success View
function SuccessView() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="text-center py-16"
    >
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
        className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6"
      >
        <CheckCircle2 className="w-10 h-10 text-green-500" />
      </motion.div>
      <h2 className="text-2xl font-semibold text-foreground mb-2">Welcome back!</h2>
      <p className="text-muted-foreground">Redirecting you now...</p>
    </motion.div>
  );
}

// Reset Success View
function ResetSuccessView({ onContinue }: { onContinue: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="text-center py-12"
    >
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
        className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6"
      >
        <CheckCircle2 className="w-10 h-10 text-green-500" />
      </motion.div>
      <h2 className="text-2xl font-semibold text-foreground mb-2">Password Reset!</h2>
      <p className="text-muted-foreground mb-8">Your password has been updated successfully.</p>
      <Button onClick={onContinue} className="gap-2">
        Sign In Now
        <ArrowRight className="w-4 h-4" />
      </Button>
    </motion.div>
  );
}

// Sign Up Success View
function SignUpSuccessView({ email, onContinue }: { email: string; onContinue: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="text-center py-12"
    >
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
        className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6"
      >
        <Mail className="w-10 h-10 text-primary" />
      </motion.div>
      <h2 className="text-2xl font-semibold text-foreground mb-2">Check Your Email</h2>
      <p className="text-muted-foreground mb-2">We've sent a confirmation link to:</p>
      <p className="text-foreground font-medium mb-6">{email}</p>
      <p className="text-sm text-muted-foreground mb-8">
        Click the link in the email to activate your account, then come back here to sign in.
      </p>
      <Button onClick={onContinue} className="gap-2">
        Back to Sign In
        <ArrowRight className="w-4 h-4" />
      </Button>
    </motion.div>
  );
}

// OTP Verify View
interface OTPVerifyViewProps {
  email: string;
  otp: string;
  setOtp: (value: string) => void;
  countdown: number;
  onVerify: () => void;
  onResend: () => void;
  isLoading: boolean;
  error: string | null;
}

function OTPVerifyView({ email, otp, setOtp, countdown, onVerify, onResend, isLoading, error }: OTPVerifyViewProps) {
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <div className="text-center mb-8">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mx-auto mb-6"
        >
          <Timer className="w-10 h-10 text-primary" />
        </motion.div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Enter OTP</h1>
        <p className="text-muted-foreground text-sm">We've sent a 6-digit code to</p>
        <p className="font-medium text-foreground">{email}</p>
      </div>

      <div className="space-y-6">
        <div className="flex justify-center">
          <InputOTP maxLength={6} value={otp} onChange={setOtp} disabled={isLoading}>
            <InputOTPGroup>
              <InputOTPSlot index={0} className="w-12 h-14 text-xl" />
              <InputOTPSlot index={1} className="w-12 h-14 text-xl" />
              <InputOTPSlot index={2} className="w-12 h-14 text-xl" />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} className="w-12 h-14 text-xl" />
              <InputOTPSlot index={4} className="w-12 h-14 text-xl" />
              <InputOTPSlot index={5} className="w-12 h-14 text-xl" />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <div className="text-center">
          {countdown > 0 ? (
            <div className="flex items-center justify-center gap-2 text-primary">
              <Timer className="w-4 h-4" />
              <span className="font-mono text-lg font-semibold">{formatTime(countdown)}</span>
            </div>
          ) : (
            <p className="text-destructive text-sm">OTP expired</p>
          )}
        </div>

        {error && <ErrorMessage message={error} />}

        <Button 
          onClick={onVerify}
          className="w-full h-12 rounded-xl text-base font-medium gap-2"
          disabled={isLoading || otp.length !== 6 || countdown <= 0}
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Verify OTP <ArrowRight className="w-5 h-5" /></>}
        </Button>

        <Button type="button" variant="ghost" onClick={onResend} disabled={countdown > 0 || isLoading} className="w-full gap-2">
          <RefreshCw className="w-4 h-4" />
          Resend OTP
        </Button>
      </div>
    </motion.div>
  );
}

// New Password View
interface NewPasswordViewProps {
  newPassword: string;
  setNewPassword: (value: string) => void;
  showNewPassword: boolean;
  setShowNewPassword: (value: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  error: string | null;
}

function NewPasswordView({ newPassword, setNewPassword, showNewPassword, setShowNewPassword, onSubmit, isLoading, error }: NewPasswordViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Lock className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Set New Password</h1>
        <p className="text-muted-foreground">Enter your new password below</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="new-password" className="text-sm font-medium">New Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="new-password"
              type={showNewPassword ? 'text' : 'password'}
              placeholder="At least 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="pl-11 pr-11 h-12 rounded-xl bg-muted/50 border-border/30 focus:border-primary focus:ring-primary"
              autoComplete="new-password"
              autoFocus
            />
            <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
              {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {error && <ErrorMessage message={error} />}

        <Button type="submit" className="w-full h-12 rounded-xl text-base font-medium gap-2" disabled={isLoading || !newPassword || newPassword.length < 6}>
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Reset Password <ArrowRight className="w-5 h-5" /></>}
        </Button>
      </form>
    </motion.div>
  );
}

// Forgot Password View
interface ForgotPasswordViewProps {
  email: string;
  setEmail: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  error: string | null;
  onBack: () => void;
}

function ForgotPasswordView({ email, setEmail, onSubmit, isLoading, error, onBack }: ForgotPasswordViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Lock className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Reset Password</h1>
        <p className="text-muted-foreground">Enter your email to receive a 6-digit OTP</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="reset-email" className="text-sm font-medium">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="reset-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-11 h-12 rounded-xl bg-muted/50 border-border/30 focus:border-primary focus:ring-primary"
              autoComplete="email"
              autoFocus
            />
          </div>
        </div>

        {error && <ErrorMessage message={error} />}

        <Button type="submit" className="w-full h-12 rounded-xl text-base font-medium gap-2" disabled={isLoading || !email}>
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Send OTP <ArrowRight className="w-5 h-5" /></>}
        </Button>

        <Button type="button" variant="ghost" onClick={onBack} className="w-full">
          Back to Sign In
        </Button>
      </form>
    </motion.div>
  );
}

// Sign In View
interface SignInViewProps {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  error: string | null;
  onForgotPassword: () => void;
  onSwitchToSignUp: () => void;
}

function SignInView({
  email, setEmail, password, setPassword, showPassword, setShowPassword,
  onSubmit, isLoading, error, onForgotPassword, onSwitchToSignUp
}: SignInViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* Header */}
      <div className="mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-6 shadow-lg shadow-primary/20 overflow-hidden">
          <img src={xtsyFavicon} alt="XTSY" className="w-9 h-9 object-contain" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Welcome back
        </h1>
        <p className="text-muted-foreground">
          Access your account and continue your journey with us
        </p>
      </div>

      {/* Email Form */}
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-11 h-12 rounded-xl bg-muted/50 border-border/30 focus:border-primary focus:ring-primary"
              autoComplete="email"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-11 pr-11 h-12 rounded-xl bg-muted/50 border-border/30 focus:border-primary focus:ring-primary"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Remember me + Reset password */}
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
            <input type="checkbox" name="remember" className="rounded border-border/50 bg-muted/50 text-primary focus:ring-primary/30 w-4 h-4" />
            Keep me signed in
          </label>
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-primary hover:text-primary/80 transition-colors"
          >
            Reset password
          </button>
        </div>

        {error && <ErrorMessage message={error} />}

        <Button 
          type="submit" 
          className="w-full h-12 rounded-xl text-base font-medium gap-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Sign In
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </Button>
      </form>

      {/* Or divider */}
      <OrDivider />

      {/* Switch to Sign Up */}
      <p className="text-center text-muted-foreground text-sm">
        New to XTSY?{' '}
        <button
          type="button"
          onClick={onSwitchToSignUp}
          className="text-primary font-medium hover:text-primary/80 transition-colors"
        >
          Create Account
        </button>
      </p>
    </motion.div>
  );
}

// Sign Up View
interface SignUpViewProps {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (value: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  error: string | null;
  onSwitchToSignIn: () => void;
}

function SignUpView({
  email, setEmail, password, setPassword, confirmPassword, setConfirmPassword,
  showPassword, setShowPassword, showConfirmPassword, setShowConfirmPassword,
  onSubmit, isLoading, error, onSwitchToSignIn
}: SignUpViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* Header */}
      <div className="mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-6 shadow-lg shadow-primary/20 overflow-hidden">
          <img src={xtsyFavicon} alt="XTSY" className="w-9 h-9 object-contain" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Create Account
        </h1>
        <p className="text-muted-foreground">
          Start your adventure with XTSY
        </p>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="signup-email" className="text-sm font-medium">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="signup-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-11 h-12 rounded-xl bg-muted/50 border-border/30 focus:border-primary focus:ring-primary"
              autoComplete="email"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-password" className="text-sm font-medium">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-11 pr-11 h-12 rounded-xl bg-muted/50 border-border/30 focus:border-primary focus:ring-primary"
              autoComplete="new-password"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password" className="text-sm font-medium">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-11 pr-11 h-12 rounded-xl bg-muted/50 border-border/30 focus:border-primary focus:ring-primary"
              autoComplete="new-password"
            />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {error && <ErrorMessage message={error} />}

        <Button type="submit" className="w-full h-12 rounded-xl text-base font-medium gap-2" disabled={isLoading}>
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Create Account <ArrowRight className="w-5 h-5" /></>}
        </Button>
      </form>

      <OrDivider />

      <p className="text-center text-muted-foreground text-sm">
        Already have an account?{' '}
        <button type="button" onClick={onSwitchToSignIn} className="text-primary font-medium hover:text-primary/80 transition-colors">
          Sign in
        </button>
      </p>
    </motion.div>
  );
}

// Error Message Component
function ErrorMessage({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-2"
    >
      <div className="w-5 h-5 rounded-full bg-destructive/20 flex items-center justify-center shrink-0 mt-0.5">
        <span className="text-xs font-bold">!</span>
      </div>
      <span>{message}</span>
    </motion.div>
  );
}
