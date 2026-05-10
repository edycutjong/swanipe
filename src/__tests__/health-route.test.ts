import { describe, it, expect, vi } from 'vitest';

// next/server's NextResponse.json is a thin wrapper around the platform Response.
// Provide a minimal shim so the route module loads in jsdom/Node.
vi.mock('next/server', () => ({
  NextResponse: {
    json: (body: unknown, init?: ResponseInit) =>
      new Response(JSON.stringify(body), {
        ...init,
        headers: { 'Content-Type': 'application/json' },
      }),
  },
}));

// Import after mock is registered
import { GET } from '@/app/api/health/route';

describe('GET /api/health', () => {
  it('returns HTTP 200 with status ok', async () => {
    const response = await GET();
    expect(response.status).toBe(200);
  });

  it('response body contains required fields', async () => {
    const response = await GET();
    const data = await response.json();
    expect(data.status).toBe('ok');
    expect(typeof data.timestamp).toBe('string');
    expect(typeof data.uptime).toBe('number');
  });

  it('timestamp is a valid ISO date string', async () => {
    const response = await GET();
    const { timestamp } = await response.json();
    expect(new Date(timestamp).toISOString()).toBe(timestamp);
  });
});
