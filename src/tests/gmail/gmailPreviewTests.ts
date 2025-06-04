
export interface GmailPreviewTest {
  id: string;
  name: string;
  description: string;
  shouldPass: boolean;
  expectedError?: string;
  filePath: string;
  testType: 'ui' | 'processing' | 'integration' | 'performance';
}

export interface GmailTestSuite {
  name: string;
  category: string;
  description: string;
  filePath: string;
  tests: GmailPreviewTest[];
}

export const gmailPreviewTestSuites: GmailTestSuite[] = [
  {
    name: 'Gmail Preview UI Tests',
    category: 'Gmail',
    description: 'Tests for Gmail preview user interface components and interactions',
    filePath: 'tests/components/GmailPreview.test.tsx',
    tests: [
      {
        id: 'gmail-preview-button-visibility',
        name: 'Gmail Preview Button Visible',
        description: 'Verify Gmail preview button is visible in email preview',
        shouldPass: true,
        filePath: 'tests/components/GmailPreview.test.tsx',
        testType: 'ui'
      },
      {
        id: 'gmail-preview-modal-open',
        name: 'Gmail Preview Modal Opens',
        description: 'Test that clicking Gmail preview button opens the modal',
        shouldPass: true,
        filePath: 'tests/components/GmailPreview.test.tsx',
        testType: 'ui'
      },
      {
        id: 'gmail-preview-mode-switching',
        name: 'Desktop/Mobile Mode Switching',
        description: 'Test switching between desktop and mobile preview modes',
        shouldPass: true,
        filePath: 'tests/components/GmailPreview.test.tsx',
        testType: 'ui'
      },
      {
        id: 'gmail-preview-close-functionality',
        name: 'Gmail Preview Close',
        description: 'Test that close button properly closes the Gmail preview',
        shouldPass: true,
        filePath: 'tests/components/GmailPreview.test.tsx',
        testType: 'ui'
      },
      {
        id: 'gmail-sidebar-labels',
        name: 'Gmail Sidebar Labels Render',
        description: 'Verify Gmail sidebar shows proper labels (Inbox, Starred, etc.)',
        shouldPass: true,
        filePath: 'tests/components/GmailPreview.test.tsx',
        testType: 'ui'
      }
    ]
  },
  {
    name: 'Email Processing Tests',
    category: 'Gmail',
    description: 'Tests for email compatibility and processing for Gmail',
    filePath: 'tests/services/EmailCompatibilityProcessor.test.ts',
    tests: [
      {
        id: 'email-html-processing',
        name: 'Email HTML Processing',
        description: 'Test that email HTML is properly processed for Gmail compatibility',
        shouldPass: true,
        filePath: 'tests/services/EmailCompatibilityProcessor.test.ts',
        testType: 'processing'
      },
      {
        id: 'unsupported-elements-removal',
        name: 'Unsupported Elements Removal',
        description: 'Verify script tags and other unsupported elements are removed',
        shouldPass: true,
        filePath: 'tests/services/EmailCompatibilityProcessor.test.ts',
        testType: 'processing'
      },
      {
        id: 'css-inlining',
        name: 'CSS Class to Inline Conversion',
        description: 'Test that CSS classes are converted to inline styles',
        shouldPass: true,
        filePath: 'tests/services/EmailCompatibilityProcessor.test.ts',
        testType: 'processing'
      },
      {
        id: 'image-optimization',
        name: 'Image Processing for Gmail',
        description: 'Verify images are processed with Gmail-compatible attributes',
        shouldPass: true,
        filePath: 'tests/services/EmailCompatibilityProcessor.test.ts',
        testType: 'processing'
      },
      {
        id: 'dark-mode-support',
        name: 'Dark Mode Meta Tags',
        description: 'Test that dark mode support meta tags are added',
        shouldPass: true,
        filePath: 'tests/services/EmailCompatibilityProcessor.test.ts',
        testType: 'processing'
      },
      {
        id: 'malformed-html-handling',
        name: 'Malformed HTML Handling',
        description: 'Test processing fails gracefully with malformed HTML',
        shouldPass: false,
        expectedError: 'HTML parsing error: Invalid structure',
        filePath: 'tests/services/EmailCompatibilityProcessor.test.ts',
        testType: 'processing'
      }
    ]
  },
  {
    name: 'Gmail Integration Tests',
    category: 'Gmail',
    description: 'End-to-end tests for Gmail preview workflow',
    filePath: 'tests/integration/GmailPreviewIntegration.test.tsx',
    tests: [
      {
        id: 'end-to-end-preview',
        name: 'End-to-End Preview Workflow',
        description: 'Test complete workflow from email editor to Gmail preview',
        shouldPass: true,
        filePath: 'tests/integration/GmailPreviewIntegration.test.tsx',
        testType: 'integration'
      },
      {
        id: 'complex-email-rendering',
        name: 'Complex Email Rendering',
        description: 'Test Gmail preview with complex email templates',
        shouldPass: true,
        filePath: 'tests/integration/GmailPreviewIntegration.test.tsx',
        testType: 'integration'
      },
      {
        id: 'subject-line-persistence',
        name: 'Subject Line Persistence',
        description: 'Verify subject line is maintained across preview modes',
        shouldPass: true,
        filePath: 'tests/integration/GmailPreviewIntegration.test.tsx',
        testType: 'integration'
      },
      {
        id: 'mock-data-generation',
        name: 'Mock Gmail Data Generation',
        description: 'Test that mock Gmail thread and labels are generated correctly',
        shouldPass: true,
        filePath: 'tests/integration/GmailPreviewIntegration.test.tsx',
        testType: 'integration'
      },
      {
        id: 'preview-size-calculation',
        name: 'Preview Size Calculation',
        description: 'Test that preview dimensions are calculated correctly',
        shouldPass: true,
        filePath: 'tests/integration/GmailPreviewIntegration.test.tsx',
        testType: 'integration'
      }
    ]
  },
  {
    name: 'Gmail Performance Tests',
    category: 'Gmail',
    description: 'Performance and optimization tests for Gmail preview',
    filePath: 'tests/performance/GmailPerformance.test.ts',
    tests: [
      {
        id: 'large-email-processing',
        name: 'Large Email Processing Performance',
        description: 'Test processing performance with large email content',
        shouldPass: true,
        filePath: 'tests/performance/GmailPerformance.test.ts',
        testType: 'performance'
      },
      {
        id: 'processing-timeout',
        name: 'Processing Timeout Handling',
        description: 'Test that email processing times out appropriately',
        shouldPass: false,
        expectedError: 'Processing timeout exceeded',
        filePath: 'tests/performance/GmailPerformance.test.ts',
        testType: 'performance'
      },
      {
        id: 'memory-usage-large-emails',
        name: 'Memory Usage with Large Emails',
        description: 'Monitor memory usage during large email processing',
        shouldPass: true,
        filePath: 'tests/performance/GmailPerformance.test.ts',
        testType: 'performance'
      },
      {
        id: 'concurrent-preview-handling',
        name: 'Concurrent Preview Handling',
        description: 'Test multiple simultaneous Gmail preview requests',
        shouldPass: true,
        filePath: 'tests/performance/GmailPerformance.test.ts',
        testType: 'performance'
      }
    ]
  }
];

export const getGmailTestSummary = () => {
  const totalTests = gmailPreviewTestSuites.reduce((sum, suite) => sum + suite.tests.length, 0);
  const totalSuites = gmailPreviewTestSuites.length;
  
  const categoryCounts = gmailPreviewTestSuites.reduce((acc, suite) => {
    acc[suite.category] = (acc[suite.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const testTypeCounts = gmailPreviewTestSuites.reduce((acc, suite) => {
    suite.tests.forEach(test => {
      acc[test.testType] = (acc[test.testType] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  return {
    totalTests,
    totalSuites,
    categoryCounts,
    testTypeCounts
  };
};
