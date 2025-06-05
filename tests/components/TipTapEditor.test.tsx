
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SimpleTipTapEditor } from '@/components/SimpleTipTapEditor';

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

describe('TipTap Editor Critical Tests', () => {
  const mockOnChange = vi.fn();
  const mockOnBlur = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
    mockOnBlur.mockClear();
  });

  const defaultProps = {
    content: '<p>Initial content</p>',
    onChange: mockOnChange,
    onBlur: mockOnBlur
  };

  it('should initialize with provided content', () => {
    render(<SimpleTipTapEditor {...defaultProps} />, { wrapper: createWrapper() });
    
    expect(screen.getByText('Initial content')).toBeInTheDocument();
  });

  it('should render toolbar with formatting buttons', () => {
    render(<SimpleTipTapEditor {...defaultProps} />, { wrapper: createWrapper() });
    
    // Check for bold and italic buttons
    const boldButton = screen.getByRole('button', { name: /bold/i });
    const italicButton = screen.getByRole('button', { name: /italic/i });
    
    expect(boldButton).toBeInTheDocument();
    expect(italicButton).toBeInTheDocument();
  });

  it('should handle bold formatting', async () => {
    render(<SimpleTipTapEditor {...defaultProps} />, { wrapper: createWrapper() });
    
    const boldButton = screen.getByRole('button', { name: /bold/i });
    fireEvent.click(boldButton);
    
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalled();
    });
  });

  it('should handle italic formatting', async () => {
    render(<SimpleTipTapEditor {...defaultProps} />, { wrapper: createWrapper() });
    
    const italicButton = screen.getByRole('button', { name: /italic/i });
    fireEvent.click(italicButton);
    
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalled();
    });
  });

  it('should call onChange when content is modified', async () => {
    render(<SimpleTipTapEditor {...defaultProps} />, { wrapper: createWrapper() });
    
    const editor = screen.getByRole('textbox');
    fireEvent.input(editor, { target: { innerHTML: '<p>Modified content</p>' } });
    
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalled();
    });
  });

  it('should call onBlur when editor loses focus', async () => {
    render(<SimpleTipTapEditor {...defaultProps} />, { wrapper: createWrapper() });
    
    const editor = screen.getByRole('textbox');
    fireEvent.focus(editor);
    fireEvent.blur(editor);
    
    await waitFor(() => {
      expect(mockOnBlur).toHaveBeenCalled();
    });
  });

  it('should update content when props change', () => {
    const { rerender } = render(<SimpleTipTapEditor {...defaultProps} />, { wrapper: createWrapper() });
    
    rerender(<SimpleTipTapEditor {...defaultProps} content="<p>Updated content</p>" />);
    
    expect(screen.getByText('Updated content')).toBeInTheDocument();
  });

  it('should handle empty content gracefully', () => {
    render(<SimpleTipTapEditor {...defaultProps} content="" />, { wrapper: createWrapper() });
    
    const editor = screen.getByRole('textbox');
    expect(editor).toBeInTheDocument();
  });
});
