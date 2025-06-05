
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import EmailEditor from '@/components/EmailEditor';

// Mock AI services
vi.mock('@/services/EmailAIService', () => ({
  EmailAIService: {
    generateSuggestions: vi.fn().mockResolvedValue([
      { type: 'content', suggestion: 'Add a call-to-action button' },
      { type: 'design', suggestion: 'Use more contrasting colors' }
    ]),
    optimizeContent: vi.fn().mockResolvedValue('<p>Optimized content</p>')
  }
}));

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

describe('Email Editor AI Integration Tests', () => {
  const mockCallbacks = {
    onContentChange: vi.fn(),
    onSubjectChange: vi.fn(),
    onBack: vi.fn()
  };

  beforeEach(() => {
    Object.values(mockCallbacks).forEach(mock => mock.mockClear());
  });

  const defaultProps = {
    content: '<p>Test content</p>',
    subject: 'Test Email',
    ...mockCallbacks
  };

  it('should render AI suggestions component', () => {
    render(<EmailEditor {...defaultProps} />, { wrapper: createWrapper() });
    
    expect(screen.getByText(/Generate AI Suggestions/)).toBeInTheDocument();
  });

  it('should handle AI suggestion generation', async () => {
    render(<EmailEditor {...defaultProps} />, { wrapper: createWrapper() });
    
    const generateButton = screen.getByRole('button', { name: /generate ai suggestions/i });
    fireEvent.click(generateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Add a call-to-action button/)).toBeInTheDocument();
    });
  });

  it('should apply AI suggestions to content', async () => {
    render(<EmailEditor {...defaultProps} />, { wrapper: createWrapper() });
    
    const generateButton = screen.getByRole('button', { name: /generate ai suggestions/i });
    fireEvent.click(generateButton);
    
    await waitFor(() => {
      const applySuggestionButton = screen.getByRole('button', { name: /apply suggestion/i });
      fireEvent.click(applySuggestionButton);
      
      expect(mockCallbacks.onContentChange).toHaveBeenCalled();
    });
  });

  it('should handle AI optimization requests', async () => {
    render(<EmailEditor {...defaultProps} />, { wrapper: createWrapper() });
    
    const optimizeButton = screen.getByRole('button', { name: /optimize content/i });
    fireEvent.click(optimizeButton);
    
    await waitFor(() => {
      expect(mockCallbacks.onContentChange).toHaveBeenCalledWith('<p>Optimized content</p>');
    });
  });

  it('should show AI analytics when enabled', () => {
    const propsWithAnalytics = {
      ...defaultProps,
      showAIAnalytics: true
    };
    
    render(<EmailEditor {...propsWithAnalytics} />, { wrapper: createWrapper() });
    
    expect(screen.getByText(/AI Analytics/)).toBeInTheDocument();
  });

  it('should handle AI service errors gracefully', async () => {
    // Mock service error
    vi.mocked(require('@/services/EmailAIService').EmailAIService.generateSuggestions)
      .mockRejectedValueOnce(new Error('AI service unavailable'));
    
    render(<EmailEditor {...defaultProps} />, { wrapper: createWrapper() });
    
    const generateButton = screen.getByRole('button', { name: /generate ai suggestions/i });
    fireEvent.click(generateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Unable to generate suggestions/)).toBeInTheDocument();
    });
  });
});

describe('Email Editor Advanced Features Tests', () => {
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

  it('should handle snippet library integration', async () => {
    render(<EmailEditor {...defaultProps} />, { wrapper: createWrapper() });
    
    const snippetsButton = screen.getByRole('button', { name: /snippets/i });
    fireEvent.click(snippetsButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Snippet Library/)).toBeInTheDocument();
    });
  });

  it('should handle template import/export', async () => {
    render(<EmailEditor {...defaultProps} />, { wrapper: createWrapper() });
    
    const settingsButton = screen.getByRole('button', { name: /settings/i });
    fireEvent.click(settingsButton);
    
    const exportButton = screen.getByRole('button', { name: /export/i });
    fireEvent.click(exportButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Export Options/)).toBeInTheDocument();
    });
  });

  it('should handle accessibility features', () => {
    render(<EmailEditor {...defaultProps} />, { wrapper: createWrapper() });
    
    // Test keyboard navigation
    const canvas = screen.getByTestId('email-canvas');
    fireEvent.keyDown(canvas, { key: 'Tab' });
    
    // Should handle keyboard navigation gracefully
    expect(canvas).toBeInTheDocument();
  });

  it('should handle performance optimization for large emails', async () => {
    // Create props with large content
    const largeContent = Array(100).fill('<p>Large block content</p>').join('');
    const largeProps = {
      ...defaultProps,
      content: largeContent
    };
    
    render(<EmailEditor {...largeProps} />, { wrapper: createWrapper() });
    
    // Should render without crashing
    expect(screen.getByTestId('email-canvas')).toBeInTheDocument();
  });

  it('should handle variable insertion', async () => {
    render(<EmailEditor {...defaultProps} />, { wrapper: createWrapper() });
    
    // Add a text block
    const textButton = screen.getByRole('button', { name: /text/i });
    fireEvent.click(textButton);
    
    await waitFor(() => {
      const variableButton = screen.getByRole('button', { name: /add variable/i });
      fireEvent.click(variableButton);
      
      expect(screen.getByText(/Insert Variable/)).toBeInTheDocument();
    });
  });
});
