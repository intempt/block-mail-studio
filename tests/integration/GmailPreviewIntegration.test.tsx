
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { EmailPreview } from '@/components/EmailPreview';

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

describe('Gmail Preview Integration', () => {
  const mockEmailHtml = `
    <div style="font-family: Arial, sans-serif;">
      <h1>Welcome to our Newsletter</h1>
      <p>This is a test email content.</p>
      <img src="test.jpg" alt="Test image">
      <a href="https://example.com">Click here</a>
    </div>
  `;

  it('should render email preview with Gmail preview button', () => {
    render(
      <EmailPreview
        html={mockEmailHtml}
        previewMode="desktop"
        subject="Test Newsletter"
      />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText('Gmail Preview')).toBeInTheDocument();
    expect(screen.getByText('Desktop Email')).toBeInTheDocument();
  });

  it('should open Gmail preview when button is clicked', async () => {
    render(
      <EmailPreview
        html={mockEmailHtml}
        previewMode="desktop"
        subject="Test Newsletter"
      />,
      { wrapper: createWrapper() }
    );

    const gmailButton = screen.getByText('Gmail Preview');
    fireEvent.click(gmailButton);

    await waitFor(() => {
      expect(screen.getByText('Preparing Gmail Preview')).toBeInTheDocument();
    });
  });

  it('should handle mobile preview mode correctly', () => {
    render(
      <EmailPreview
        html={mockEmailHtml}
        previewMode="mobile"
        subject="Test Newsletter"
      />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText('Mobile Email (375px)')).toBeInTheDocument();
  });

  it('should process email HTML for Gmail compatibility', async () => {
    const htmlWithUnsupportedElements = `
      <div>
        <script>alert('test')</script>
        <p class="text-center">Content</p>
        <img src="test.jpg">
      </div>
    `;

    render(
      <EmailPreview
        html={htmlWithUnsupportedElements}
        previewMode="desktop"
        subject="Test Email"
      />,
      { wrapper: createWrapper() }
    );

    const gmailButton = screen.getByText('Gmail Preview');
    fireEvent.click(gmailButton);

    await waitFor(() => {
      // The processing should complete and show the preview
      expect(screen.queryByText('Preparing Gmail Preview')).not.toBeInTheDocument();
    });
  });

  it('should maintain email subject across preview modes', async () => {
    const testSubject = "Important Marketing Update";
    
    render(
      <EmailPreview
        html={mockEmailHtml}
        previewMode="desktop"
        subject={testSubject}
      />,
      { wrapper: createWrapper() }
    );

    const gmailButton = screen.getByText('Gmail Preview');
    fireEvent.click(gmailButton);

    await waitFor(() => {
      expect(screen.getByText(testSubject)).toBeInTheDocument();
    });
  });
});
