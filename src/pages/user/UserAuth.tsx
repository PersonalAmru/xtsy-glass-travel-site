/**
 * User Authentication Page - Supabase Auth
 * Email/Password signin only with OTP-based password recovery
 */

import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  ArrowRight, 
  Loader2, 
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import xtsyFavicon from '@/assets/xtsy-favicon.png';

type AuthView = 'signin' | 'signup' | 'forgot' | 'reset-sent' | 'success';

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
    resetPassword,
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
  
  // Get redirect path from state or default to home
  const redirectPath = (location.state as any)?.from || '/';

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
    } catch {
      // Error handled by context
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    
    if (!email) {
      setLocalError('Please enter your email address.');
      return;
    }
    
    try {
      await resetPassword(email);
      setView('reset-sent');
    } catch {
      // Error handled by context
    }
  };

  const handleBack = () => {
    if (view === 'forgot' || view === 'signup') {
      setView('signin');
    } else if (view === 'reset-sent') {
      setView('signin');
    } else {
      navigate(-1);
    }
  };

  const displayError = localError || error;

  // Show loading while initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30 flex flex-col items-center justify-center">
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        
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
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30 flex flex-col">
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      
      {/* Header */}
      <header className="relative z-10 px-4 sm:px-6 pt-4 sm:pt-6">
        <div className="max-w-md mx-auto flex items-center justify-between">
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
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-6 py-8 relative z-10">
        <div className="max-w-md mx-auto">
          <AnimatePresence mode="wait">
            {view === 'success' ? (
              <SuccessView key="success" />
            ) : view === 'reset-sent' ? (
              <ResetSentView 
                key="reset-sent" 
                email={email} 
                onBack={() => setView('signin')} 
              />
            ) : view === 'forgot' ? (
              <ForgotPasswordView
                key="forgot"
                email={email}
                setEmail={setEmail}
                onSubmit={handlePasswordReset}
                isLoading={isLoading}
                error={displayError}
                onBack={() => setView('signin')}
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
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-4 sm:px-6 py-6 text-center">
        <p className="text-xs text-muted-foreground">
          By continuing, you agree to our{' '}
          <Link to="/terms" className="underline hover:text-foreground transition-colors">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="underline hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
        </p>
      </footer>
    </div>
  );
}

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
      <h2 className="text-2xl font-semibold text-foreground mb-2">
        Welcome back!
      </h2>
      <p className="text-muted-foreground">
        Redirecting you now...
      </p>
    </motion.div>
  );
}

// Reset Sent View
function ResetSentView({ email, onBack }: { email: string; onBack: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center py-12"
    >
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
        <Mail className="w-8 h-8 text-primary" />
      </div>
      <h2 className="text-2xl font-semibold text-foreground mb-2">
        Check your email
      </h2>
      <p className="text-muted-foreground mb-2">
        We've sent a password reset link to
      </p>
      <p className="font-medium text-foreground mb-8">{email}</p>
      <Button variant="outline" onClick={onBack} className="gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back to Sign In
      </Button>
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

function ForgotPasswordView({
  email,
  setEmail,
  onSubmit,
  isLoading,
  error,
  onBack
}: ForgotPasswordViewProps) {
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
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Reset Password
        </h1>
        <p className="text-muted-foreground">
          Enter your email and we'll send you a reset link
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="reset-email" className="text-sm font-medium">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="reset-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-11 h-12 rounded-xl bg-muted/50 border-muted-foreground/20 focus:border-primary focus:ring-primary"
              autoComplete="email"
              autoFocus
            />
          </div>
        </div>

        {error && <ErrorMessage message={error} />}

        <Button 
          type="submit" 
          className="w-full h-12 rounded-xl text-base font-medium gap-2"
          disabled={isLoading || !email}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Send Reset Link
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </Button>

        <Button 
          type="button"
          variant="ghost" 
          onClick={onBack}
          className="w-full"
        >
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
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  onSubmit,
  isLoading,
  error,
  onForgotPassword,
  onSwitchToSignUp
}: SignInViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/25 overflow-hidden">
          <img src={xtsyFavicon} alt="XTSY" className="w-10 h-10 object-contain" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Welcome back
        </h1>
        <p className="text-muted-foreground">
          Sign in to continue your journey
        </p>
      </div>

      {/* Email Form */}
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-11 h-12 rounded-xl bg-muted/50 border-muted-foreground/20 focus:border-primary focus:ring-primary"
              autoComplete="email"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-11 pr-11 h-12 rounded-xl bg-muted/50 border-muted-foreground/20 focus:border-primary focus:ring-primary"
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

      {/* Switch to Sign Up */}
      <p className="text-center mt-8 text-muted-foreground">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToSignUp}
          className="text-primary font-medium hover:text-primary/80 transition-colors"
        >
          Create one
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
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  onSubmit,
  isLoading,
  error,
  onSwitchToSignIn
}: SignUpViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/25 overflow-hidden">
          <img src={xtsyFavicon} alt="XTSY" className="w-10 h-10 object-contain" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Create Account
        </h1>
        <p className="text-muted-foreground">
          Start your adventure with XTSY
        </p>
      </div>

      {/* Email Form */}
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="signup-email" className="text-sm font-medium">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="signup-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-11 h-12 rounded-xl bg-muted/50 border-muted-foreground/20 focus:border-primary focus:ring-primary"
              autoComplete="email"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-password" className="text-sm font-medium">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-11 pr-11 h-12 rounded-xl bg-muted/50 border-muted-foreground/20 focus:border-primary focus:ring-primary"
              autoComplete="new-password"
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

        <div className="space-y-2">
          <Label htmlFor="confirm-password" className="text-sm font-medium">
            Confirm Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-11 pr-11 h-12 rounded-xl bg-muted/50 border-muted-foreground/20 focus:border-primary focus:ring-primary"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
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
              Create Account
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </Button>
      </form>

      {/* Switch to Sign In */}
      <p className="text-center mt-8 text-muted-foreground">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToSignIn}
          className="text-primary font-medium hover:text-primary/80 transition-colors"
        >
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
