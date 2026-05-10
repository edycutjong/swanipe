import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { AnimatedCounter } from '@/components/AnimatedCounter';

// Stub rAF so the animation loop is registered but never fires.
// The counter renders at its initial value (0), which is enough to verify
// that prefix, suffix, and decimal formatting are applied correctly.
beforeEach(() => {
  vi.stubGlobal('requestAnimationFrame', vi.fn().mockReturnValue(0));
  vi.stubGlobal('cancelAnimationFrame', vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('AnimatedCounter', () => {
  it('renders with a suffix', () => {
    render(<AnimatedCounter target={45} suffix="ms" />);
    expect(screen.getByText(/ms$/)).toBeTruthy();
  });

  it('renders with prefix and suffix', () => {
    render(<AnimatedCounter target={99} prefix="~" suffix="%" />);
    // Rendered text starts with prefix and ends with suffix
    const el = screen.getByText(/^~.*%$/);
    expect(el).toBeTruthy();
  });

  it('respects the decimals prop — shows correct decimal places', () => {
    render(<AnimatedCounter target={26.7} decimals={1} suffix="x" />);
    // The counter starts at 0 → rendered as "0.0x"
    expect(screen.getByText(/\d+\.\dx$/)).toBeTruthy();
  });

  it('renders with no suffix or prefix when omitted', () => {
    render(<AnimatedCounter target={100} />);
    // Should still render a numeric string
    expect(screen.getByText(/^\d+$/)).toBeTruthy();
  });

  it('animates to the target value', async () => {
    let rafCallback: FrameRequestCallback = () => {};
    vi.stubGlobal('requestAnimationFrame', vi.fn((cb: FrameRequestCallback) => {
      rafCallback = cb;
      return 1;
    }));

    render(<AnimatedCounter target={100} duration={1000} />);
    
    // Trigger first frame to set start time
    await act(async () => {
      rafCallback(100);
    });

    // Trigger middle frame
    await act(async () => {
      rafCallback(600); // 50% progress -> eased value
    });
    
    // progress = (600 - 100) / 1000 = 0.5
    // eased = 1 - (1 - 0.5)^3 = 0.875
    // current = 87.5
    expect(screen.getByText('88')).toBeTruthy();

    // Trigger final frame
    await act(async () => {
      rafCallback(1100);
    });
    expect(screen.getByText('100')).toBeTruthy();
  });

  it('clears animation frame on unmount', () => {
    const cancelMock = vi.fn();
    vi.stubGlobal('cancelAnimationFrame', cancelMock);
    const { unmount } = render(<AnimatedCounter target={100} />);
    unmount();
    expect(cancelMock).toHaveBeenCalled();
  });
});
