
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

describe('Unified AI Analysis Center', () => {
  const mockOnApplyFix = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock the analytics hook
    vi.mock('@/analytics/react/useEmailAnalytics', () => ({
      useEmailAnalytics: () => ({
        analyze: vi.fn(),
        result: {
          scores: {
            overallScore: 85,
            deliverabilityScore: 90,
            mobileScore: 88,
            spamScore: 15
          },
          prediction: {
            openRate: 24,
            clickRate: 3.2,
            conversionRate: 1.8
          },
          metrics: {
            sizeKB: 45,
            wordCount: 250,
            imageCount: 3,
            linkCount: 5
          }
        },
        isAnalyzing: false,
        error: null,
        clearCache: vi.fn()
      })
    }));
  });

  it('should render the unified AI Analysis Center', () => {
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

    expect(screen.getByText('AI Analysis Center')).toBeInTheDocument();
    expect(screen.getByText('Analyze • Suggest • Fix your email automatically')).toBeInTheDocument();
  });

  it('should show analyze button when no analysis exists', () => {
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

    expect(screen.getByRole('button', { name: /Analyze & Fix Email/i })).toBeInTheDocument();
  });

  it('should integrate critical suggestions with performance analysis', async () => {
    // Mock critical analysis
    const mockCriticalSuggestions = [
      {
        id: 'crit-1',
        type: 'subject',
        title: 'Improve subject line',
        category: 'subject',
        current: 'Test',
        suggested: 'Amazing Test Email',
        reason: 'Subject too short',
        businessImpact: 'Increase open rates',
        severity: 'critical',
        confidence: 95,
        autoFixable: true
      }
    ];

    // Mock comprehensive analysis
    const mockComprehensiveAnalysis = {
      performance: {
        accessibilityIssues: [
          {
            type: 'missing-alt',
            description: 'Image missing alt text',
            fix: 'Add descriptive alt text',
            severity: 'high'
          }
        ]
      },
      brandVoice: {
        suggestions: [
          {
            title: 'Enhance brand voice',
            reason: 'Too formal tone',
            current: 'We are pleased to inform',
            suggested: 'We are excited to share',
            impact: 'medium',
            confidence: 80
          }
        ]
      }
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

    // Click analyze button
    const analyzeButton = screen.getByRole('button', { name: /Analyze & Fix Email/i });
    fireEvent.click(analyzeButton);

    // Wait for suggestions to load
    await waitFor(() => {
      expect(screen.getByText('AI Suggestions & Auto-Fixes')).toBeInTheDocument();
    });

    // Verify critical suggestions are shown first
    expect(screen.getByText('Improve subject line')).toBeInTheDocument();
    expect(screen.getByText('critical')).toBeInTheDocument();
  });

  it('should handle auto-fix functionality', async () => {
    const mockSuggestions = [
      {
        id: 'auto-1',
        type: 'subject',
        title: 'Auto-fixable issue',
        category: 'subject',
        current: 'Test',
        suggested: 'Better Test',
        reason: 'Subject needs improvement',
        businessImpact: 'Higher open rates',
        severity: 'high',
        confidence: 90,
        autoFixable: true,
        fix: 'Better Test'
      }
    ];

    vi.mocked(CriticalEmailAnalysisService.analyzeCriticalIssues).mockResolvedValue(mockSuggestions);
    vi.mocked(CentralizedAIAnalysisService.runCompleteAnalysis).mockResolvedValue({});

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

    await waitFor(() => {
      expect(screen.getByText('Auto-fixable issue')).toBeInTheDocument();
    });

    // Click auto-fix button
    const autoFixButton = screen.getByRole('button', { name: /Auto-Fix/i });
    fireEvent.click(autoFixButton);

    // Verify fix was applied
    expect(mockOnApplyFix).toHaveBeenCalledWith('Better Test');
  });

  it('should show unified scoring and metrics', () => {
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

    // Click analyze to show results
    const analyzeButton = screen.getByRole('button', { name: /Analyze & Fix Email/i });
    fireEvent.click(analyzeButton);

    // Should show unified scores
    expect(screen.getByText('85')).toBeInTheDocument(); // Overall score
    expect(screen.getByText('90')).toBeInTheDocument(); // Deliverability
    expect(screen.getByText('88')).toBeInTheDocument(); // Mobile
    expect(screen.getByText('15')).toBeInTheDocument(); // Spam risk
  });

  it('should prioritize critical issues over other suggestions', async () => {
    const mixedSuggestions = [
      {
        id: 'low-1',
        type: 'enhancement',
        title: 'Minor enhancement',
        category: 'tone',
        severity: 'low',
        confidence: 70,
        autoFixable: false
      },
      {
        id: 'crit-1',
        type: 'critical',
        title: 'Critical issue',
        category: 'deliverability',
        severity: 'critical',
        confidence: 95,
        autoFixable: true
      },
      {
        id: 'high-1',
        type: 'performance',
        title: 'High priority',
        category: 'mobile',
        severity: 'high',
        confidence: 85,
        autoFixable: true
      }
    ];

    vi.mocked(CriticalEmailAnalysisService.analyzeCriticalIssues).mockResolvedValue(mixedSuggestions);
    vi.mocked(CentralizedAIAnalysisService.runCompleteAnalysis).mockResolvedValue({});

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

    const analyzeButton = screen.getByRole('button', { name: /Analyze & Fix Email/i });
    fireEvent.click(analyzeButton);

    await waitFor(() => {
      expect(screen.getByText('Critical issue')).toBeInTheDocument();
    });

    // Critical issues should appear first in the DOM
    const suggestions = screen.getAllByText(/issue|priority|enhancement/);
    expect(suggestions[0]).toHaveTextContent('Critical issue');
  });
});
