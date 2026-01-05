/**
 * User Authentication Page
 * Phone OTP (primary) and Email (secondary) login for guests
 * Apple-grade calm UI with clear feedback
 */

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Phone, 
  Mail, 
  ArrowRight, 
  Loader2, 
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

type AuthStep = 'input' | 'otp' | 'success';
type AuthMethod = 'phone' | 'email';

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
    sendOTP, 
    verifyOTP,
    clearError 
  } = useUserAuth();

  const [authMethod, setAuthMethod] = useState<AuthMethod>('phone');
  const [step, setStep] = useState<AuthStep>('input');
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Phone auth state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  
  // Email auth state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Get redirect path from state or default to home
  const redirectPath = (location.state as any)?.from || '/';

  // Redirect if already authenticated
  useEffect(() => {
    if (user && isInitialized) {
      setStep('success');
      const timer = setTimeout(() => {
        navigate(redirectPath, { replace: true });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [user, isInitialized, navigate, redirectPath]);

  // Clear error when switching methods or steps
  useEffect(() => {
    clearError();
  }, [authMethod, step, clearError]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) return;
    
    try {
      await sendOTP(phoneNumber, 'recaptcha-container');
      setStep('otp');
    } catch {
      // Error handled by context
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) return;
    
    try {
      await verifyOTP(otpCode);
    } catch {
      // Error handled by context
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSignUp && password !== confirmPassword) {
      return;
    }
    
    try {
      if (isSignUp) {
        await signUpEmail(email, password);
      } else {
        await signInEmail(email, password);
      }
    } catch {
      // Error handled by context
    }
  };

  const handleBack = () => {
    if (step === 'otp') {
      setStep('input');
      setOtpCode('');
    } else {
      navigate(-1);
    }
  };

  // Show loading while initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="px-4 py-3 flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleBack}
            className="shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              {step === 'success' ? 'Welcome!' : isSignUp ? 'Create Account' : 'Sign In'}
            </h1>
            <p className="text-xs text-muted-foreground">
              {step === 'success' 
                ? 'Redirecting you...' 
                : 'Continue to complete your booking'
              }
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-8">
        <div className="max-w-md mx-auto">
          <AnimatePresence mode="wait">
            {step === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  You're signed in!
                </h2>
                <p className="text-muted-foreground">
                  Taking you back to complete your booking...
                </p>
              </motion.div>
            ) : step === 'otp' ? (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <OTPVerificationForm
                  phoneNumber={phoneNumber}
                  otpCode={otpCode}
                  setOtpCode={setOtpCode}
                  onSubmit={handleVerifyOTP}
                  isLoading={isLoading}
                  error={error}
                  onResend={() => sendOTP(phoneNumber, 'recaptcha-container')}
                />
              </motion.div>
            ) : (
              <motion.div
                key="input"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Tabs 
                  value={authMethod} 
                  onValueChange={(v) => setAuthMethod(v as AuthMethod)}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="phone" className="gap-2">
                      <Phone className="w-4 h-4" />
                      Phone
                    </TabsTrigger>
                    <TabsTrigger value="email" className="gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="phone">
                    <PhoneInputForm
                      phoneNumber={phoneNumber}
                      setPhoneNumber={setPhoneNumber}
                      onSubmit={handleSendOTP}
                      isLoading={isLoading}
                      error={error}
                    />
                  </TabsContent>

                  <TabsContent value="email">
                    <EmailAuthForm
                      email={email}
                      setEmail={setEmail}
                      password={password}
                      setPassword={setPassword}
                      confirmPassword={confirmPassword}
                      setConfirmPassword={setConfirmPassword}
                      isSignUp={isSignUp}
                      setIsSignUp={setIsSignUp}
                      onSubmit={handleEmailAuth}
                      isLoading={isLoading}
                      error={error}
                    />
                  </TabsContent>
                </Tabs>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* reCAPTCHA container - invisible */}
      <div id="recaptcha-container" />
    </div>
  );
}

// Phone Input Form Component
interface PhoneInputFormProps {
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  error: string | null;
}

function PhoneInputForm({ 
  phoneNumber, 
  setPhoneNumber, 
  onSubmit, 
  isLoading, 
  error 
}: PhoneInputFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <div className="flex gap-2">
          <div className="flex items-center px-3 bg-muted rounded-md border border-border">
            <span className="text-sm text-muted-foreground">+91</span>
          </div>
          <Input
            id="phone"
            type="tel"
            placeholder="98765 43210"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
            className="flex-1"
            autoComplete="tel"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          We'll send you a 6-digit code to verify
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      <Button 
        type="submit" 
        className="w-full gap-2"
        disabled={isLoading || phoneNumber.length < 10}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            Continue
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </Button>
    </form>
  );
}

// OTP Verification Form Component
interface OTPVerificationFormProps {
  phoneNumber: string;
  otpCode: string;
  setOtpCode: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  error: string | null;
  onResend: () => void;
}

function OTPVerificationForm({ 
  phoneNumber, 
  otpCode, 
  setOtpCode, 
  onSubmit, 
  isLoading, 
  error,
  onResend
}: OTPVerificationFormProps) {
  const [resendTimer, setResendTimer] = useState(30);
  
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleResend = () => {
    setResendTimer(30);
    onResend();
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <p className="text-muted-foreground">
          Enter the 6-digit code sent to
        </p>
        <p className="font-medium text-foreground">+91 {phoneNumber}</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="otp">Verification Code</Label>
        <Input
          id="otp"
          type="text"
          inputMode="numeric"
          placeholder="000000"
          value={otpCode}
          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          className="text-center text-2xl tracking-[0.5em] font-mono"
          autoComplete="one-time-code"
          autoFocus
        />
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      <Button 
        type="submit" 
        className="w-full gap-2"
        disabled={isLoading || otpCode.length !== 6}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            Verify
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </Button>

      <div className="text-center">
        {resendTimer > 0 ? (
          <p className="text-sm text-muted-foreground">
            Resend code in {resendTimer}s
          </p>
        ) : (
          <Button 
            type="button" 
            variant="ghost" 
            onClick={handleResend}
            disabled={isLoading}
          >
            Resend Code
          </Button>
        )}
      </div>
    </form>
  );
}

// Email Auth Form Component
interface EmailAuthFormProps {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  isSignUp: boolean;
  setIsSignUp: (value: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  error: string | null;
}

function EmailAuthForm({ 
  email, 
  setEmail, 
  password, 
  setPassword,
  confirmPassword,
  setConfirmPassword,
  isSignUp,
  setIsSignUp,
  onSubmit, 
  isLoading, 
  error 
}: EmailAuthFormProps) {
  const passwordMismatch = isSignUp && password && confirmPassword && password !== confirmPassword;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={isSignUp ? 'new-password' : 'current-password'}
          />
        </div>

        {isSignUp && (
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              className={cn(passwordMismatch && 'border-destructive')}
            />
            {passwordMismatch && (
              <p className="text-xs text-destructive">Passwords don't match</p>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      <Button 
        type="submit" 
        className="w-full gap-2"
        disabled={isLoading || !email || !password || (isSignUp && passwordMismatch)}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            {isSignUp ? 'Create Account' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </Button>

      <div className="text-center">
        <Button 
          type="button" 
          variant="ghost"
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp 
            ? 'Already have an account? Sign in' 
            : "Don't have an account? Create one"
          }
        </Button>
      </div>
    </form>
  );
}
