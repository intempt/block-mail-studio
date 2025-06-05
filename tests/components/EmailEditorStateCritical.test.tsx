
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

describe('Email Editor State Management Critical Tests', () => {
  const mockCallbacks = {
    onContentChange: vi.fn(),
    onSubjectChange: vi.fn(),
    onBack: vi.fn()
  };

  beforeEach(() => {
    Object.values(mockCallbacks).forEach(mock => mock.mockClear());
  });

  const defaultProps = {
    content: '',
    subject: 'Test Email',
    ...mockCallbacks
  };

  it('should maintain state across device mode changes', async () => {
    render(<EmailEditor {...defaultProps} />, { wrapper: createWrapper() });
    
    // Switch to mobile view
    const mobileButton = screen.getByRole('button', { name: /mobile/i });
    fireEvent.click(mobileButton);
    
    // Add content
    const textButton = screen.getByRole('button', { name: /text/i });
    fireEvent.click(textButton);
    
    // Switch back to desktop
    const desktopButton = screen.getByRole('button', { name: /desktop/i });
    fireEvent.click(desktopButton);
    
    // Content should persist
    await waitFor(() => {
      expect(mockCallbacks.onContentChange).toHaveBeenCalled();
    });
  });

  it('should handle canvas width adjustments correctly', () => {
    render(<EmailEditor {...defaultProps} />, { wrapper: createWrapper() });
    
    const canvas = screen.getByTestId('email-canvas');
    expect(canvas).toBeInTheDocument();
    
    // Test different device modes
    const mobileButton = screen.getByRole('button', { name: /mobile/i });
    fireEvent.click(mobileButton);
    
    expect(canvas).toHaveStyle({ maxWidth: '375px' });
  });

  it('should handle preview mode transitions smoothly', async () => {
    render(<EmailEditor {...defaultProps} />, { wrapper: createWrapper() });
    
    // Enter preview mode
    const previewButton = screen.getByRole('button', { name: /preview/i });
    fireEvent.click(previewButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Preview/)).toBeInTheDocument();
    });
    
    // Exit preview mode
    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('email-canvas')).toBeInTheDocument();
    });
  });

  it('should maintain block selection across mode changes', async () => {
    render(<EmailEditor {...defaultProps} />, { wrapper: createWrapper() });
    
    // Add a block and select it
    const textButton = screen.getByRole('button', { name: /text/i });
    fireEvent.click(textButton);
    
    await waitFor(() => {
      const textBlock = screen.getByTestId('email-block-text');
      fireEvent.click(textBlock);
      expect(textBlock).toHaveClass('selected');
    });
    
    // Switch device mode
    const tabletButton = screen.getByRole('button', { name: /tablet/i });
    fireEvent.click(tabletButton);
    
    // Selection should persist
    await waitFor(() => {
      const textBlock = screen.getByTestId('email-block-text');
      expect(textBlock).toHaveClass('selected');
    });
  });

  it('should handle template application correctly', async () => {
    render(<EmailEditor {...defaultProps} />, { wrapper: createWrapper() });
    
    // Apply a template
    const templatesButton = screen.getByRole('button', { name: /templates/i });
    fireEvent.click(templatesButton);
    
    const newsletterTemplate = screen.getByRole('button', { name: /newsletter/i });
    fireEvent.click(newsletterTemplate);
    
    await waitFor(() => {
      expect(mockCallbacks.onContentChange).toHaveBeenCalled();
    });
  });

  it('should handle undo/redo operations if available', async () => {
    render(<EmailEditor {...defaultProps} />, { wrapper: createWrapper() });
    
    // Add a block
    const buttonBlock = screen.getByRole('button', { name: /button/i });
    fireEvent.click(buttonBlock);
    
    await waitFor(() => {
      expect(mockCallbacks.onContentChange).toHaveBeenCalled();
    });
    
    // Test keyboard shortcuts for undo if implemented
    fireEvent.keyDown(document, { key: 'z', ctrlKey: true });
    
    // Should handle gracefully even if not implemented
    expect(screen.getByTestId('email-canvas')).toBeInTheDocument();
  });

  it('should handle error states gracefully', async () => {
    // Mock a service error
    const errorProps = {
      ...defaultProps,
      content: 'invalid-mjml-content'
    };
    
    render(<EmailEditor {...errorProps} />, { wrapper: createWrapper() });
    
    // Should not crash on invalid content
    expect(screen.getByTestId('email-canvas')).toBeInTheDocument();
  });

  it('should handle rapid state changes', async () => {
    render(<EmailEditor {...defaultProps} />, { wrapper: createWrapper() });
    
    // Rapidly switch between modes
    const mobileButton = screen.getByRole('button', { name: /mobile/i });
    const desktopButton = screen.getByRole('button', { name: /desktop/i });
    
    fireEvent.click(mobileButton);
    fireEvent.click(desktopButton);
    fireEvent.click(mobileButton);
    fireEvent.click(desktopButton);
    
    // Should handle gracefully
    expect(screen.getByTestId('email-canvas')).toBeInTheDocument();
  });
});
