
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CompactAISuggestions } from '@/components/CompactAISuggestions';
import { CriticalEmailAnalysisService } from '@/services/criticalEmailAnalysisService';

// Mock the CriticalEmailAnalysisService
vi.mock('@/services/criticalEmailAnalysisService', () => ({
  CriticalEmailAnalysisService: {
    analyzeCriticalIssues: vi.fn(),
    getSeverityColor: vi.fn().mockReturnValue('text-red-600'),
    clearCache: vi.fn()
  }
}));

describe('CompactAISuggestions', () => {
  const mockOnApplySuggestion = vi.fn();
  const mockOnRefresh = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state when isLoading is true', () => {
    render(
      <CompactAISuggestions
        emailHTML="<p>Test</p>"
        subjectLine="Test Email"
        isLoading={true}
        onApplySuggestion={mockOnApplySuggestion}
        onRefresh={mockOnRefresh}
      />
    );

    expect(screen.getByText(/AI analyzing email for critical issues/)).toBeInTheDocument();
    expect(screen.getByText(/Usually takes 5-10 seconds/)).toBeInTheDocument();
  });

  it('should render generate button when no suggestions exist', () => {
    render(
      <CompactAISuggestions
        emailHTML="<p>Test</p>"
        subjectLine="Test Email"
        onApplySuggestion={mockOnApplySuggestion}
        onRefresh={mockOnRefresh}
      />
    );

    expect(screen.getByText(/Get AI-powered email optimization suggestions/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Generate AI Suggestions/i })).toBeInTheDocument();
  });

  it('should generate AI suggestions when button is clicked', async () => {
    // Mock the analysis return value
    const mockSuggestions = [
      {
        id: 'sugg-1',
        type: 'subject',
        title: 'Improve subject line',
        category: 'subject',
        current: 'Test Email',
        suggested: 'Exciting Test Email Inside',
        reason: 'More engaging subject line increases open rates',
        businessImpact: 'Can improve open rates by 20%',
        severity: 'high',
        confidence: 95,
        autoFixable: true
      }
    ];
    
    (CriticalEmailAnalysisService.analyzeCriticalIssues as any).mockResolvedValue(mockSuggestions);

    render(
      <CompactAISuggestions
        emailHTML="<p>Test</p>"
        subjectLine="Test Email"
        onApplySuggestion={mockOnApplySuggestion}
        onRefresh={mockOnRefresh}
      />
    );

    // Click generate button
    const generateButton = screen.getByRole('button', { name: /Generate AI Suggestions/i });
    fireEvent.click(generateButton);

    // Wait for analysis to complete
    await waitFor(() => {
      expect(CriticalEmailAnalysisService.analyzeCriticalIssues).toHaveBeenCalledWith(
        '<p>Test</p>',
        'Test Email'
      );
      
      // Check that suggestions are displayed
      expect(screen.getByText('Improve subject line')).toBeInTheDocument();
    });
  });

  it('should apply suggestion when clicked', async () => {
    // Mock the analysis return value
    const mockSuggestions = [
      {
        id: 'sugg-1',
        type: 'subject',
        title: 'Improve subject line',
        category: 'subject',
        current: 'Test Email',
        suggested: 'Exciting Test Email Inside',
        reason: 'More engaging subject line increases open rates',
        businessImpact: 'Can improve open rates by 20%',
        severity: 'high',
        confidence: 95,
        autoFixable: true
      }
    ];
    
    (CriticalEmailAnalysisService.analyzeCriticalIssues as any).mockResolvedValue(mockSuggestions);

    render(
      <CompactAISuggestions
        emailHTML="<p>Test</p>"
        subjectLine="Test Email"
        onApplySuggestion={mockOnApplySuggestion}
        onRefresh={mockOnRefresh}
      />
    );

    // Click generate button to load suggestions
    const generateButton = screen.getByRole('button', { name: /Generate AI Suggestions/i });
    fireEvent.click(generateButton);

    // Wait for analysis to complete
    await waitFor(() => {
      expect(screen.getByText('Improve subject line')).toBeInTheDocument();
    });

    // Click on the apply button
    const applyButton = screen.getByRole('button', { name: /Auto-Fix|Apply/i });
    fireEvent.click(applyButton);

    // Verify the suggestion was applied
    expect(mockOnApplySuggestion).toHaveBeenCalledWith(mockSuggestions[0]);
  });

  it('should handle "Fix All Critical" functionality', async () => {
    // Mock the analysis return value with critical suggestions
    const mockSuggestions = [
      {
        id: 'sugg-1',
        type: 'subject',
        title: 'Critical subject line issue',
        category: 'subject',
        current: 'Test',
        suggested: 'Better Test',
        reason: 'Too short subject lines have poor open rates',
        businessImpact: 'Can improve open rates significantly',
        severity: 'critical',
        confidence: 98,
        autoFixable: true
      },
      {
        id: 'sugg-2',
        type: 'cta',
        title: 'Missing call to action',
        category: 'cta',
        current: 'Read more',
        suggested: 'Click here to learn more',
        reason: 'Generic CTAs perform worse',
        businessImpact: 'Can improve click rates',
        severity: 'critical',
        confidence: 95,
        autoFixable: true
      }
    ];
    
    (CriticalEmailAnalysisService.analyzeCriticalIssues as any).mockResolvedValue(mockSuggestions);

    render(
      <CompactAISuggestions
        emailHTML="<p>Test</p>"
        subjectLine="Test Email"
        onApplySuggestion={mockOnApplySuggestion}
        onRefresh={mockOnRefresh}
      />
    );

    // Click generate button to load suggestions
    const generateButton = screen.getByRole('button', { name: /Generate AI Suggestions/i });
    fireEvent.click(generateButton);

    // Wait for analysis to complete
    await waitFor(() => {
      expect(screen.getByText(/Critical Email Issues Found/)).toBeInTheDocument();
      expect(screen.getByText(/2 critical/)).toBeInTheDocument();
    });

    // Click on the "Fix All Critical" button
    const fixAllButton = screen.getByRole('button', { name: /Fix All Critical/i });
    fireEvent.click(fixAllButton);

    // Verify all critical suggestions were applied
    expect(mockOnApplySuggestion).toHaveBeenCalledTimes(2);
    expect(mockOnApplySuggestion).toHaveBeenCalledWith(mockSuggestions[0]);
    expect(mockOnApplySuggestion).toHaveBeenCalledWith(mockSuggestions[1]);
  });

  it('should handle empty email content', () => {
    render(
      <CompactAISuggestions
        emailHTML=""
        subjectLine=""
        onApplySuggestion={mockOnApplySuggestion}
        onRefresh={mockOnRefresh}
      />
    );

    const generateButton = screen.getByRole('button', { name: /Generate AI Suggestions/i });
    expect(generateButton).toBeDisabled();
    expect(screen.getByText(/Add content to your email to get suggestions/)).toBeInTheDocument();
  });

  it('should handle API errors gracefully', async () => {
    // Mock API failure
    (CriticalEmailAnalysisService.analyzeCriticalIssues as any).mockRejectedValue(new Error('API error'));

    render(
      <CompactAISuggestions
        emailHTML="<p>Test</p>"
        subjectLine="Test Email"
        onApplySuggestion={mockOnApplySuggestion}
        onRefresh={mockOnRefresh}
      />
    );

    // Click generate button
    const generateButton = screen.getByRole('button', { name: /Generate AI Suggestions/i });
    fireEvent.click(generateButton);

    // Wait for error to be displayed
    await waitFor(() => {
      expect(screen.getByText(/Failed to analyze email/)).toBeInTheDocument();
    });

    // Verify retry button exists
    const retryButton = screen.getByRole('button', { name: /Retry/i });
    expect(retryButton).toBeInTheDocument();
  });
});
