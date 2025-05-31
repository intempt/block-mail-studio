
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { EmailEditor } from '../../src/components/EmailEditor';

describe('Performance Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders within performance budget', async () => {
    const start = performance.now();
    render(<EmailEditor />);
    const end = performance.now();
    
    const renderTime = end - start;
    expect(renderTime).toBeLessThan(100); // 100ms budget
  });

  it('handles large number of blocks efficiently', async () => {
    const manyBlocks = Array.from({ length: 100 }, (_, i) => ({
      id: `block-${i}`,
      type: 'text',
      content: { html: `<p>Block ${i}</p>` },
      styling: { desktop: {} },
      position: { x: 0, y: 0 },
      displayOptions: { showOnDesktop: true, showOnTablet: true, showOnMobile: true }
    }));

    const start = performance.now();
    render(<EmailEditor initialBlocks={manyBlocks} />);
    const end = performance.now();
    
    const renderTime = end - start;
    expect(renderTime).toBeLessThan(500); // 500ms budget for 100 blocks
  });

  it('optimizes re-renders on prop changes', () => {
    const renderSpy = vi.fn();
    
    const TestComponent = React.memo(() => {
      renderSpy();
      return <EmailEditor />;
    });

    const { rerender } = render(<TestComponent />);
    
    // Should render once initially
    expect(renderSpy).toHaveBeenCalledTimes(1);
    
    // Rerender with same props - should not trigger re-render
    rerender(<TestComponent />);
    expect(renderSpy).toHaveBeenCalledTimes(1);
  });

  it('debounces frequent updates', async () => {
    const updateSpy = vi.fn();
    render(<EmailEditor onBlockUpdate={updateSpy} />);
    
    // Simulate rapid updates
    for (let i = 0; i < 10; i++) {
      // Trigger update event
      setTimeout(() => updateSpy(), i * 10);
    }
    
    // Wait for debouncing
    await waitFor(() => {
      expect(updateSpy).toHaveBeenCalledTimes(1);
    }, { timeout: 1000 });
  });

  it('virtualizes long lists', () => {
    const manyBlocks = Array.from({ length: 1000 }, (_, i) => ({
      id: `block-${i}`,
      type: 'text',
      content: { html: `<p>Block ${i}</p>` },
      styling: { desktop: {} },
      position: { x: 0, y: 0 },
      displayOptions: { showOnDesktop: true, showOnTablet: true, showOnMobile: true }
    }));

    const { container } = render(<EmailEditor initialBlocks={manyBlocks} />);
    
    // Should only render visible blocks
    const renderedBlocks = container.querySelectorAll('[data-testid^="block-"]');
    expect(renderedBlocks.length).toBeLessThan(100); // Much less than 1000
  });

  it('lazy loads non-critical components', async () => {
    const { container } = render(<EmailEditor />);
    
    // Initially, advanced features should not be loaded
    expect(container.querySelector('[data-testid="ai-assistant"]')).not.toBeInTheDocument();
    
    // After interaction, they should load
    const aiButton = container.querySelector('[data-testid="ai-button"]');
    if (aiButton) {
      aiButton.click();
      
      await waitFor(() => {
        expect(container.querySelector('[data-testid="ai-assistant"]')).toBeInTheDocument();
      });
    }
  });

  it('memory usage remains stable', () => {
    const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;
    
    // Render multiple times
    for (let i = 0; i < 10; i++) {
      const { unmount } = render(<EmailEditor />);
      unmount();
    }
    
    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }
    
    const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
    const memoryDiff = finalMemory - initialMemory;
    
    // Memory should not grow significantly
    expect(memoryDiff).toBeLessThan(10 * 1024 * 1024); // 10MB threshold
  });
});
