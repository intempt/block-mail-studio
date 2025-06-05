
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { IntegratedGmailPreview } from '@/components/IntegratedGmailPreview';
import { GmailResponsiveFrame } from '@/components/gmail/GmailDeviceFrames';

// Mock the email compatibility processor
vi.mock('@/services/emailCompatibilityProcessor', () => ({
  EmailCompatibilityProcessor: {
    processEmailForGmail: vi.fn().mockResolvedValue('<p>Processed email content</p>')
  }
}));

describe('Gmail Preview Integration Tests', () => {
  const mockOnPreviewModeChange = vi.fn();
  const mockSender = {
    name: 'Test Sender',
    email: 'sender@test.com',
    initials: 'TS'
  };
  const mockRecipient = {
    name: 'Test Recipient',
    email: 'recipient@test.com'
  };

  beforeEach(() => {
    mockOnPreviewModeChange.mockClear();
  });

  const defaultProps = {
    emailHtml: '<p>Test email content</p>',
    subject: 'Test Subject',
    previewMode: 'desktop' as const,
    sender: mockSender,
    recipient: mockRecipient,
    onPreviewModeChange: mockOnPreviewModeChange
  };

  it('should render desktop preview mode correctly', async () => {
    render(<IntegratedGmailPreview {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Subject')).toBeInTheDocument();
    });
  });

  it('should render mobile preview mode correctly', async () => {
    render(<IntegratedGmailPreview {...defaultProps} previewMode="mobile" />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Subject')).toBeInTheDocument();
    });
  });

  it('should show loading state while processing', () => {
    render(<IntegratedGmailPreview {...defaultProps} />);
    
    expect(screen.getByText('Preparing Gmail Preview')).toBeInTheDocument();
    expect(screen.getByText('Processing email for Gmail compatibility...')).toBeInTheDocument();
  });

  it('should handle email processing completion', async () => {
    render(<IntegratedGmailPreview {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.queryByText('Preparing Gmail Preview')).not.toBeInTheDocument();
    });
  });

  it('should apply correct scaling for desktop mode', async () => {
    render(<IntegratedGmailPreview {...defaultProps} />);
    
    await waitFor(() => {
      const preview = screen.getByTestId('gmail-preview-container');
      expect(preview).toHaveStyle({ transform: expect.stringContaining('scale(0.7)') });
    });
  });

  it('should apply correct scaling for mobile mode', async () => {
    render(<IntegratedGmailPreview {...defaultProps} previewMode="mobile" />);
    
    await waitFor(() => {
      const preview = screen.getByTestId('gmail-preview-container');
      expect(preview).toHaveStyle({ transform: expect.stringContaining('scale(1)') });
    });
  });

  it('should handle fullWidth mode correctly', async () => {
    render(<IntegratedGmailPreview {...defaultProps} fullWidth={true} />);
    
    await waitFor(() => {
      const container = screen.getByTestId('gmail-container');
      expect(container).not.toHaveClass('border-l');
    });
  });
});

describe('Gmail Device Frames Tests', () => {
  it('should render iPhone frame correctly', () => {
    render(
      <GmailResponsiveFrame mode="mobile" mobileDevice="iphone14pro">
        <div>Test Content</div>
      </GmailResponsiveFrame>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(screen.getByTestId('device-frame')).toHaveClass('bg-black');
  });

  it('should render desktop frame correctly', () => {
    render(
      <GmailResponsiveFrame mode="desktop">
        <div>Test Content</div>
      </GmailResponsiveFrame>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should show status bar on mobile devices', () => {
    render(
      <GmailResponsiveFrame mode="mobile" mobileDevice="iphone14pro">
        <div>Test Content</div>
      </GmailResponsiveFrame>
    );
    
    expect(screen.getByText('9:41')).toBeInTheDocument();
  });
});
