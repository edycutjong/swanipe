"use client";

import Link from "next/link";
import { ParticleBackground } from "@/components/ParticleBackground";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { ScrambleText } from "@/components/ScrambleText";
import { LatencyPulse } from "@/components/LatencyPulse";
import { useState, useEffect } from "react";

const FEATURES = [
  {
    icon: "⚡",
    title: "Sub-50ms Latency",
    desc: "RPC Fast delivers 26x faster response times than public Solana endpoints. Every millisecond counts in DeFi.",
    stat: "45ms p50",
  },
  {
    icon: "📡",
    title: "WebSocket Streaming",
    desc: "Persistent WSS connections with real-time slot subscriptions. Zero missed blocks, zero reconnect overhead.",
    stat: "30ms WSS",
  },
  {
    icon: "🔄",
    title: "Live Benchmarks",
    desc: "Side-by-side latency visualization comparing RPC Fast vs public RPCs. See the difference in real-time.",
    stat: "26.7x faster",
  },
  {
    icon: "🛡️",
    title: "Production Grade",
    desc: "120M compute units, 500 req/s rate limit, unlimited bandwidth. Built for high-throughput production workloads.",
    stat: "99.9% uptime",
  },
];

const TERMINAL_LINES = [
  { text: "$ solana config get --url", delay: 0 },
  { text: "RPC URL: https://solana-mainnet.rpcfast.com/v1/...", delay: 400, color: "text-brand-primary" },
  { text: "$ curl -s -o /dev/null -w '%{time_total}' $RPC_URL", delay: 800 },
  { text: "Response: 0.045s ✓", delay: 1200, color: "text-brand-primary" },
  { text: "$ curl -s -o /dev/null -w '%{time_total}' https://api.mainnet-beta.solana.com", delay: 1800 },
  { text: "Response: 1.203s ✗", delay: 2200, color: "text-status-error" },
  { text: "// RPC Fast is 26.7x faster", delay: 2800, color: "text-brand-cyan" },
  { text: "$ wss://solana-mainnet.rpcfast.com/v1/...", delay: 3200 },
  { text: "WebSocket connected :: latency 30ms ✓", delay: 3600, color: "text-brand-primary" },
];

