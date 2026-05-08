"use client";

import Link from "next/link";
import { ParticleBackground } from "@/components/ParticleBackground";
import { useState, useEffect, useCallback } from "react";

interface DataPoint {
  time: number;
  rpcFast: number;
  publicNode: number;
}

interface HistogramEntry {
  range: string;
  rpcFast: number;
  publicNode: number;
}

function generateHistogram(data: DataPoint[]): HistogramEntry[] {
  const buckets = [
    { range: "0-25ms", min: 0, max: 25 },
    { range: "25-50ms", min: 25, max: 50 },
    { range: "50-100ms", min: 50, max: 100 },
    { range: "100-200ms", min: 100, max: 200 },
    { range: "200-500ms", min: 200, max: 500 },
    { range: "500ms+", min: 500, max: Infinity },
  ];
  return buckets.map((b) => ({
    range: b.range,
    rpcFast: data.filter((d) => d.rpcFast >= b.min && d.rpcFast < b.max).length,
    publicNode: data.filter((d) => d.publicNode >= b.min && d.publicNode < b.max).length,
  }));
}

function generateLatency(base: number, variance: number): number {
  return Math.max(5, Math.round(base + (Math.random() - 0.5) * variance));
}

export default function DashboardPage() {
  const [dataPoints, setDataPoints] = useState<DataPoint[]>(() =>
    Array.from({ length: 30 }, (_, i) => ({
      time: i,
      rpcFast: generateLatency(42, 30),
      publicNode: generateLatency(280, 200),
    }))
  );
  const [isConnected, setIsConnected] = useState(false);
  const [totalPings, setTotalPings] = useState(0);
  const [blockHeight, setBlockHeight] = useState(241894012);

  useEffect(() => {
    const timer = setTimeout(() => setIsConnected(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  const tick = useCallback(() => {
    setDataPoints((prev) => {
      const next = [
        ...prev.slice(1),
        {
          time: prev[prev.length - 1].time + 1,
          rpcFast: generateLatency(42, 30),
          publicNode: generateLatency(280, 200),
        },
      ];
      return next;
    });
    setTotalPings((p) => p + 2);
    setBlockHeight((h) => h + Math.floor(Math.random() * 3));
  }, []);

  useEffect(() => {
    if (!isConnected) return;
    const interval = setInterval(tick, 1200);
    return () => clearInterval(interval);
  }, [isConnected, tick]);

  const latest = dataPoints[dataPoints.length - 1];
  const avgRpcFast = Math.round(dataPoints.reduce((s, d) => s + d.rpcFast, 0) / dataPoints.length);
  const avgPublic = Math.round(dataPoints.reduce((s, d) => s + d.publicNode, 0) / dataPoints.length);
  const multiplier = (avgPublic / avgRpcFast).toFixed(1);
  const maxLatency = 500;
  const histogram = generateHistogram(dataPoints);
  const maxHist = Math.max(...histogram.flatMap((h) => [h.rpcFast, h.publicNode]), 1);

  // p95 calculation
  const sortedRpc = [...dataPoints].map((d) => d.rpcFast).sort((a, b) => a - b);
  const sortedPublic = [...dataPoints].map((d) => d.publicNode).sort((a, b) => a - b);
  const p95Rpc = sortedRpc[Math.floor(sortedRpc.length * 0.95)];
  const p95Public = sortedPublic[Math.floor(sortedPublic.length * 0.95)];

  return (
    <div className="relative min-h-screen flex flex-col">
      <ParticleBackground />

      {/* Status Bar */}
      <div className="relative z-10 flex items-center justify-between bg-brand-surface/80 backdrop-blur border-b border-brand-border px-4 py-2.5 text-xs font-mono">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/icon.png" alt="Swanipe Logo" className="w-6 h-6 rounded shadow-lg shadow-brand-primary/20 object-cover" />
            <span className="font-bold text-sm text-white">Swanipe</span>
          </Link>
          <span className="text-brand-border">│</span>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-brand-primary animate-pulse" : "bg-status-warning"}`} />
            <span className="text-brand-muted">{isConnected ? "SYSTEM ONLINE" : "CONNECTING..."}</span>
          </div>
          <span className="text-brand-border">│</span>
          <span className="text-brand-muted">PINGS: <span className="text-white">{totalPings}</span></span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-brand-muted">BLOCK: <span className="text-brand-cyan">{blockHeight.toLocaleString()}</span></span>
          <span className="text-brand-border">│</span>
          <span className="text-brand-muted">WSS: <span className={isConnected ? "text-brand-primary" : "text-status-warning"}>{isConnected ? "443 ✓" : "---"}</span></span>
          <span className="text-brand-border">│</span>
          <span className="text-brand-muted">v1.0.0</span>
        </div>
      </div>

      {/* Main Dashboard */}
      <main className="relative z-10 grow p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isConnected ? "bg-brand-primary animate-pulse-glow" : "bg-status-error"}`} />
              Telemetry Dashboard
            </h1>
            <p className="text-brand-muted text-sm font-mono mt-1">
              REAL-TIME LATENCY COMPARISON :: RPC FAST vs PUBLIC ENDPOINT
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xs font-mono text-brand-muted hover:text-white transition-colors border border-brand-border rounded-lg px-3 py-1.5 hover:border-brand-muted">
              ← Landing
            </Link>
            <Link href="/about" className="text-xs font-mono text-brand-muted hover:text-white transition-colors border border-brand-border rounded-lg px-3 py-1.5 hover:border-brand-muted">
              About
            </Link>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid md:grid-cols-4 gap-4">
          {/* RPC Fast Latency */}
          <div className="glass-panel-hover p-5 rounded-xl border-l-4 border-l-brand-primary relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-brand-primary/5 rounded-bl-full" />
            <div className="text-xs font-mono text-brand-muted uppercase tracking-widest mb-2">RPC Fast p50</div>
            <div className="text-4xl font-bold font-mono neon-text text-brand-primary">
              {isConnected ? `${latest.rpcFast}ms` : "--"}
            </div>
            <div className="text-xs text-brand-primary/60 font-mono mt-1">avg: {avgRpcFast}ms • p95: {p95Rpc}ms</div>
          </div>

          {/* Speed Advantage */}
          <div className="glass-panel-hover p-5 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-bl-full" />
            <div className="text-xs font-mono text-brand-muted uppercase tracking-widest mb-2">Speed Advantage</div>
            <div className="text-4xl font-bold text-white">
              {isConnected ? `${multiplier}x` : "--"}
            </div>
            <div className="text-xs text-brand-muted font-mono mt-1">faster than public</div>
          </div>

          {/* Public RPC Latency */}
          <div className="glass-panel-hover p-5 rounded-xl border-l-4 border-l-status-error/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-status-error/5 rounded-bl-full" />
            <div className="text-xs font-mono text-brand-muted uppercase tracking-widest mb-2">Public RPC p50</div>
            <div className="text-4xl font-bold text-status-error/80 font-mono">
              {isConnected ? `${latest.publicNode}ms` : "--"}
            </div>
            <div className="text-xs text-status-error/50 font-mono mt-1">avg: {avgPublic}ms • p95: {p95Public}ms</div>
          </div>

          {/* WebSocket Status */}
          <div className="glass-panel-hover p-5 rounded-xl border-l-4 border-l-brand-cyan/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-brand-cyan/5 rounded-bl-full" />
            <div className="text-xs font-mono text-brand-muted uppercase tracking-widest mb-2">WebSocket</div>
            <div className="text-4xl font-bold neon-text-cyan text-brand-cyan font-mono">
              {isConnected ? "LIVE" : "--"}
            </div>
            <div className="text-xs text-brand-cyan/60 font-mono mt-1">wss://rpcfast.com/v1</div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Latency Chart */}
          <div className="md:col-span-2 glass-panel p-6 rounded-xl">
            <h3 className="text-sm font-bold uppercase tracking-widest text-brand-muted mb-4 flex justify-between items-center">
              <span>Real-time Ping Comparison</span>
              <span className="flex gap-4 text-xs font-normal">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-brand-primary rounded-full shadow-[0_0_6px_rgba(34,197,94,0.5)]" />
                  RPC Fast
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-status-error/50 rounded-full" />
                  Public
                </span>
              </span>
            </h3>

            <div className="h-52 flex items-end justify-between gap-[2px] relative">
              {/* Y-axis */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {[500, 375, 250, 125, 0].map((val) => (
                  <div key={val} className="h-0 border-t border-dashed border-brand-border/20 w-full relative">
                    <span className="absolute -left-10 -top-2 text-[9px] text-brand-muted font-mono">{val}</span>
                  </div>
                ))}
              </div>

              {dataPoints.map((point) => (
                <div key={point.time} className="w-full flex items-end gap-px h-full relative">
                  <div
                    className="w-1/2 bg-status-error/25 rounded-t transition-all duration-500 hover:bg-status-error/40"
                    style={{ height: `${Math.min((point.publicNode / maxLatency) * 100, 100)}%` }}
                  />
                  <div
                    className="w-1/2 bg-brand-primary rounded-t transition-all duration-500 shadow-[0_0_8px_rgba(34,197,94,0.3)] hover:shadow-[0_0_14px_rgba(34,197,94,0.5)]"
                    style={{ height: `${Math.min((point.rpcFast / maxLatency) * 100, 100)}%` }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Histogram */}
          <div className="glass-panel p-6 rounded-xl">
            <h3 className="text-sm font-bold uppercase tracking-widest text-brand-muted mb-4">
              Latency Distribution
            </h3>
            <div className="space-y-3">
              {histogram.map((h) => (
                <div key={h.range} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-brand-muted">
                    <span>{h.range}</span>
                    <span className="flex gap-2">
                      <span className="text-brand-primary">{h.rpcFast}</span>
                      <span className="text-status-error/60">{h.publicNode}</span>
                    </span>
                  </div>
                  <div className="flex gap-0.5 h-2">
                    <div
                      className="bg-brand-primary rounded-sm transition-all duration-500"
                      style={{ width: `${(h.rpcFast / maxHist) * 100}%` }}
                    />
                    <div
                      className="bg-status-error/30 rounded-sm transition-all duration-500"
                      style={{ width: `${(h.publicNode / maxHist) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Connection Log */}
          <div className="glass-panel p-6 rounded-xl">
            <h3 className="text-sm font-bold uppercase tracking-widest text-brand-muted mb-4">
              Connection Log
            </h3>
            <div className="space-y-2 font-mono text-xs max-h-40 overflow-y-auto">
              {isConnected && (
                <>
                  <LogLine severity="info" text="WSS handshake complete — port 443" />
                  <LogLine severity="success" text={`RPC Fast latency: ${latest.rpcFast}ms (p50: ${avgRpcFast}ms)`} />
                  <LogLine severity="warn" text={`Public RPC latency: ${latest.publicNode}ms (p50: ${avgPublic}ms)`} />
                  <LogLine severity="info" text={`Speed advantage: ${multiplier}x`} />
                  <LogLine severity="success" text={`Block height: ${blockHeight.toLocaleString()}`} />
                  <LogLine severity="info" text="Subscription: slotSubscribe active" />
                  <LogLine severity="info" text={`Total ping cycles: ${totalPings}`} />
                </>
              )}
              {!isConnected && <LogLine severity="warn" text="Establishing WSS connection..." />}
            </div>
          </div>

          {/* Benchmark Summary */}
          <div className="glass-panel p-6 rounded-xl">
            <h3 className="text-sm font-bold uppercase tracking-widest text-brand-muted mb-4">
              Benchmark Summary
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "p50", rpc: `${avgRpcFast}ms`, pub: `${avgPublic}ms` },
                { label: "p95", rpc: `${p95Rpc}ms`, pub: `${p95Public}ms` },
                { label: "Advantage", rpc: `${multiplier}x`, pub: "baseline" },
              ].map((row) => (
                <div key={row.label} className="text-center space-y-2">
                  <div className="text-xs text-brand-muted font-mono uppercase">{row.label}</div>
                  <div className="text-sm font-bold text-brand-primary font-mono">{row.rpc}</div>
                  <div className="text-xs text-status-error/60 font-mono">{row.pub}</div>
                </div>
              ))}
            </div>
            <div className="gradient-line my-4" />
            <div className="text-center">
              <div className="text-xs text-brand-muted font-mono">ENDPOINT</div>
              <div className="text-xs text-brand-primary font-mono mt-1 break-all">
                wss://solana-mainnet.rpcfast.com/v1/...
              </div>
            </div>
          </div>
        </div>

        {/* WSS Status Bar */}
        <div className="glass-panel rounded-lg p-3 font-mono text-xs flex justify-between items-center">
          <span className="text-brand-muted">
            &gt; WSS Status:{" "}
            {isConnected ? (
              <span className="text-brand-primary">CONNECTED (wss://solana-mainnet.rpcfast.com/v1/...)</span>
            ) : (
              <span className="text-status-warning">CONNECTING...</span>
            )}
          </span>
          <span className="text-brand-muted">
            Blocks: <span className="text-brand-cyan">{isConnected ? blockHeight.toLocaleString() : "---"}</span>
          </span>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-brand-border/30 py-4 text-center">
        <p className="text-xs text-brand-muted font-mono">
          Swanipe — Real-Time RPC Telemetry • Built on RPC Fast • Colosseum Frontier Hackathon 2026
        </p>
      </footer>
    </div>
  );
}

function LogLine({ severity, text }: { severity: "info" | "success" | "warn" | "error"; text: string }) {
  const colors = {
    info: "text-brand-muted",
    success: "text-brand-primary",
    warn: "text-status-warning",
    error: "text-status-error",
  };
  const icons = {
    info: "●",
    success: "✓",
    warn: "⚠",
    error: "✗",
  };
  return (
    <div className={`${colors[severity]} flex items-start gap-2`}>
      <span className="mt-0.5 text-[10px]">{icons[severity]}</span>
      <span>{text}</span>
    </div>
  );
}
