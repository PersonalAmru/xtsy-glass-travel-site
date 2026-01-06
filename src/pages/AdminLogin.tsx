/**
 * Admin Login Page - Apple-grade minimal design
 * Email/Password only, no public link exposure
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Shield, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation only - no email checking client-side
    if (!email.trim() || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      // Sign out any existing session first to ensure clean admin login
      await supabase.auth.signOut();
      
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (authError) {
        toast.error("Invalid credentials. Please try again.");
        return;
      }

      if (authData.user) {
        // Check if email is the designated admin email
        const isAdminEmail = authData.user.email === 'xtsy.social@gmail.com';
        
        if (!isAdminEmail) {
          await supabase.auth.signOut();
          toast.error("Access denied.");
          return;
        }

        // Server-side role verification
        const { data: isAdmin, error: roleError } = await supabase.rpc('has_role', {
          _user_id: authData.user.id,
          _role: 'admin'
        });

        if (roleError) {
          await supabase.auth.signOut();
          toast.error("Unable to verify access. Please try again.");
          return;
        }

        if (isAdmin) {
          // Store admin session marker in localStorage
          localStorage.setItem('xtsy_admin_session', 'true');
          toast.success("Welcome to Admin Portal!");
          navigate("/admin");
        } else {
          await supabase.auth.signOut();
          toast.error("Access denied.");
        }
      }
    } catch (error: any) {
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
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