function TerminalAnimation() {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    TERMINAL_LINES.forEach((line, idx) => {
      timers.push(
        setTimeout(() => setVisibleLines(idx + 1), line.delay + 500)
      );
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="glass-panel rounded-xl p-6 font-mono text-sm space-y-1 w-full max-w-2xl scanline relative overflow-hidden">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-brand-border/50">
        <div className="w-3 h-3 rounded-full bg-status-error/80" />
        <div className="w-3 h-3 rounded-full bg-status-warning/80" />
        <div className="w-3 h-3 rounded-full bg-brand-primary/80" />
        <span className="text-brand-muted text-xs ml-2">swanipe@telemetry:~</span>
      </div>
      {TERMINAL_LINES.slice(0, visibleLines).map((line, idx) => (
        <div
          key={idx}
          className={`${line.color || "text-brand-muted"} animate-slide-in-right opacity-0`}
          style={{ animationDelay: `${idx * 50}ms`, animationFillMode: "forwards" }}
        >
          {line.text}
        </div>
      ))}
      {visibleLines < TERMINAL_LINES.length && (
        <div className="text-brand-primary terminal-cursor" />
      )}
    </div>
  );
}

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col">
      <ParticleBackground />
      
      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-brand-border/30">
        <div className="flex items-center gap-3">
          <img src="/icon.png" alt="Swanipe Logo" className="w-8 h-8 rounded-lg shadow-lg shadow-brand-primary/20 object-cover" />
          <span className="font-bold text-lg tracking-tight">Swanipe</span>
          <span className="text-xs font-mono text-brand-muted bg-brand-surface px-2 py-0.5 rounded border border-brand-border">v1.0</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-sm text-brand-muted hover:text-white transition-colors font-mono">
            Dashboard
          </Link>
          <Link href="/about" className="text-sm text-brand-muted hover:text-white transition-colors font-mono">
            About
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-bold px-4 py-2 rounded-lg bg-brand-primary hover:bg-brand-primary/90 text-brand-bg transition-all hover:shadow-lg hover:shadow-brand-primary/20"
          >
            Launch App →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 grow flex flex-col items-center justify-center px-6">
        <div className="max-w-5xl mx-auto w-full text-center space-y-8">
          {/* Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-primary/30 bg-brand-primary/5 text-sm font-mono ${mounted ? "animate-slide-up opacity-0" : ""}`} style={{ animationFillMode: "forwards" }}>
            <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
            <span className="text-brand-primary">BUILT ON RPC FAST</span>
            <span className="text-brand-muted">•</span>
            <span className="text-brand-muted">Colosseum Frontier 2026</span>
          </div>

          {/* Title */}
          <h1 className={`text-6xl md:text-7xl font-bold tracking-tight leading-tight ${mounted ? "animate-slide-up opacity-0 delay-100" : ""}`} style={{ animationFillMode: "forwards" }}>
            <span className="bg-linear-to-r from-white via-white to-brand-muted bg-clip-text text-transparent">
              Real-Time{" "}
            </span>
            <span className="bg-linear-to-r from-brand-primary to-brand-cyan bg-clip-text text-transparent animate-gradient-shift neon-text">
              RPC Telemetry
            </span>
          </h1>

          {/* Subtitle */}
          <p className={`text-xl text-brand-muted max-w-2xl mx-auto leading-relaxed ${mounted ? "animate-slide-up opacity-0 delay-200" : ""}`} style={{ animationFillMode: "forwards" }}>
            <ScrambleText
              text="26x faster than public Solana endpoints. Live latency benchmarks, WebSocket monitoring, and infrastructure telemetry — powered by RPC Fast."
              speed={15}
              delay={600}
            />
          </p>

          {/* Hero Stats */}
          <div className={`grid grid-cols-3 gap-6 max-w-xl mx-auto ${mounted ? "animate-slide-up opacity-0 delay-300" : ""}`} style={{ animationFillMode: "forwards" }}>
            <div className="text-center">
              <div className="text-3xl font-bold font-mono neon-text text-brand-primary">
                {mounted && <AnimatedCounter target={45} suffix="ms" duration={2000} />}
              </div>
              <div className="text-xs text-brand-muted font-mono mt-1">p50 LATENCY</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold font-mono text-white">
                {mounted && <AnimatedCounter target={26.7} suffix="x" decimals={1} duration={2500} />}
              </div>
              <div className="text-xs text-brand-muted font-mono mt-1">SPEED GAIN</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold font-mono neon-text-cyan text-brand-cyan">
                {mounted && <AnimatedCounter target={99.9} suffix="%" decimals={1} duration={3000} />}
              </div>
              <div className="text-xs text-brand-muted font-mono mt-1">UPTIME</div>
            </div>
          </div>

          {/* CTA */}
          <div className={`flex items-center justify-center gap-4 ${mounted ? "animate-slide-up opacity-0 delay-400" : ""}`} style={{ animationFillMode: "forwards" }}>
            <Link
              href="/dashboard"
              className="group relative inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-primary/90 text-brand-bg font-bold px-8 py-3.5 rounded-xl transition-all hover:shadow-xl hover:shadow-brand-primary/30 text-base"
            >
              <span>Open Dashboard</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
              <div className="absolute inset-0 rounded-xl animate-pulse-glow pointer-events-none" />
            </Link>
            <a
              href="https://github.com/edycutjong/frontier-rpcfast"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-brand-border hover:border-brand-muted text-brand-muted hover:text-white font-mono px-6 py-3.5 rounded-xl transition-all text-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
              View Source
            </a>
          </div>
        </div>

        {/* Radar + Terminal Side by Side */}
        <div className={`mt-16 max-w-5xl mx-auto w-full grid md:grid-cols-2 gap-8 items-center ${mounted ? "animate-slide-up opacity-0 delay-500" : ""}`} style={{ animationFillMode: "forwards" }}>
          <div className="flex justify-center">
            <div className="relative">
              <LatencyPulse size={280} />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs font-mono text-brand-muted text-center">
                LATENCY RADAR • LIVE SCAN
              </div>
            </div>
          </div>
          <TerminalAnimation />
        </div>
      </main>

      {/* Features */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-3">
              Infrastructure-Grade{" "}
              <span className="text-brand-primary">Performance</span>
            </h2>
            <p className="text-brand-muted max-w-lg mx-auto">
              Every Solana transaction flows through RPC Fast — delivering production reliability at hackathon speed.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {FEATURES.map((f, idx) => (
              <div
                key={f.title}
                className="glass-panel-hover rounded-xl p-6 space-y-3"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{f.icon}</span>
                    <h3 className="font-bold text-lg">{f.title}</h3>
                  </div>
                  <span className="text-xs font-mono text-brand-primary bg-brand-primary/10 px-2 py-1 rounded">
                    {f.stat}
                  </span>
                </div>
                <p className="text-sm text-brand-muted leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="relative z-10 py-16 px-6 border-t border-brand-border/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-3">
              System <span className="text-brand-cyan">Architecture</span>
            </h2>
          </div>
          <div className="glass-panel rounded-xl p-8">
            <div className="grid md:grid-cols-5 gap-4 items-center text-center">
              {/* Architecture flow */}
              {[
                { label: "Solana Network", sub: "Mainnet-Beta", color: "text-purple-400", border: "border-purple-400/30" },
                { label: "→", sub: "", color: "text-brand-muted", border: "" },
                { label: "RPC Fast", sub: "45ms p50", color: "text-brand-primary", border: "border-brand-primary/30" },
                { label: "→", sub: "", color: "text-brand-muted", border: "" },
                { label: "Swanipe Dashboard", sub: "Next.js 16 + React 19", color: "text-brand-cyan", border: "border-brand-cyan/30" },
              ].map((node, idx) => (
                <div key={idx}>
                  {node.border ? (
                    <div className={`border ${node.border} rounded-xl p-4 bg-brand-surface/50`}>
                      <div className={`font-bold font-mono text-sm ${node.color}`}>{node.label}</div>
                      <div className="text-xs text-brand-muted mt-1">{node.sub}</div>
                    </div>
                  ) : (
                    <div className={`text-2xl ${node.color}`}>{node.label}</div>
                  )}
                </div>
              ))}
            </div>
            <div className="gradient-line my-6" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Protocol", value: "HTTPS + WSS" },
                { label: "Compute Units", value: "120M/month" },
                { label: "Rate Limit", value: "500 req/s" },
                { label: "Region", value: "Frankfurt DE" },
              ].map((item) => (
                <div key={item.label} className="text-center py-3 rounded-lg bg-brand-surface/50 border border-brand-border/30">
                  <div className="text-xs text-brand-muted font-mono uppercase mb-1">{item.label}</div>
                  <div className="text-sm font-bold font-mono text-white">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative z-10 py-16 px-6 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold">
            Ready to see the <span className="neon-text text-brand-primary">difference</span>?
          </h2>
          <p className="text-brand-muted">
            Launch the real-time telemetry dashboard and watch RPC Fast outperform public endpoints live.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-primary/90 text-brand-bg font-bold px-10 py-4 rounded-xl transition-all hover:shadow-xl hover:shadow-brand-primary/30 text-lg"
          >
            Open Telemetry Dashboard →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-brand-border/30 py-6 text-center">
        <p className="text-xs text-brand-muted font-mono">
          Swanipe — Real-Time RPC Telemetry • Built on RPC Fast • Colosseum Frontier Hackathon 2026
        </p>
      </footer>
    </div>
  );
}
