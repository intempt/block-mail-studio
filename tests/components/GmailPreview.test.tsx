
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GmailPreviewContainer } from '@/components/gmail/GmailPreviewContainer';
import { GmailDesktopPreview } from '@/components/gmail/GmailDesktopPreview';
import { GmailMobilePreview } from '@/components/gmail/GmailMobilePreview';

describe('Gmail Preview System', () => {
  const mockEmailHtml = '<p>Test email content</p>';
  const mockSubject = 'Test Email Subject';
  const mockOnClose = vi.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  describe('GmailPreviewContainer', () => {
    it('should render preview mode selector', async () => {
      render(
        <GmailPreviewContainer
          emailHtml={mockEmailHtml}
          subject={mockSubject}
          onClose={mockOnClose}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Desktop')).toBeInTheDocument();
        expect(screen.getByText('Mobile')).toBeInTheDocument();
        expect(screen.getByText('Gmail Preview')).toBeInTheDocument();
      });
    });

    it('should switch between desktop and mobile views', async () => {
      render(
        <GmailPreviewContainer
          emailHtml={mockEmailHtml}
          subject={mockSubject}
          onClose={mockOnClose}
        />
      );

      await waitFor(() => {
        const mobileButton = screen.getByText('Mobile');
        fireEvent.click(mobileButton);
        expect(screen.getByText('Inbox')).toBeInTheDocument();
      });
    });

    it('should call onClose when close button is clicked', async () => {
      render(
        <GmailPreviewContainer
          emailHtml={mockEmailHtml}
          subject={mockSubject}
          onClose={mockOnClose}
        />
      );

      await waitFor(() => {
        const closeButton = screen.getByRole('button', { name: /close/i });
        fireEvent.click(closeButton);
        expect(mockOnClose).toHaveBeenCalled();
      });
    });
  });

  describe('GmailDesktopPreview', () => {
    it('should render Gmail desktop interface', () => {
      render(
        <GmailDesktopPreview
          emailHtml={mockEmailHtml}
          subject={mockSubject}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText('Gmail')).toBeInTheDocument();
      expect(screen.getByText('Compose')).toBeInTheDocument();
      expect(screen.getByText('Inbox')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Search mail')).toBeInTheDocument();
    });

    it('should display email subject and content', () => {
      render(
        <GmailDesktopPreview
          emailHtml={mockEmailHtml}
          subject={mockSubject}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText(mockSubject)).toBeInTheDocument();
    });

    it('should render Gmail sidebar with labels', () => {
      render(
        <GmailDesktopPreview
          emailHtml={mockEmailHtml}
          subject={mockSubject}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText('Starred')).toBeInTheDocument();
      expect(screen.getByText('Sent')).toBeInTheDocument();
      expect(screen.getByText('Drafts')).toBeInTheDocument();
    });
  });

  describe('GmailMobilePreview', () => {
    it('should render Gmail mobile interface', () => {
      render(
        <GmailMobilePreview
          emailHtml={mockEmailHtml}
          subject={mockSubject}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText('Inbox')).toBeInTheDocument();
    });

    it('should navigate between email list and email view', () => {
      render(
        <GmailMobilePreview
          emailHtml={mockEmailHtml}
          subject={mockSubject}
          onClose={mockOnClose}
        />
      );

      // Click on first email to open it
      const firstEmail = screen.getAllByText(mockSubject)[0];
      fireEvent.click(firstEmail);

      // Should show email content view
      expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
    });

    it('should show mobile-specific UI elements', () => {
      render(
        <GmailMobilePreview
          emailHtml={mockEmailHtml}
          subject={mockSubject}
          onClose={mockOnClose}
        />
      );

      // Should have mobile-specific elements
      expect(screen.getByRole('button')).toBeInTheDocument(); // Menu button
    });
  });
});
