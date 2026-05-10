import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Connection } from '@solana/web3.js';
import { RpcFastService, rpcFastService } from './rpcfast';

// Mock Solana Connection
const mocks = vi.hoisted(() => ({
  mockGetLatestBlockhash: vi.fn()
}));

vi.mock('@solana/web3.js', () => {
  return {
    Connection: vi.fn(function() {
      return {
        getLatestBlockhash: mocks.mockGetLatestBlockhash
      };
    }),
  };
});

describe('RpcFastService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.mockGetLatestBlockhash.mockReset();
    vi.spyOn(console, 'warn').mockImplementation(() => {}); // Suppress console.warn during tests
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('initialization', () => {
    it('should initialize with default RPC Fast URL', () => {
      delete process.env.NEXT_PUBLIC_RPCFAST_URL;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _service = new RpcFastService();
      
      expect(Connection).toHaveBeenCalledTimes(2);
      expect(Connection).toHaveBeenNthCalledWith(1, 'https://api.mainnet-beta.solana.com', 'processed');
      expect(Connection).toHaveBeenNthCalledWith(2, 'https://solana-mainnet.rpcfast.com/v1/demo', 'processed');
    });

    it('should initialize with NEXT_PUBLIC_RPCFAST_URL if provided', () => {
      process.env.NEXT_PUBLIC_RPCFAST_URL = 'https://custom-rpc.fast';
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _service = new RpcFastService();
      
      expect(Connection).toHaveBeenCalledTimes(2);
      expect(Connection).toHaveBeenNthCalledWith(2, 'https://custom-rpc.fast', 'processed');
      delete process.env.NEXT_PUBLIC_RPCFAST_URL;
    });
  });

  describe('getTelemetryMetrics', () => {
    it('should return valid latencies when both connections succeed', async () => {
      mocks.mockGetLatestBlockhash.mockResolvedValue({ blockhash: 'test' });
      
      const service = new RpcFastService();
      const metrics = await service.getTelemetryMetrics();

      expect(mocks.mockGetLatestBlockhash).toHaveBeenCalledTimes(2);
      expect(metrics.rpcFast).toBeGreaterThanOrEqual(0);
      expect(metrics.rpcFast).toBeLessThan(100);
      expect(metrics.publicNode).toBeGreaterThanOrEqual(0);
      expect(metrics.publicNode).toBeLessThan(100);
    });

    it('should return 999 for publicNode if it fails', async () => {
      mocks.mockGetLatestBlockhash
        .mockResolvedValueOnce({ blockhash: 'test' }) // For rpcFastConnection
        .mockRejectedValueOnce(new Error('timeout')); // For publicConnection
        
      const service = new RpcFastService();
      const metrics = await service.getTelemetryMetrics();

      expect(metrics.rpcFast).toBeGreaterThanOrEqual(0);
      expect(metrics.publicNode).toBe(999);
      expect(console.warn).toHaveBeenCalledWith("RPC ping failed", expect.any(Error));
    });

    it('should return 999 for both if both fail', async () => {
      mocks.mockGetLatestBlockhash.mockRejectedValue(new Error('timeout'));
      
      const service = new RpcFastService();
      const metrics = await service.getTelemetryMetrics();

      expect(metrics.rpcFast).toBe(999);
      expect(metrics.publicNode).toBe(999);
      expect(console.warn).toHaveBeenCalledTimes(2);
    });
  });

  describe('singleton export', () => {
    it('should export an instance of RpcFastService', () => {
      expect(rpcFastService).toBeInstanceOf(RpcFastService);
    });
  });
});
