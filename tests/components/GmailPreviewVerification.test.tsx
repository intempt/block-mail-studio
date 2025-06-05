
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GmailPreviewVerification } from '@/components/gmail/GmailPreviewVerification';

describe('Gmail Preview Verification', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the verification card with all components', () => {
    render(<GmailPreviewVerification />);
    
    expect(screen.getByText('Gmail Preview Verification')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /run verification/i })).toBeInTheDocument();
    expect(screen.getByText('Verify that Gmail preview functionality is working correctly')).toBeInTheDocument();
  });

  it('should initially show all steps in pending state', () => {
    render(<GmailPreviewVerification />);
    
    expect(screen.getByText('Gmail Preview Button Visibility')).toBeInTheDocument();
    expect(screen.getByText('Modal Opening Functionality')).toBeInTheDocument();
    expect(screen.getByText('Device Mode Switching')).toBeInTheDocument();
    expect(screen.getByText('Email Processing')).toBeInTheDocument();
    expect(screen.getByText('Mock Data Generation')).toBeInTheDocument();
    
    const pendingBadges = screen.getAllByText('Pending');
    expect(pendingBadges.length).toBe(5);
  });

  it('should run verification steps when button is clicked', async () => {
    render(<GmailPreviewVerification />);
    
    const runButton = screen.getByRole('button', { name: /run verification/i });
    fireEvent.click(runButton);
    
    // Button should change to "Running..."
    expect(screen.getByRole('button', { name: /running/i })).toBeInTheDocument();
    
    // Wait for all steps to complete
    await waitFor(() => {
      const pendingBadges = screen.queryAllByText('Pending');
      expect(pendingBadges.length).toBe(0);
    }, { timeout: 5000 });
    
    // There should be a mix of passed and failed steps
    const passedBadges = screen.queryAllByText('Passed');
    const failedBadges = screen.queryAllByText('Failed');
    
    expect(passedBadges.length + failedBadges.length).toBe(5);
    
    // Summary numbers should add up correctly
    const passedCount = Number(screen.getByText(/^\d+$/).textContent);
    const failedCount = Number(screen.getAllByText(/^\d+$/)[1].textContent);
    const totalCount = Number(screen.getAllByText(/^\d+$/)[2].textContent);
    
    expect(passedCount + failedCount).toBe(totalCount);
    expect(totalCount).toBe(5);
  });

  it('should disable run button while verification is in progress', async () => {
    render(<GmailPreviewVerification />);
    
    const runButton = screen.getByRole('button', { name: /run verification/i });
    fireEvent.click(runButton);
    
    expect(screen.getByRole('button', { name: /running/i })).toBeDisabled();
    
    // Wait for verification to complete
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /run verification/i })).toBeEnabled();
    }, { timeout: 5000 });
  });

  it('should show error details for failed steps', async () => {
    render(<GmailPreviewVerification />);
    
    const runButton = screen.getByRole('button', { name: /run verification/i });
    fireEvent.click(runButton);
    
    // Wait for verification to complete
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /run verification/i })).toBeEnabled();
    }, { timeout: 5000 });
    
    // Check if any failed steps show error details
    const failedSteps = screen.queryAllByText('Failed');
    
    if (failedSteps.length > 0) {
      // At least one error message should be visible
      expect(screen.queryAllByText(/verification failed:/i).length).toBeGreaterThan(0);
    }
  });

  it('should handle quick access button clicks', async () => {
    render(<GmailPreviewVerification />);
    
    const openPreviewButton = screen.getByRole('button', { name: /open email preview/i });
    const testDesktopButton = screen.getByRole('button', { name: /test desktop/i });
    const testMobileButton = screen.getByRole('button', { name: /test mobile/i });
    
    // Buttons should be clickable
    fireEvent.click(openPreviewButton);
    fireEvent.click(testDesktopButton);
    fireEvent.click(testMobileButton);
    
    // No errors should occur
    expect(screen.getByText('Gmail Preview Verification')).toBeInTheDocument();
  });
});
