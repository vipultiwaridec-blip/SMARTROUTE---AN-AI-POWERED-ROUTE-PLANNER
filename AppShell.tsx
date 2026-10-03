import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Activity, ArrowUpRight, Box, FileText, LogOut, Menu, Route as RouteIcon, Truck, X } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabase } from "../services/supabase";

type Props = { user: User | null; mode?: "live" | "demo" | "mixed"; children: React.ReactNode };
const links = [
  { path: "/planner", label: "Route planner", icon: RouteIcon },
  { path: "/live", label: "Live view", icon: Box },
  { path: "/reports", label: "Reports", icon: FileText },
];

export default function AppShell({ user, mode = "demo", children }: Props) {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const status = mode === "live" ? "LIVE ROUTE" : mode === "mixed" ? "MIXED DATA" : "DEMO MODE";
  return <div className="site-frame">
    <header className="topbar">
      <Link href="/" className="brand-lockup" onClick={() => setMenuOpen(false)}>
        <span className="brand-mark"><RouteIcon size={19} strokeWidth={2.2} /></span>
        <span className="brand-copy"><strong>SMART<span>ROUTE</span></strong><small>PLAN SMARTER. DELIVER BETTER.</small></span>
      </Link>
      <nav className={`main-nav ${menuOpen ? "is-open" : ""}`} aria-label="Main navigation">
        <Link href="/" className={`nav-link ${location === "/" ? "is-current" : ""}`} onClick={() => setMenuOpen(false)}>Overview</Link>
        {links.map(({ path, label, icon: Icon }) => <Link key={path} href={path} className={`nav-link ${location === path ? "is-current" : ""}`} onClick={() => setMenuOpen(false)}><Icon size={15} /> {label}</Link>)}
      </nav>
      <div className="topbar-actions">
        <div className={`status-pill ${mode}`} title="Data sources are labeled individually in the route analysis"><span className="status-dot" />{status}</div>
        {user ? <button className="user-pill" onClick={async () => { await supabase?.auth.signOut(); }} title="Sign out"><span className="user-avatar">{(user.email?.[0] ?? "S").toUpperCase()}</span><span className="user-email">{user.email}</span><LogOut size={14} /></button> : <Link href="/login" className="login-link">Sign in <ArrowUpRight size={14} /></Link>}
        <button className="mobile-menu" aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
      </div>
    </header>
    {!isSupabaseConfigured && <div className="config-ribbon"><Activity size={13} /> Demo mode is ready. Add Supabase credentials and run the included SQL migration to enable secure accounts and cloud-saved routes.</div>}
    <main className="main-content">{children}</main>
    <footer className="site-footer"><div className="footer-brand"><Truck size={16} /> SmartRoute <span>Route intelligence, with every mile in view.</span></div><span>© {new Date().getFullYear()} SmartRoute · OpenStreetMap mapping</span></footer>
  </div>;
}
