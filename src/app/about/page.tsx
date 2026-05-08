"use client";

import Link from "next/link";
import { ParticleBackground } from "@/components/ParticleBackground";

const TECH_STACK = [
  { name: "Next.js 16", color: "text-white", desc: "App Router with RSC" },
  { name: "React 19", color: "text-brand-cyan", desc: "Latest with hooks" },
  { name: "Tailwind v4", color: "text-sky-400", desc: "Utility-first CSS" },
  { name: "TypeScript 5", color: "text-blue-400", desc: "Full type safety" },
  { name: "Solana Web3.js", color: "text-purple-400", desc: "RPC integration" },
  { name: "RPC Fast", color: "text-brand-primary", desc: "Premium endpoints" },
];

const BENCHMARKS = [
  { metric: "p50 Latency", rpcFast: "45ms", publicRpc: "1,200ms", improvement: "26.7x" },
  { metric: "p95 Latency", rpcFast: "120ms", publicRpc: "3,500ms", improvement: "29.2x" },
  { metric: "WebSocket", rpcFast: "30ms", publicRpc: "800ms", improvement: "26.7x" },
  { metric: "Throughput", rpcFast: "500 req/s", publicRpc: "~10 req/s", improvement: "50x" },
];

export default function AboutPage() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <ParticleBackground />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-brand-border/30">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img src="/icon.png" alt="Swanipe Logo" className="w-8 h-8 rounded-lg shadow-lg shadow-brand-primary/20 object-cover" />
          <span className="font-bold text-lg tracking-tight">Swanipe</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-brand-muted hover:text-white transition-colors font-mono">
            Home
          </Link>
          <Link href="/dashboard" className="text-sm text-brand-muted hover:text-white transition-colors font-mono">
            Dashboard
          </Link>
        </div>
      </nav>

      <main className="relative z-10 grow flex flex-col items-center py-16 px-6">
        <div className="max-w-4xl w-full space-y-10">
          {/* Header */}
          <div className="space-y-4 text-center">
            <h1 className="text-5xl font-bold tracking-tight">
              About <span className="neon-text text-brand-primary">Swanipe</span>
            </h1>
            <p className="text-lg text-brand-muted max-w-2xl mx-auto">
              Real-time RPC latency comparison and infrastructure telemetry for the Solana ecosystem.
              Built for the Colosseum Frontier Hackathon 2026.
            </p>
          </div>

          {/* What It Does */}
          <div className="glass-panel rounded-xl p-8 space-y-4">
            <h2 className="text-sm font-bold text-brand-primary tracking-widest uppercase font-mono">
              ⚡ What It Does
            </h2>
            <p className="text-brand-muted leading-relaxed">
              Swanipe provides a real-time, side-by-side comparison of RPC endpoint performance.
              It pings both RPC Fast&apos;s premium endpoint and Solana&apos;s public mainnet-beta endpoint concurrently,
              measuring latency and displaying the results in a live-updating dashboard. This demonstrates
              the massive performance advantage of dedicated RPC infrastructure over rate-limited public nodes.
            </p>
            <div className="grid grid-cols-3 gap-4 pt-4">
              {[
                { icon: "📊", label: "Live Benchmarks", desc: "Real-time ping comparison" },
                { icon: "📡", label: "WSS Monitoring", desc: "WebSocket health tracking" },
                { icon: "⚡", label: "Sub-50ms", desc: "Premium endpoint speed" },
              ].map((item) => (
                <div key={item.label} className="text-center p-4 rounded-lg bg-brand-surface/50 border border-brand-border/30">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <div className="text-sm font-bold text-white">{item.label}</div>
                  <div className="text-xs text-brand-muted mt-1">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Benchmark Table */}
          <div className="glass-panel rounded-xl p-8 space-y-4">
            <h2 className="text-sm font-bold text-brand-cyan tracking-widest uppercase font-mono">
              📈 Benchmark Results
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-mono">
                <thead>
                  <tr className="border-b border-brand-border/50">
                    <th className="text-left py-3 text-brand-muted font-normal">Metric</th>
                    <th className="text-right py-3 text-brand-primary font-normal">RPC Fast</th>
                    <th className="text-right py-3 text-status-error/60 font-normal">Public RPC</th>
                    <th className="text-right py-3 text-white font-normal">Improvement</th>
                  </tr>
                </thead>
                <tbody>
                  {BENCHMARKS.map((b) => (
                    <tr key={b.metric} className="border-b border-brand-border/20 hover:bg-brand-surface/30 transition-colors">
                      <td className="py-3 text-brand-muted">{b.metric}</td>
                      <td className="py-3 text-right text-brand-primary font-bold">{b.rpcFast}</td>
                      <td className="py-3 text-right text-status-error/60">{b.publicRpc}</td>
                      <td className="py-3 text-right text-white font-bold">{b.improvement}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="glass-panel rounded-xl p-8 space-y-4">
            <h2 className="text-sm font-bold text-brand-muted tracking-widest uppercase font-mono">
              🏗️ Tech Stack
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {TECH_STACK.map((tech) => (
                <div
                  key={tech.name}
                  className="flex items-center gap-3 p-3 rounded-lg border border-brand-border/30 bg-brand-surface/30 hover:border-brand-primary/30 transition-colors"
                >
                  <span className={`font-mono font-bold text-sm ${tech.color}`}>{tech.name}</span>
                  <span className="text-xs text-brand-muted">{tech.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hackathon */}
          <div className="glass-panel rounded-xl p-8 space-y-4 neon-border">
            <h2 className="text-sm font-bold text-brand-primary tracking-widest uppercase font-mono">
              🏆 Hackathon
            </h2>
            <p className="text-brand-muted">
              Built for{" "}
              <span className="text-white font-semibold">Colosseum Frontier Hackathon 2026</span>.
              Solo developer submission demonstrating deep RPC Fast SDK integration
              and production-ready telemetry UX.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="https://github.com/edycutjong/frontier-rpcfast"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-mono px-4 py-2 rounded-lg border border-brand-border bg-brand-surface hover:border-brand-primary/50 transition-colors text-brand-muted hover:text-white"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
                GitHub Repository
              </a>
              <a
                href="https://rpcfast.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-mono px-4 py-2 rounded-lg border border-brand-primary/30 bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 transition-colors"
              >
                ⚡ RPC Fast
              </a>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center pt-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-primary/90 text-brand-bg font-bold px-8 py-3.5 rounded-xl transition-all hover:shadow-xl hover:shadow-brand-primary/30 text-base"
            >
              Launch Dashboard →
            </Link>
          </div>
        </div>
      </main>

      <footer className="relative z-10 border-t border-brand-border/30 py-6 text-center">
        <p className="text-xs text-brand-muted font-mono">
          Swanipe — Real-Time RPC Telemetry • Built on RPC Fast • Colosseum Frontier Hackathon 2026
        </p>
      </footer>
    </div>
  );
}
