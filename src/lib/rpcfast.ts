import { Connection } from '@solana/web3.js';

export class RpcFastService {
  private publicConnection: Connection;
  private rpcFastConnection: Connection;

  constructor() {
    this.publicConnection = new Connection("https://api.mainnet-beta.solana.com", "processed");
    // Use env var or fallback to a standard fast proxy/demo endpoint for RPC Fast
    const rpcFastUrl = process.env.NEXT_PUBLIC_RPCFAST_URL || "https://solana-mainnet.rpcfast.com/v1/demo";
    this.rpcFastConnection = new Connection(rpcFastUrl, "processed");
  }

  private async pingConnection(conn: Connection): Promise<number> {
    const start = Date.now();
    try {
      await conn.getLatestBlockhash();
      return Date.now() - start;
    } catch (e) {
      console.warn("RPC ping failed", e);
      return 999;
    }
  }

  async getTelemetryMetrics(): Promise<{ rpcFast: number, publicNode: number }> {
    // Actually ping both connections concurrently to measure real latency
    const [rpcFastLatency, publicLatency] = await Promise.all([
      this.pingConnection(this.rpcFastConnection),
      this.pingConnection(this.publicConnection)
    ]);

    return {
      rpcFast: rpcFastLatency,
      publicNode: publicLatency
    };
  }
}

export const rpcFastService = new RpcFastService();

