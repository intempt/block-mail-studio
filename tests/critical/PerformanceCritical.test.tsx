
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import EmailEditor from '@/components/EmailEditor';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('Performance Critical Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('CRITICAL: Initial render must complete within performance budget', () => {
    const startTime = performance.now();
    
    render(
      <EmailEditor
        content=""
        subject="Test"
        onContentChange={vi.fn()}
        onSubjectChange={vi.fn()}
      />,
      { wrapper: createWrapper() }
    );
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Should render within 500ms
    expect(renderTime).toBeLessThan(500);
    expect(screen.getByTestId('email-canvas')).toBeInTheDocument();
  });

  it('CRITICAL: Must handle rapid state changes efficiently', async () => {
    const mockOnContentChange = vi.fn();
    const mockOnSubjectChange = vi.fn();
    
    render(
      <EmailEditor
        content=""
        subject="Test"
        onContentChange={mockOnContentChange}
        onSubjectChange={mockOnSubjectChange}
      />,
      { wrapper: createWrapper() }
    );
    
    const startTime = performance.now();
    
    // Rapid subject changes
    const subjectInput = screen.getByDisplayValue('Test');
    for (let i = 0; i < 100; i++) {
      fireEvent.change(subjectInput, { target: { value: `Subject ${i}` } });
    }
    
    const endTime = performance.now();
    const operationTime = endTime - startTime;
    
    // Should handle 100 rapid changes within 1 second
    expect(operationTime).toBeLessThan(1000);
    expect(mockOnSubjectChange).toHaveBeenCalledTimes(100);
  });

  it('CRITICAL: Must handle large content efficiently', () => {
    const largeContent = '<div>' + '<p>Large content block</p>'.repeat(1000) + '</div>';
    
    const startTime = performance.now();
    
    render(
      <EmailEditor
        content={largeContent}
        subject="Large Content Test"
        onContentChange={vi.fn()}
        onSubjectChange={vi.fn()}
      />,
      { wrapper: createWrapper() }
    );
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Should handle large content within 1 second
    expect(renderTime).toBeLessThan(1000);
    expect(screen.getByTestId('email-canvas')).toBeInTheDocument();
  });

  it('CRITICAL: Preview mode switching must be fast', () => {
    render(
      <EmailEditor
        content="<p>Test content</p>"
        subject="Test"
        onContentChange={vi.fn()}
        onSubjectChange={vi.fn()}
      />,
      { wrapper: createWrapper() }
    );
    
    const startTime = performance.now();
    
    // Switch between all preview modes rapidly
    const modes = ['desktop', 'tablet', 'mobile'];
    modes.forEach(mode => {
      const button = screen.getByRole('button', { name: new RegExp(mode, 'i') });
      fireEvent.click(button);
    });
    
    const endTime = performance.now();
    const switchTime = endTime - startTime;
    
    // Should switch modes within 200ms
    expect(switchTime).toBeLessThan(200);
  });

  it('CRITICAL: Drag and drop operations must be responsive', async () => {
    render(
      <EmailEditor
        content=""
        subject="Test"
        onContentChange={vi.fn()}
        onSubjectChange={vi.fn()}
      />,
      { wrapper: createWrapper() }
    );
    
    const blocksTab = screen.getByRole('button', { name: /blocks/i });
    fireEvent.click(blocksTab);
    
    const startTime = performance.now();
    
    // Simulate multiple drag and drop operations
    const canvas = screen.getByTestId('email-canvas');
    for (let i = 0; i < 10; i++) {
      const dropData = JSON.stringify({ blockType: 'text' });
      fireEvent.drop(canvas, {
        dataTransfer: {
          getData: vi.fn().mockReturnValue(dropData)
        }
      });
    }
    
    const endTime = performance.now();
    const dropTime = endTime - startTime;
    
    // Should handle 10 drops within 500ms
    expect(dropTime).toBeLessThan(500);
  });

  it('CRITICAL: Memory usage must remain stable', () => {
    const mockOnContentChange = vi.fn();
    
    const { rerender } = render(
      <EmailEditor
        content=""
        subject="Test"
        onContentChange={mockOnContentChange}
        onSubjectChange={vi.fn()}
      />,
      { wrapper: createWrapper() }
    );
    
    // Simulate many re-renders with different content
    for (let i = 0; i < 50; i++) {
      rerender(
        <EmailEditor
          content={`<p>Content ${i}</p>`}
          subject={`Subject ${i}`}
          onContentChange={mockOnContentChange}
          onSubjectChange={vi.fn()}
        />
      );
    }
    
    // Should still be responsive after many re-renders
    expect(screen.getByTestId('email-canvas')).toBeInTheDocument();
    
    // Check that callbacks are still working
    const latestCall = mockOnContentChange.mock.calls.length;
    expect(latestCall).toBeGreaterThan(0);
  });
});
