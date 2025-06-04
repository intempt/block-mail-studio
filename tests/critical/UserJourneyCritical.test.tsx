
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

describe('User Journey Critical Tests', () => {
  const mockOnContentChange = vi.fn();
  const mockOnSubjectChange = vi.fn();

  beforeEach(() => {
    mockOnContentChange.mockClear();
    mockOnSubjectChange.mockClear();
  });

  const defaultProps = {
    content: '',
    subject: 'Test Email',
    onContentChange: mockOnContentChange,
    onSubjectChange: mockOnSubjectChange
  };

  it('CRITICAL: Complete user journey - create email from scratch', async () => {
    render(<EmailEditor {...defaultProps} />, { wrapper: createWrapper() });
    
    // 1. User enters subject line
    const subjectInput = screen.getByDisplayValue('Test Email');
    fireEvent.change(subjectInput, { target: { value: 'Welcome Newsletter' } });
    expect(mockOnSubjectChange).toHaveBeenCalledWith('Welcome Newsletter');

    // 2. User adds a layout
    const layoutsTab = screen.getByRole('button', { name: /layouts/i });
    fireEvent.click(layoutsTab);
    
    const oneColumnLayout = screen.getByText(/1 column/i);
    fireEvent.click(oneColumnLayout);
    
    await waitFor(() => {
      expect(mockOnContentChange).toHaveBeenCalled();
    });

    // 3. User adds blocks
    const blocksTab = screen.getByRole('button', { name: /blocks/i });
    fireEvent.click(blocksTab);
    
    const textBlock = screen.getByText(/text/i);
    fireEvent.click(textBlock);
    
    await waitFor(() => {
      expect(mockOnContentChange).toHaveBeenCalledTimes(2);
    });
  });

  it('CRITICAL: User journey - switch between preview modes', () => {
    render(<EmailEditor {...defaultProps} />, { wrapper: createWrapper() });
    
    // Start in desktop mode
    const canvas = screen.getByTestId('email-canvas');
    expect(canvas).toHaveStyle({ maxWidth: '1200px' });
    
    // Switch to mobile
    const mobileButton = screen.getByRole('button', { name: /mobile/i });
    fireEvent.click(mobileButton);
    expect(canvas).toHaveStyle({ maxWidth: '375px' });
    
    // Switch to tablet
    const tabletButton = screen.getByRole('button', { name: /tablet/i });
    fireEvent.click(tabletButton);
    expect(canvas).toHaveStyle({ maxWidth: '768px' });
    
    // Back to desktop
    const desktopButton = screen.getByRole('button', { name: /desktop/i });
    fireEvent.click(desktopButton);
    expect(canvas).toHaveStyle({ maxWidth: '1200px' });
  });

  it('CRITICAL: User journey - save and preview email', async () => {
    render(<EmailEditor {...defaultProps} />, { wrapper: createWrapper() });
    
    // Add some content first
    const blocksTab = screen.getByRole('button', { name: /blocks/i });
    fireEvent.click(blocksTab);
    fireEvent.click(screen.getByText(/text/i));
    
    await waitFor(() => {
      expect(mockOnContentChange).toHaveBeenCalled();
    });
    
    // Preview the email
    const previewButton = screen.getByRole('button', { name: /preview/i });
    fireEvent.click(previewButton);
    
    // Should show preview mode
    expect(screen.getByText(/preview/i)).toBeInTheDocument();
  });

  it('CRITICAL: User journey - handle errors gracefully', () => {
    // Test with problematic data
    const problematicProps = {
      ...defaultProps,
      content: '<div><script>alert("xss")</script></div>',
      subject: ''
    };
    
    expect(() => {
      render(<EmailEditor {...problematicProps} />, { wrapper: createWrapper() });
    }).not.toThrow();
    
    // Should still render canvas
    expect(screen.getByTestId('email-canvas')).toBeInTheDocument();
  });

  it('CRITICAL: User journey - rapid interactions', async () => {
    render(<EmailEditor {...defaultProps} />, { wrapper: createWrapper() });
    
    // Rapid clicking between tabs
    const layoutsTab = screen.getByRole('button', { name: /layouts/i });
    const blocksTab = screen.getByRole('button', { name: /blocks/i });
    
    for (let i = 0; i < 5; i++) {
      fireEvent.click(layoutsTab);
      fireEvent.click(blocksTab);
    }
    
    // Should not crash
    expect(screen.getByTestId('email-canvas')).toBeInTheDocument();
  });
});
