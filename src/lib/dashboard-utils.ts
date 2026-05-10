export interface DataPoint {
  time: number;
  rpcFast: number;
  publicNode: number;
}

export interface HistogramEntry {
  range: string;
  rpcFast: number;
  publicNode: number;
}

const HISTOGRAM_BUCKETS = [
  { range: "0-25ms", min: 0, max: 25 },
  { range: "25-50ms", min: 25, max: 50 },
  { range: "50-100ms", min: 50, max: 100 },
  { range: "100-200ms", min: 100, max: 200 },
  { range: "200-500ms", min: 200, max: 500 },
  { range: "500ms+", min: 500, max: Infinity },
];

export function generateHistogram(data: DataPoint[]): HistogramEntry[] {
  return HISTOGRAM_BUCKETS.map((b) => ({
    range: b.range,
    rpcFast: data.filter((d) => d.rpcFast >= b.min && d.rpcFast < b.max).length,
    publicNode: data.filter((d) => d.publicNode >= b.min && d.publicNode < b.max).length,
  }));
}

export function generateLatency(base: number, variance: number): number {
  return Math.max(5, Math.round(base + (Math.random() - 0.5) * variance));
}

export function calcP95(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length * 0.95)];
}
