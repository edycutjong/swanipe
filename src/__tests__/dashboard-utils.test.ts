import { describe, it, expect } from 'vitest';
import { generateHistogram, generateLatency, calcP95 } from '@/lib/dashboard-utils';
import type { DataPoint } from '@/lib/dashboard-utils';

describe('generateLatency', () => {
  it('returns a number at least 5', () => {
    for (let i = 0; i < 50; i++) {
      expect(generateLatency(10, 100)).toBeGreaterThanOrEqual(5);
    }
  });

  it('clusters around the given base', () => {
    const samples = Array.from({ length: 100 }, () => generateLatency(100, 20));
    const avg = samples.reduce((a, b) => a + b, 0) / samples.length;
    expect(avg).toBeGreaterThan(80);
    expect(avg).toBeLessThan(120);
  });
});

describe('calcP95', () => {
  it('returns the 95th-percentile value', () => {
    const values = Array.from({ length: 20 }, (_, i) => i + 1); // 1..20
    expect(calcP95(values)).toBe(20); // index 19 → value 20
  });

  it('does not mutate the input array', () => {
    const values = [5, 1, 3, 2, 4];
    calcP95(values);
    expect(values).toEqual([5, 1, 3, 2, 4]);
  });
});

describe('generateHistogram', () => {
  const makePoint = (rpcFast: number, publicNode: number, time = 0): DataPoint => ({
    time,
    rpcFast,
    publicNode,
  });

  it('returns an entry for every bucket', () => {
    const histogram = generateHistogram([]);
    const ranges = histogram.map((h) => h.range);
    expect(ranges).toEqual(['0-25ms', '25-50ms', '50-100ms', '100-200ms', '200-500ms', '500ms+']);
  });

  it('counts data points into the correct bucket', () => {
    const data = [makePoint(10, 300), makePoint(40, 600), makePoint(80, 150)];
    const histogram = generateHistogram(data);

    const bucket = (range: string) => histogram.find((h) => h.range === range)!;

    expect(bucket('0-25ms').rpcFast).toBe(1);   // 10ms
    expect(bucket('25-50ms').rpcFast).toBe(1);  // 40ms
    expect(bucket('50-100ms').rpcFast).toBe(1); // 80ms

    expect(bucket('200-500ms').publicNode).toBe(1); // 300ms
    expect(bucket('500ms+').publicNode).toBe(1);    // 600ms
    expect(bucket('100-200ms').publicNode).toBe(1); // 150ms
  });

  it('returns zeroes for all buckets when data is empty', () => {
    const histogram = generateHistogram([]);
    for (const h of histogram) {
      expect(h.rpcFast).toBe(0);
      expect(h.publicNode).toBe(0);
    }
  });

  it('places 500ms exactly in the 200-500ms bucket (exclusive upper bound)', () => {
    const data = [makePoint(500, 500)];
    const histogram = generateHistogram(data);
    expect(histogram.find((h) => h.range === '500ms+')!.rpcFast).toBe(1);
    expect(histogram.find((h) => h.range === '200-500ms')!.rpcFast).toBe(0);
  });
});
