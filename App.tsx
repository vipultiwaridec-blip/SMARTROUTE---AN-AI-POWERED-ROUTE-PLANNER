import { useEffect, useMemo, useState } from "react";
import { Route, Switch } from "wouter";
import { Toaster } from "sonner";
import ErrorBoundary from "./components/ErrorBoundary";
import AppShell from "./components/AppShell";
import Home from "./pages/Home";
import RoutePlanner from "./pages/RoutePlanner";
import LiveRoute from "./pages/LiveRoute";
import Reports from "./pages/Reports";
import Login from "./pages/Login";
import { demoPlan } from "./data/demoPlan";
import { supabase } from "./services/supabase";
import type { Session, User } from "@supabase/supabase-js";
import type { PlannerResult, RouteExplanation } from "../../shared/smartroute";
import NotFound from "./pages/NotFound";
import "./index.css";

type AppPlan = PlannerResult & { explanation: RouteExplanation };

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(!supabase);
  const [plan, setPlan] = useState<AppPlan>(demoPlan);
  const [selectedId, setSelectedId] = useState(demoPlan.routes[0]!.id);
  const user: User | null = session?.user ?? null;
  const mode = useMemo(() => {
    const modes = Object.values(plan.sources);
    return modes.every(item => item === "live") ? "live" : modes.every(item => item === "demo") ? "demo" : "mixed";
  }, [plan]);

  useEffect(() => {
    if (!supabase) return;
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) { setSession(data.session); setAuthReady(true); }
    }).catch(() => { if (mounted) setAuthReady(true); });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession); setAuthReady(true);
    });
    return () => { mounted = false; listener.subscription.unsubscribe(); };
  }, []);

  const loadPlan = (next: AppPlan, preferredRouteId?: string) => {
    setPlan(next);
    setSelectedId(next.routes.some(route => route.id === preferredRouteId) ? preferredRouteId! : next.routes[0]?.id ?? "");
  };

  return <ErrorBoundary>
    <Toaster richColors position="top-right" theme="dark" />
    {!authReady ? <div className="app-boot"><span className="boot-mark">⌁</span><span>Opening SmartRoute…</span></div> : <Switch>
      <Route path="/">{() => <AppShell user={user} mode={mode}><Home user={user} /></AppShell>}</Route>
      <Route path="/planner">{() => <AppShell user={user} mode={mode}><RoutePlanner plan={plan} setPlan={loadPlan} selectedRouteId={selectedId} onSelectRoute={setSelectedId} user={user} session={session} /></AppShell>}</Route>
      <Route path="/live">{() => <AppShell user={user} mode={mode}><LiveRoute plan={plan} selectedId={selectedId} onSelect={setSelectedId} /></AppShell>}</Route>
      <Route path="/reports">{() => <AppShell user={user} mode={mode}><Reports user={user} session={session} onLoadPlan={loadPlan} /></AppShell>}</Route>
      <Route path="/login">{() => <AppShell user={user} mode={mode}><Login /></AppShell>}</Route>
      <Route path="/signup">{() => <AppShell user={user} mode={mode}><Login initialMode="signup" /></AppShell>}</Route>
      <Route path="/404">{() => <AppShell user={user} mode={mode}><NotFound /></AppShell>}</Route>
      <Route>{() => <AppShell user={user} mode={mode}><NotFound /></AppShell>}</Route>
    </Switch>}
  </ErrorBoundary>;
}
