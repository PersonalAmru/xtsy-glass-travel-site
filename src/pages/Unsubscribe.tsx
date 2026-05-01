import { useEffect, useState, memo } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Loader2, CheckCircle2, AlertCircle, MailX } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://oidnydyyjyjfnyadhyzn.supabase.co";
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "";

type State =
  | { kind: "validating" }
  | { kind: "ready"; email?: string }
  | { kind: "already" }
  | { kind: "invalid"; message: string }
  | { kind: "submitting" }
  | { kind: "done" }
  | { kind: "error"; message: string };

const Unsubscribe = memo(() => {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const [state, setState] = useState<State>({ kind: "validating" });

  useEffect(() => {
    if (!token) {
      setState({ kind: "invalid", message: "Missing unsubscribe token." });
      return;
    }
    (async () => {
      try {
        const res = await fetch(
          `${SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`,
          { headers: { apikey: SUPABASE_ANON } }
        );
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setState({ kind: "invalid", message: data?.error || "Invalid or expired link." });
          return;
        }
        if (data?.alreadyUnsubscribed || data?.already_unsubscribed) {
          setState({ kind: "already" });
          return;
        }
        setState({ kind: "ready", email: data?.email });
      } catch (e: any) {
        setState({ kind: "error", message: e?.message || "Could not validate link." });
      }
    })();
  }, [token]);

  const confirm = async () => {
    setState({ kind: "submitting" });
    try {
      const { data, error } = await supabase.functions.invoke("handle-email-unsubscribe", {
        body: { token },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      setState({ kind: "done" });
    } catch (e: any) {
      setState({ kind: "error", message: e?.message || "Unsubscribe failed." });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>Unsubscribe | XTSY</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8 text-center shadow-sm">
          {state.kind === "validating" && (
            <>
              <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-muted-foreground" />
              <p className="text-muted-foreground">Validating your link…</p>
            </>
          )}
          {state.kind === "ready" && (
            <>
              <MailX className="w-10 h-10 mx-auto mb-4 text-primary" />
              <h1 className="text-xl font-bold mb-2">Unsubscribe from XTSY emails?</h1>
              <p className="text-sm text-muted-foreground mb-6">
                {state.email ? <>You'll stop receiving emails at <b>{state.email}</b>.</> : "You'll stop receiving emails from us."}
              </p>
              <Button size="lg" className="w-full" onClick={confirm}>Confirm Unsubscribe</Button>
            </>
          )}
          {state.kind === "submitting" && (
            <>
              <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-muted-foreground" />
              <p className="text-muted-foreground">Unsubscribing…</p>
            </>
          )}
          {state.kind === "already" && (
            <>
              <CheckCircle2 className="w-10 h-10 mx-auto mb-4 text-emerald-600" />
              <h1 className="text-xl font-bold mb-2">Already unsubscribed</h1>
              <p className="text-sm text-muted-foreground">You're not on our email list anymore.</p>
            </>
          )}
          {state.kind === "done" && (
            <>
              <CheckCircle2 className="w-10 h-10 mx-auto mb-4 text-emerald-600" />
              <h1 className="text-xl font-bold mb-2">You're unsubscribed</h1>
              <p className="text-sm text-muted-foreground">We won't email you anymore. Sorry to see you go!</p>
            </>
          )}
          {(state.kind === "invalid" || state.kind === "error") && (
            <>
              <AlertCircle className="w-10 h-10 mx-auto mb-4 text-destructive" />
              <h1 className="text-xl font-bold mb-2">Something went wrong</h1>
              <p className="text-sm text-muted-foreground">{state.message}</p>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
});

Unsubscribe.displayName = "Unsubscribe";
export default Unsubscribe;
