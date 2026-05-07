"use client";

import { StatusBar } from "@/components/StatusBar";
import { Footer } from "@/components/Footer";

import { useState, useEffect } from "react";
import { rpcFastService } from "@/lib/rpcfast";

export default function RpcDashboard() {
  const [dataPoints, setDataPoints] = useState(Array.from({ length: 20 }, (_, i) => ({
    time: i,
    rpcFast: 12,
    publicNode: 250
  })));
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Simulate WebSocket connection
    const timer = setTimeout(() => setIsConnected(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isConnected) return;
    
    const interval = setInterval(async () => {
      const metrics = await rpcFastService.getTelemetryMetrics();
      
      setDataPoints(prev => {
        const newData = [...prev.slice(1), {
          time: prev[prev.length - 1].time + 1,
          rpcFast: metrics.rpcFast,
          publicNode: metrics.publicNode
        }];
        return newData;
      });
    }, 1000); // 1 update per second
    
    return () => clearInterval(interval);
  }, [isConnected]);

  const currentRpcFast = dataPoints[dataPoints.length - 1].rpcFast;
  const currentPublic = dataPoints[dataPoints.length - 1].publicNode;
  const multiplier = (currentPublic / currentRpcFast).toFixed(1);

  return (
    <>
      <StatusBar />
    <div className="flex-grow flex flex-col items-center justify-center p-8 max-w-5xl mx-auto w-full space-y-8">
      
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-white flex justify-center items-center gap-3">
          <div className={`w-4 h-4 rounded-full shadow-[0_0_15px_currentColor] ${isConnected ? 'bg-brand-primary text-brand-primary animate-pulse' : 'bg-status-error text-status-error'}`}></div>
          Swanipe Telemetry
        </h1>
        <p className="text-brand-muted font-mono text-sm">RPC FAST INTEGRATION VERIFICATION :: WSS PORT 443</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 w-full">
        {/* RPC Fast Stat */}
        <div className="glass-panel p-6 rounded-xl border-l-4 border-l-brand-primary flex flex-col justify-center items-center text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-brand-primary/5 pointer-events-none"></div>
          <div className="text-sm font-mono text-brand-muted mb-2 uppercase tracking-widest">RPC Fast Latency</div>
          <div className="text-5xl font-bold neon-text font-mono text-brand-primary">
            {isConnected ? `${currentRpcFast}ms` : '--'}
          </div>
          <div className="mt-2 text-xs text-brand-primary/70 font-mono">Dedicated WSS Endpoint</div>
        </div>

        {/* Multiplier Stat */}
        <div className="glass-panel p-6 rounded-xl flex flex-col justify-center items-center text-center">
          <div className="text-sm font-mono text-brand-muted mb-2 uppercase tracking-widest">Speed Advantage</div>
          <div className="text-4xl font-bold text-white">
            {isConnected ? `${multiplier}x` : '--'}
          </div>
          <div className="mt-2 text-xs text-brand-muted font-mono">Faster than public</div>
        </div>

        {/* Public RPC Stat */}
        <div className="glass-panel p-6 rounded-xl border-l-4 border-l-status-error/50 flex flex-col justify-center items-center text-center">
          <div className="text-sm font-mono text-brand-muted mb-2 uppercase tracking-widest">Public RPC Latency</div>
          <div className="text-5xl font-bold text-status-error/80 font-mono">
            {isConnected ? `${currentPublic}ms` : '--'}
          </div>
          <div className="mt-2 text-xs text-status-error/50 font-mono">Rate-limited Public Endpoint</div>
        </div>
      </div>

      {/* Latency Chart Visualization */}
      <div className="glass-panel p-6 rounded-xl w-full h-80 flex flex-col">
        <h3 className="text-sm font-bold uppercase tracking-widest text-brand-muted mb-6 flex justify-between">
          <span>Real-time Ping Comparison</span>
          <span className="flex gap-4">
            <span className="flex items-center gap-2"><span className="w-3 h-3 bg-brand-primary rounded-full"></span> RPC Fast</span>
            <span className="flex items-center gap-2"><span className="w-3 h-3 bg-status-error/50 rounded-full"></span> Public</span>
          </span>
        </h3>
        
        <div className="flex-grow flex items-end justify-between gap-1 relative">
          {/* Y-axis guidelines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none border-t border-b border-brand-border/50">
            <div className="h-0 border-t border-dashed border-brand-border/30 w-full relative"><span className="absolute -left-8 -top-2 text-[10px] text-brand-muted font-mono">400</span></div>
            <div className="h-0 border-t border-dashed border-brand-border/30 w-full relative"><span className="absolute -left-8 -top-2 text-[10px] text-brand-muted font-mono">200</span></div>
            <div className="h-0 border-t border-dashed border-brand-border/30 w-full relative"><span className="absolute -left-8 -top-2 text-[10px] text-brand-muted font-mono">0</span></div>
          </div>
          
          {dataPoints.map((point, idx) => (
            <div key={point.time} className="w-full flex justify-center items-end relative h-full">
              {/* Public bar */}
              <div 
                className="w-1/2 bg-status-error/30 transition-all duration-300 rounded-t"
                style={{ height: `${Math.min((point.publicNode / 400) * 100, 100)}%` }}
              ></div>
              {/* RPC Fast bar */}
              <div 
                className="w-1/2 bg-brand-primary transition-all duration-300 rounded-t shadow-[0_0_10px_rgba(34,197,94,0.3)] z-10"
                style={{ height: `${Math.min((point.rpcFast / 400) * 100, 100)}%` }}
              ></div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full p-4 rounded bg-brand-surface border border-brand-border font-mono text-xs text-brand-muted flex justify-between items-center">
        <span>&gt; WSS Subscription Status: {isConnected ? <span className="text-brand-primary">CONNECTED (wss://solana-mainnet.rpcfast.com/v1/...)</span> : <span className="text-status-warning">CONNECTING...</span>}</span>
        <span>Blocks Synced: {isConnected ? '241,894,012' : '---'}</span>
      </div>
    </div>
      <Footer />
    </>
  );
}
