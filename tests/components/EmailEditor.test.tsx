
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

describe('EmailEditor', () => {
  const mockOnContentChange = vi.fn();
  const mockOnSubjectChange = vi.fn();
  const mockOnBack = vi.fn();

  beforeEach(() => {
    mockOnContentChange.mockClear();
    mockOnSubjectChange.mockClear();
    mockOnBack.mockClear();
  });

  const defaultProps = {
    content: '',
    subject: 'Test Email',
    onContentChange: mockOnContentChange,
    onSubjectChange: mockOnSubjectChange,
    onBack: mockOnBack
  };

  it('should render email editor with all main components', () => {
    render(<EmailEditor {...defaultProps} />, { wrapper: createWrapper() });
    
    // Check for main UI elements
    expect(screen.getByText('Test Email')).toBeInTheDocument();
    expect(screen.getByText(/Email Canvas/)).toBeInTheDocument();
    expect(screen.getByText(/Ready to build!/)).toBeInTheDocument();
  });

  it('should handle subject line changes', async () => {
    render(<EmailEditor {...defaultProps} />, { wrapper: createWrapper() });
    
    const subjectInput = screen.getByDisplayValue('Test Email');
    fireEvent.change(subjectInput, { target: { value: 'Updated Subject' } });
    
    await waitFor(() => {
      expect(mockOnSubjectChange).toHaveBeenCalledWith('Updated Subject');
    });
  });

  it('should render OmnipresentRibbon with correct props', () => {
    render(<EmailEditor {...defaultProps} />, { wrapper: createWrapper() });
    
    // Check for toolbar elements
    expect(screen.getByRole('button', { name: /layouts/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /blocks/i })).toBeInTheDocument();
  });

  it('should handle canvas width and device mode changes', () => {
    render(<EmailEditor {...defaultProps} />, { wrapper: createWrapper() });
    
    // Test device mode buttons
    const mobileButton = screen.getByRole('button', { name: /mobile/i });
    fireEvent.click(mobileButton);
    
    // Canvas should adapt to mobile view
    expect(screen.getByTestId('email-canvas')).toBeInTheDocument();
  });

  it('should handle preview mode switching', () => {
    render(<EmailEditor {...defaultProps} />, { wrapper: createWrapper() });
    
    const previewButton = screen.getByRole('button', { name: /preview/i });
    fireEvent.click(previewButton);
    
    // Preview should be triggered
    expect(screen.getByText(/Preview/)).toBeInTheDocument();
  });

  it('should render CompactAISuggestions component', () => {
    render(<EmailEditor {...defaultProps} />, { wrapper: createWrapper() });
    
    // AI suggestions should be visible
    expect(screen.getByText(/Generate AI Suggestions/)).toBeInTheDocument();
  });

  it('should handle back navigation when provided', () => {
    render(<EmailEditor {...defaultProps} />, { wrapper: createWrapper() });
    
    const backButton = screen.getByRole('button', { name: /back/i });
    fireEvent.click(backButton);
    
    expect(mockOnBack).toHaveBeenCalled();
  });

  it('should initialize with empty canvas when no content provided', () => {
    render(<EmailEditor {...defaultProps} />, { wrapper: createWrapper() });
    
    expect(screen.getByText(/Ready to build!/)).toBeInTheDocument();
    expect(screen.getByText(/Drag a layout from the toolbar/)).toBeInTheDocument();
  });

  it('should handle content updates from canvas', async () => {
    render(<EmailEditor {...defaultProps} />, { wrapper: createWrapper() });
    
    // Simulate adding a block (this would trigger content change)
    const layoutButton = screen.getByRole('button', { name: /1 column/i });
    fireEvent.click(layoutButton);
    
    await waitFor(() => {
      expect(mockOnContentChange).toHaveBeenCalled();
    });
  });
});
