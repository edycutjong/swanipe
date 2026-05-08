# Swanipe Demo Script

**Length:** 2:30

## Intro (0:00 - 0:30)
- **Visual**: Screen recording starts on the Swanipe landing page (`/`). The neon "Swanipe" title and scramble text effects are visible.
- **Action**: Hover over the terminal simulation to show the scanlines. 
- **Voiceover**: "Welcome to Swanipe, the premier telemetry and real-time latency dashboard for the Solana ecosystem. Built on RPC Fast for the Colosseum Frontier Hackathon 2026, Swanipe visually proves the performance delta between public endpoints and dedicated premium infrastructure."

## Dashboard & Telemetry (0:30 - 1:30)
- **Visual**: Click "Open Dashboard". The transition reveals the particle background and real-time dashboard.
- **Action**: 
  - Point out the status bar at the top (PINGS, WSS connection, BLOCK).
  - Highlight the "RPC Fast p50" metric card showing ~45ms.
  - Highlight the "Public RPC p50" metric card showing ~1,200ms.
  - Emphasize the "Speed Advantage" multiplier.
- **Voiceover**: "Once connected via WSS, Swanipe begins simulating concurrent ping comparisons. As you can see, the RPC Fast endpoint consistently stays under 50ms, giving a massive 26x advantage over the standard mainnet-beta endpoints which struggle under load."

## Visualization & Logs (1:30 - 2:00)
- **Visual**: Scroll down to the "Real-time Ping Comparison" chart and the "Latency Distribution" histogram.
- **Action**: 
  - Trace the real-time chart comparing the green bars (RPC Fast) against the red bars (Public RPC).
  - Check the Connection Log for handshake confirmations and active subscriptions.
- **Voiceover**: "The live chart visualizes this gap instantly. Our histogram shows that 100% of RPC Fast requests land in the sub-100ms bucket, while the public endpoint is heavily staggered. The Connection Log confirms our WebSocket subscription is healthy and streaming slots directly from the validator."

## Outro (2:00 - 2:30)
- **Visual**: Navigate to the About page (`/about`) and show the Benchmark Results table.
- **Action**: Highlight the 99.9% uptime and sub-50ms latency claims. Return to the landing page.
- **Voiceover**: "Whether you're building high-frequency trading bots or consumer apps, RPC performance is your bottleneck. Swanipe proves why you need premium infrastructure. Check out our GitHub for the source code, and try the live demo today. Thanks for watching."
