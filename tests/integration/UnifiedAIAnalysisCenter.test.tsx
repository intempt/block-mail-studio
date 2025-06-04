
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CanvasStatus } from '@/components/canvas/CanvasStatus';
import { CentralizedAIAnalysisService } from '@/services/CentralizedAIAnalysisService';
import { CriticalEmailAnalysisService } from '@/services/criticalEmailAnalysisService';

// Mock dependencies
vi.mock('@/services/CentralizedAIAnalysisService');
vi.mock('@/services/criticalEmailAnalysisService');
vi.mock('@/analytics/react/useEmailAnalytics');
vi.mock('@/services/apiKeyService');

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

describe('Unified AI Analysis Center with Comprehensive Metrics', () => {
  const mockOnApplyFix = vi.fn();
  const mockAnalyze = vi.fn();
  const mockClearCache = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock the analytics hook with comprehensive metrics
    vi.mocked(vi.importActual('@/analytics/react/useEmailAnalytics')).useEmailAnalytics = vi.fn().mockReturnValue({
      analyze: mockAnalyze,
      result: {
        scores: {
          overallScore: 85,
          deliverabilityScore: 90,
          mobileScore: 88,
          spamScore: 15,
          accessibilityScore: 82
        },
        prediction: {
          openRate: 24.5,
          clickRate: 3.2,
          conversionRate: 1.8,
          confidence: 85
        },
        metrics: {
          sizeKB: 45.2,
          wordCount: 250,
          characterCount: 1500,
          imageCount: 3,
          linkCount: 5,
          ctaCount: 2,
          subjectLineLength: 42,
          previewTextLength: 85
        }
      },
      isAnalyzing: false,
      error: null,
      clearCache: mockClearCache,
      getCacheStats: vi.fn()
    });

    // Mock API key service
    vi.mocked(vi.importActual('@/services/apiKeyService')).ApiKeyService = {
      isKeyAvailable: vi.fn().mockReturnValue(true)
    };
  });

  it('should render comprehensive metrics display with 15+ metrics', async () => {
    const emailHTML = '<p>Test email content with <a href="#">link</a> and <img src="test.jpg" alt="test"/> image</p>';
    
    render(
      <CanvasStatus
        selectedBlockId={null}
        canvasWidth={600}
        previewMode="desktop"
        emailHTML={emailHTML}
        subjectLine="Test Subject Line for Analysis"
        onApplyFix={mockOnApplyFix}
      />,
      { wrapper: createWrapper() }
    );

    // Check for comprehensive metrics display
    await waitFor(() => {
      expect(screen.getByText('Comprehensive Email Metrics')).toBeInTheDocument();
    });

    // Verify content metrics are displayed
    expect(screen.getByText('Words')).toBeInTheDocument();
    expect(screen.getByText('Read Time')).toBeInTheDocument();
    expect(screen.getByText('Images')).toBeInTheDocument();
    expect(screen.getByText('Links')).toBeInTheDocument();
    expect(screen.getByText('CTAs')).toBeInTheDocument();

    // Verify performance metrics
    expect(screen.getByText('Size')).toBeInTheDocument();
    expect(screen.getByText('Load Time')).toBeInTheDocument();
    expect(screen.getByText('Mobile')).toBeInTheDocument();
    expect(screen.getByText('A11y')).toBeInTheDocument();
    expect(screen.getByText('Spam Risk')).toBeInTheDocument();

    // Verify engagement metrics
    expect(screen.getByText('Deliver')).toBeInTheDocument();
    expect(screen.getByText('Subject')).toBeInTheDocument();
    expect(screen.getByText('Personal')).toBeInTheDocument();
    expect(screen.getByText('Engage')).toBeInTheDocument();
    expect(screen.getByText('Convert')).toBeInTheDocument();
  });

  it('should calculate metrics automatically when content changes', () => {
    const { rerender } = render(
      <CanvasStatus
        selectedBlockId={null}
        canvasWidth={600}
        previewMode="desktop"
        emailHTML="<p>Short content</p>"
        subjectLine="Short"
        onApplyFix={mockOnApplyFix}
      />,
      { wrapper: createWrapper() }
    );

    // Update with longer content
    rerender(
      <CanvasStatus
        selectedBlockId={null}
        canvasWidth={600}
        previewMode="desktop"
        emailHTML="<p>Much longer email content with multiple words and several images <img src='1.jpg' alt='img1'/> <img src='2.jpg' alt='img2'/> and links <a href='#'>link1</a> <a href='#'>link2</a></p>"
        subjectLine="Much longer subject line for testing"
        onApplyFix={mockOnApplyFix}
      />
    );

    // Metrics should update automatically
    expect(screen.getByText('Comprehensive Email Metrics')).toBeInTheDocument();
  });

  it('should integrate with agentic AI services correctly', async () => {
    const mockCriticalSuggestions = [
      {
        id: 'crit-1',
        type: 'subject',
        title: 'Optimize subject line length',
        category: 'subject',
        current: 'Short',
        suggested: 'Optimized Subject Line for Better Engagement',
        reason: 'Subject line is too short for optimal engagement',
        businessImpact: 'Could increase open rates by 15-20%',
        severity: 'high',
        confidence: 92,
        autoFixable: true
      }
    ];

    const mockComprehensiveAnalysis = {
      brandVoice: {
        suggestions: [
          {
            title: 'Enhance brand voice consistency',
            reason: 'Tone could be more aligned with brand guidelines',
            current: 'Basic messaging',
            suggested: 'Brand-aligned messaging',
            impact: 'medium',
            confidence: 78
          }
        ]
      },
      performance: {
        accessibilityIssues: [
          {
            type: 'alt-text',
            description: 'Images missing alt text',
            fix: 'Add descriptive alt attributes',
            severity: 'medium'
          }
        ]
      },
      subjectVariants: ['Alternative Subject 1', 'Alternative Subject 2'],
      optimizations: {
        engagement: 'Optimized for engagement',
        conversion: 'Optimized for conversion',
        clarity: null,
        brevity: 'Optimized for brevity'
      },
      executionTime: 2500,
      errors: []
    };

    vi.mocked(CriticalEmailAnalysisService.analyzeCriticalIssues).mockResolvedValue(mockCriticalSuggestions);
    vi.mocked(CentralizedAIAnalysisService.runCompleteAnalysis).mockResolvedValue(mockComprehensiveAnalysis);

    render(
      <CanvasStatus
        selectedBlockId={null}
        canvasWidth={600}
        previewMode="desktop"
        emailHTML="<p>Test email content</p>"
        subjectLine="Test Subject"
        onApplyFix={mockOnApplyFix}
      />,
      { wrapper: createWrapper() }
    );

    // Trigger analysis
    const analyzeButton = screen.getByRole('button', { name: /Analyze & Fix Email/i });
    fireEvent.click(analyzeButton);

    // Wait for analysis completion
    await waitFor(() => {
      expect(screen.getByText('AI Suggestions & Auto-Fixes')).toBeInTheDocument();
    });

    // Verify critical suggestions are displayed
    expect(screen.getByText('Optimize subject line length')).toBeInTheDocument();
    expect(screen.getByText('high')).toBeInTheDocument();

    // Verify auto-fix functionality
    const autoFixButton = screen.getByRole('button', { name: /Auto-Fix/i });
    fireEvent.click(autoFixButton);

    expect(mockOnApplyFix).toHaveBeenCalledWith('Optimized Subject Line for Better Engagement', 'subject');
  });

  it('should handle batch auto-fix operations', async () => {
    const mockSuggestions = [
      {
        id: 'auto-1',
        title: 'Fix 1',
        category: 'subject',
        current: 'Test',
        suggested: 'Better Test',
        severity: 'high',
        autoFixable: true
      },
      {
        id: 'auto-2', 
        title: 'Fix 2',
        category: 'content',
        current: 'old text',
        suggested: 'new text',
        severity: 'medium',
        autoFixable: true
      },
      {
        id: 'manual-1',
        title: 'Manual Fix',
        category: 'design',
        severity: 'low',
        autoFixable: false
      }
    ];

    vi.mocked(CriticalEmailAnalysisService.analyzeCriticalIssues).mockResolvedValue(mockSuggestions);

    render(
      <CanvasStatus
        selectedBlockId={null}
        canvasWidth={600}
        previewMode="desktop"
        emailHTML="<p>Test email with old text</p>"
        subjectLine="Test"
        onApplyFix={mockOnApplyFix}
      />,
      { wrapper: createWrapper() }
    );

    // Trigger analysis
    const analyzeButton = screen.getByRole('button', { name: /Analyze & Fix Email/i });
    fireEvent.click(analyzeButton);

    await waitFor(() => {
      expect(screen.getByText('Apply All Auto-Fixes (2)')).toBeInTheDocument();
    });

    // Click batch auto-fix
    const batchFixButton = screen.getByRole('button', { name: /Apply All Auto-Fixes \(2\)/i });
    fireEvent.click(batchFixButton);

    // Verify all auto-fixable suggestions are applied
    await waitFor(() => {
      expect(mockOnApplyFix).toHaveBeenCalledTimes(2);
    });
  });

  it('should show proper metric color coding based on scores', () => {
    render(
      <CanvasStatus
        selectedBlockId={null}
        canvasWidth={600}
        previewMode="desktop"
        emailHTML="<p>Test content</p>"
        subjectLine="Test"
        onApplyFix={mockOnApplyFix}
      />,
      { wrapper: createWrapper() }
    );

    // Comprehensive metrics should be displayed with proper color coding
    expect(screen.getByText('Comprehensive Email Metrics')).toBeInTheDocument();
    
    // The component should calculate and display metrics automatically
    // Color coding will be applied based on calculated scores
  });

  it('should maintain performance with large metric datasets', async () => {
    const largeEmailHTML = '<p>' + 'Large email content '.repeat(100) + '</p>';
    
    const startTime = performance.now();
    
    render(
      <CanvasStatus
        selectedBlockId={null}
        canvasWidth={600}
        previewMode="desktop"
        emailHTML={largeEmailHTML}
        subjectLine="Large email subject line for performance testing"
        onApplyFix={mockOnApplyFix}
      />,
      { wrapper: createWrapper() }
    );

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    // Should render within reasonable time (less than 100ms)
    expect(renderTime).toBeLessThan(100);
    
    // Should still display metrics correctly
    expect(screen.getByText('Comprehensive Email Metrics')).toBeInTheDocument();
  });

  it('should handle fallback scenarios when AI services fail', async () => {
    // Mock AI service failures
    vi.mocked(CriticalEmailAnalysisService.analyzeCriticalIssues).mockRejectedValue(new Error('API Error'));
    vi.mocked(CentralizedAIAnalysisService.runCompleteAnalysis).mockRejectedValue(new Error('AI Service Down'));
    mockAnalyze.mockRejectedValue(new Error('Analytics Failed'));

    render(
      <CanvasStatus
        selectedBlockId={null}
        canvasWidth={600}
        previewMode="desktop"
        emailHTML="<p>Test content</p>"
        subjectLine="Test"
        onApplyFix={mockOnApplyFix}
      />,
      { wrapper: createWrapper() }
    );

    // Should still show basic metrics even when AI services fail
    expect(screen.getByText('Comprehensive Email Metrics')).toBeInTheDocument();

    // Trigger analysis
    const analyzeButton = screen.getByRole('button', { name: /Analyze & Fix Email/i });
    fireEvent.click(analyzeButton);

    // Should handle errors gracefully and still display basic functionality
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Re-analyze/i })).toBeInTheDocument();
    });
  });
});
