import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Shield, Mail, KeyRound } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ADMIN_EMAIL = "xtsy.social@gmail.com";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if email matches admin email
    if (email.toLowerCase().trim() !== ADMIN_EMAIL.toLowerCase()) {
      toast.error("Access denied. Only authorized admin can login.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          shouldCreateUser: false, // Don't create new users
        },
      });

      if (error) throw error;

      setOtpSent(true);
      toast.success("OTP sent to your email!");
    } catch (error: any) {
      toast.error(error.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: otp.trim(),
        type: 'email',
      });

      if (authError) throw authError;

      if (authData.user) {
        // Check if user has admin role
        const { data: isAdmin, error: roleError } = await supabase.rpc('has_role', {
          _user_id: authData.user.id,
          _role: 'admin'
        });

        if (roleError) throw roleError;

        if (isAdmin) {
          toast.success("Welcome, Admin!");
          navigate("/admin/dashboard");
        } else {
          await supabase.auth.signOut();
          toast.error("Access denied. Admin privileges required.");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          shouldCreateUser: false,
        },
      });

      if (error) throw error;
      toast.success("New OTP sent!");
    } catch (error: any) {
      toast.error(error.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-card/50 backdrop-blur-md border border-border rounded-2xl shadow-2xl p-8">
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Admin Access</h1>
              <p className="text-muted-foreground text-center">
                {otpSent ? "Enter the OTP sent to your email" : "Secure OTP-based login for administrators"}
              </p>
            </div>

            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">Admin Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter admin email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-background/50 border-border pl-10"
                      autoComplete="email"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 rounded-lg transition-all"
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-foreground">Enter OTP</Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="otp"
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      required
                      maxLength={6}
                      className="bg-background/50 border-border pl-10 text-center text-2xl tracking-widest font-mono"
                      autoComplete="one-time-code"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground text-center mt-2">
                    OTP sent to {email}
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 rounded-lg transition-all"
                >
                  {loading ? "Verifying..." : "Verify & Login"}
                </Button>

                <div className="flex items-center justify-between text-sm">
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setOtp("");
                    }}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ← Change email
                  </button>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading}
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    Resend OTP
                  </button>
                </div>
              </form>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Authorized access only. All login attempts are monitored.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminLogin;
