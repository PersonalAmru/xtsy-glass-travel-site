/**
 * Admin Login Page - Apple-grade minimal design
 * Email/Password only, no public link exposure
 * SECURITY: Complete session isolation from user auth
 * CRITICAL: Admin auth is completely separate from user auth
 * SECURITY LOGGING: All login attempts are logged with device fingerprint and geo-location
 */

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Shield, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { logAdminLoginAttempt, logUnauthorizedAccess } from "@/services/securityLoggingService";

// Admin session isolation keys - MUST be different from user session
const ADMIN_SESSION_KEY = 'xtsy_admin_session';
const ADMIN_AUTH_TIMESTAMP = 'xtsy_admin_auth_ts';
const USER_SESSION_KEY = 'xtsy_user_session';
const ADMIN_FLOW_KEY = 'xtsy_admin_auth_flow';
const ADMIN_USER_ID = 'xtsy_admin_user_id';

// Track failed attempts for brute force detection
const FAILED_ATTEMPTS_KEY = 'xtsy_admin_failed_attempts';

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const mountedRef = useRef(true);

  // SECURITY: Complete session isolation on mount
  useEffect(() => {
    mountedRef.current = true;
    
    console.log('[AdminLogin] Page loaded - monitoring for security events');
    
    // Mark admin login flow IMMEDIATELY - this prevents UserAuthContext from picking up the session
    sessionStorage.setItem('xtsy_auth_flow', 'admin');
    localStorage.setItem(ADMIN_FLOW_KEY, 'true');
    
    // CRITICAL: Clear ALL user session markers to prevent cross-contamination
    localStorage.removeItem(USER_SESSION_KEY);
    sessionStorage.removeItem('xtsy_user_redirect');
    
    // Sign out any existing sessions to ensure clean admin login
    const cleanupSession = async () => {
      try {
        await supabase.auth.signOut({ scope: 'local' });
      } catch {
        // Ignore errors during cleanup
      }
    };
    cleanupSession();
    
    return () => {
      mountedRef.current = false;
      sessionStorage.removeItem('xtsy_auth_flow');
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('[AdminLogin] Login attempt initiated for:', email);
    
    // Basic validation only - no email checking client-side
    if (!email.trim() || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      // SECURITY: Ensure we're marked as admin flow BEFORE any auth operations
      sessionStorage.setItem('xtsy_auth_flow', 'admin');
      localStorage.setItem(ADMIN_FLOW_KEY, 'true');
      
      // SECURITY: Sign out any existing session first to ensure clean admin login
      await supabase.auth.signOut({ scope: 'global' });
      
      // CRITICAL: Clear ALL session markers to prevent cross-contamination
      localStorage.removeItem(ADMIN_SESSION_KEY);
      localStorage.removeItem(USER_SESSION_KEY);
      localStorage.removeItem('xtsy_franchise_session');
      localStorage.removeItem(ADMIN_USER_ID);
      sessionStorage.removeItem('xtsy_user_redirect');
      
      // Small delay to ensure complete signout
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Re-mark as admin flow after cleanup
      sessionStorage.setItem('xtsy_auth_flow', 'admin');
      localStorage.setItem(ADMIN_FLOW_KEY, 'true');
      
      console.log('[AdminLogin] Attempting Supabase auth for:', email);
      
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (!mountedRef.current) return;

      if (authError) {
        console.log('[AdminLogin] Auth error:', authError.message);
        
        // SECURITY LOG: Failed login attempt
        await logAdminLoginAttempt(email.trim(), false, `Auth error: ${authError.message}`);
        
        toast.error("Invalid credentials. Please try again.");
        return;
      }

      if (authData.user) {
        // Server-side role verification is the sole authorization gate.
        // Email-based pre-checks were removed to avoid leaking admin identity in the client bundle.
        console.log('[AdminLogin] Verifying admin role for user:', authData.user.id);
        
        const { data: isAdmin, error: roleError } = await supabase.rpc('has_role', {
          _user_id: authData.user.id,
          _role: 'admin'
        });

        if (roleError) {
          console.log('[AdminLogin] Role check error:', roleError);
          
          await logAdminLoginAttempt(email.trim(), false, `Role verification failed: ${roleError.message}`);
          
          await supabase.auth.signOut({ scope: 'global' });
          localStorage.removeItem(ADMIN_FLOW_KEY);
          toast.error("Unable to verify access. Please try again.");
          return;
        }

        if (isAdmin) {
          console.log('[AdminLogin] ✅ Admin access granted for:', authData.user.email);
          
          // SECURITY LOG: Successful admin login
          await logAdminLoginAttempt(email.trim(), true, 'Successful admin login');
          
          // SECURITY: Store admin session markers with timestamp and user ID
          localStorage.setItem(ADMIN_SESSION_KEY, 'true');
          localStorage.setItem(ADMIN_AUTH_TIMESTAMP, Date.now().toString());
          localStorage.setItem(ADMIN_USER_ID, authData.user.id);
          
          // CRITICAL: Ensure user session is cleared and admin flow is maintained
          localStorage.removeItem(USER_SESSION_KEY);
          localStorage.setItem(ADMIN_FLOW_KEY, 'true');
          
          // Clear failed attempts on successful login
          localStorage.removeItem(FAILED_ATTEMPTS_KEY);
          
          toast.success("Welcome to Admin Portal!");
          navigate("/admin");
        } else {
          console.log('[AdminLogin] 🚨 UNAUTHORIZED - User has admin email but no admin role');
          
          await logUnauthorizedAccess(email.trim(), 'admin_console_no_role');
          
          await supabase.auth.signOut({ scope: 'global' });
          localStorage.removeItem(ADMIN_FLOW_KEY);
          toast.error("Access denied.");
        }
      }
    } catch (error: any) {
      console.log('[AdminLogin] Login exception:', error);
      
      await logAdminLoginAttempt(email.trim(), false, `Exception: ${error.message}`);
      
      localStorage.removeItem(ADMIN_FLOW_KEY);
      toast.error("Login failed. Please try again.");
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center px-4">
      {/* Subtle grid pattern overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />
      
      {/* Gradient orbs */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[128px] pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Card */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-8">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="relative mb-6"
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-2xl shadow-primary/30">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -inset-3 bg-primary/20 rounded-3xl blur-xl -z-10" />
            </motion.div>
            
            <h1 className="text-2xl font-bold text-white mb-1">Admin Access</h1>
            <p className="text-slate-400 text-sm text-center">
              Secure login for authorized personnel
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300 text-sm font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 pl-12 bg-white/5 border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:border-primary/50 focus:ring-primary/20 transition-all"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300 text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 pl-12 pr-12 bg-white/5 border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:border-primary/50 focus:ring-primary/20 transition-all"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-primary/40 gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-xs text-slate-500">
              Authorized access only. All login attempts are monitored.
            </p>
          </div>
        </div>
        
        {/* Subtle footer */}
        <p className="text-center mt-6 text-xs text-slate-600">
          XTSY Admin Portal
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;