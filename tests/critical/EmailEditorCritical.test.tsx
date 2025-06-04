
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

describe('EmailEditor Critical Tests', () => {
  const mockOnContentChange = vi.fn();
  const mockOnSubjectChange = vi.fn();
  const mockOnBack = vi.fn();

  beforeEach(() => {
    mockOnContentChange.mockClear();
    mockOnSubjectChange.mockClear();
    mockOnBack.mockClear();
  });

  const defaultProps = {
    content: '<p>Test content</p>',
    subject: 'Test Subject',
    onContentChange: mockOnContentChange,
    onSubjectChange: mockOnSubjectChange,
    onBack: mockOnBack
  };

  it('CRITICAL: Must render without crashing', () => {
    expect(() => {
      render(<EmailEditor {...defaultProps} />, { wrapper: createWrapper() });
    }).not.toThrow();
  });

  it('CRITICAL: Must handle subject line changes immediately', async () => {
    render(<EmailEditor {...defaultProps} />, { wrapper: createWrapper() });
    
    const subjectInput = screen.getByDisplayValue('Test Subject');
    fireEvent.change(subjectInput, { target: { value: 'New Subject' } });
    
    expect(mockOnSubjectChange).toHaveBeenCalledWith('New Subject');
  });

  it('CRITICAL: Must display canvas without errors', () => {
    render(<EmailEditor {...defaultProps} />, { wrapper: createWrapper() });
    
    expect(screen.getByTestId('email-canvas')).toBeInTheDocument();
  });

  it('CRITICAL: Must handle view mode switching', () => {
    render(<EmailEditor {...defaultProps} />, { wrapper: createWrapper() });
    
    const previewButton = screen.getByRole('button', { name: /preview/i });
    fireEvent.click(previewButton);
    
    // Should switch to preview mode
    expect(screen.getByText(/preview/i)).toBeInTheDocument();
  });

  it('CRITICAL: Must preserve content when switching modes', async () => {
    const { rerender } = render(<EmailEditor {...defaultProps} />, { wrapper: createWrapper() });
    
    // Change to mobile view
    const mobileButton = screen.getByRole('button', { name: /mobile/i });
    fireEvent.click(mobileButton);
    
    // Content should remain
    rerender(<EmailEditor {...defaultProps} content="<p>Updated content</p>" />, { wrapper: createWrapper() });
    
    expect(mockOnContentChange).toHaveBeenCalled();
  });

  it('CRITICAL: Must handle empty content gracefully', () => {
    render(<EmailEditor {...defaultProps} content="" />, { wrapper: createWrapper() });
    
    expect(screen.getByText(/Ready to build!/)).toBeInTheDocument();
  });

  it('CRITICAL: Must handle malformed HTML content', () => {
    const malformedContent = '<div><p>Unclosed tags<span>';
    
    expect(() => {
      render(<EmailEditor {...defaultProps} content={malformedContent} />, { wrapper: createWrapper() });
    }).not.toThrow();
  });

  it('CRITICAL: Must respond to device width changes', () => {
    render(<EmailEditor {...defaultProps} />, { wrapper: createWrapper() });
    
    const canvas = screen.getByTestId('email-canvas');
    const tabletButton = screen.getByRole('button', { name: /tablet/i });
    
    fireEvent.click(tabletButton);
    
    expect(canvas).toHaveStyle({ maxWidth: '768px' });
  });
});
