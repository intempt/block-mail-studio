
export interface UnifiedTestCase {
  id: string;
  name: string;
  description: string;
  shouldPass: boolean;
  expectedError?: string;
  filePath: string;
  testType: 'ui' | 'processing' | 'integration' | 'performance' | 'service' | 'util';
  category: 'Components' | 'Services' | 'Integration' | 'Utils' | 'Infrastructure';
  severity?: 'low' | 'medium' | 'high';
}

export interface UnifiedTestSuite {
  id: string;
  name: string;
  description: string;
  category: 'Components' | 'Services' | 'Integration' | 'Utils' | 'Infrastructure';
  filePath: string;
  tests: UnifiedTestCase[];
}

export const unifiedTestSuites: UnifiedTestSuite[] = [
  // Components Category
  {
    id: 'email-editor-component',
    name: 'Email Editor Component',
    description: 'Core functionality tests for the main EmailEditor component',
    category: 'Components',
    filePath: 'tests/components/EmailEditor.test.tsx',
    tests: [
      { id: 'email-editor-render', name: 'should render email editor with all main components', description: 'Verify all main components render correctly', shouldPass: true, filePath: 'tests/components/EmailEditor.test.tsx', testType: 'ui', category: 'Components' },
      { id: 'email-editor-subject', name: 'should handle subject line changes', description: 'Test subject line input functionality', shouldPass: true, filePath: 'tests/components/EmailEditor.test.tsx', testType: 'ui', category: 'Components' },
      { id: 'email-editor-ribbon', name: 'should render OmnipresentRibbon with correct props', description: 'Verify ribbon component integration', shouldPass: true, filePath: 'tests/components/EmailEditor.test.tsx', testType: 'ui', category: 'Components' },
      { id: 'email-editor-preview', name: 'should handle preview mode switching', description: 'Test responsive preview mode changes', shouldPass: true, filePath: 'tests/components/EmailEditor.test.tsx', testType: 'ui', category: 'Components' },
      { id: 'email-editor-invalid-props', name: 'should fail with invalid props', description: 'Test error handling with invalid props', shouldPass: false, expectedError: 'Invalid props provided to EmailEditor', filePath: 'tests/components/EmailEditor.test.tsx', testType: 'ui', category: 'Components' }
    ]
  },
  {
    id: 'email-block-canvas',
    name: 'Email Block Canvas',
    description: 'Tests for the canvas where email blocks are rendered and managed',
    category: 'Components',
    filePath: 'tests/components/EmailBlockCanvas.test.tsx',
    tests: [
      { id: 'canvas-empty-render', name: 'should render empty canvas with drop zone message', description: 'Verify empty state display', shouldPass: true, filePath: 'tests/components/EmailBlockCanvas.test.tsx', testType: 'ui', category: 'Components' },
      { id: 'canvas-drag-over', name: 'should handle drag over events', description: 'Test drag and drop visual feedback', shouldPass: true, filePath: 'tests/components/EmailBlockCanvas.test.tsx', testType: 'ui', category: 'Components' },
      { id: 'canvas-block-drops', name: 'should handle block drops', description: 'Test dropping blocks onto canvas', shouldPass: true, filePath: 'tests/components/EmailBlockCanvas.test.tsx', testType: 'ui', category: 'Components' },
      { id: 'canvas-layout-drops', name: 'should handle layout drops with column configuration', description: 'Test layout block dropping', shouldPass: true, filePath: 'tests/components/EmailBlockCanvas.test.tsx', testType: 'ui', category: 'Components' },
      { id: 'canvas-block-selection', name: 'should handle block selection', description: 'Test block selection functionality', shouldPass: true, filePath: 'tests/components/EmailBlockCanvas.test.tsx', testType: 'ui', category: 'Components' },
      { id: 'canvas-corrupted-data', name: 'should fail with corrupted block data', description: 'Test error handling with invalid block data', shouldPass: false, expectedError: 'Invalid block structure detected', filePath: 'tests/components/EmailBlockCanvas.test.tsx', testType: 'ui', category: 'Components' }
    ]
  },
  {
    id: 'block-renderers',
    name: 'All Block Renderers',
    description: 'Comprehensive tests for all email block rendering components',
    category: 'Components',
    filePath: 'tests/components/AllBlockRenderers.test.tsx',
    tests: [
      { id: 'all-block-types', name: 'should render all block types correctly', description: 'Test rendering of all supported block types', shouldPass: true, filePath: 'tests/components/AllBlockRenderers.test.tsx', testType: 'ui', category: 'Components' },
      { id: 'text-block-render', name: 'should handle text block rendering', description: 'Test text block specific rendering', shouldPass: true, filePath: 'tests/components/AllBlockRenderers.test.tsx', testType: 'ui', category: 'Components' },
      { id: 'image-block-render', name: 'should handle image block rendering', description: 'Test image block specific rendering', shouldPass: true, filePath: 'tests/components/AllBlockRenderers.test.tsx', testType: 'ui', category: 'Components' },
      { id: 'button-block-render', name: 'should handle button block rendering', description: 'Test button block specific rendering', shouldPass: true, filePath: 'tests/components/AllBlockRenderers.test.tsx', testType: 'ui', category: 'Components' },
      { id: 'invalid-block-data', name: 'should fail with invalid block data', description: 'Test error handling with invalid block data', shouldPass: false, expectedError: 'Invalid block data provided', filePath: 'tests/components/AllBlockRenderers.test.tsx', testType: 'ui', category: 'Components' }
    ]
  },

  // Services Category
  {
    id: 'mjml-service',
    name: 'MJML Service',
    description: 'Tests for MJML generation, conversion, and validation',
    category: 'Services',
    filePath: 'tests/services/MJMLService.test.ts',
    tests: [
      { id: 'mjml-empty-email', name: 'should generate valid MJML for empty email', description: 'Test MJML generation for empty content', shouldPass: true, filePath: 'tests/services/MJMLService.test.ts', testType: 'processing', category: 'Services' },
      { id: 'mjml-text-block', name: 'should generate MJML for text block', description: 'Test MJML generation for text blocks', shouldPass: true, filePath: 'tests/services/MJMLService.test.ts', testType: 'processing', category: 'Services' },
      { id: 'mjml-responsive', name: 'should handle responsive styling correctly', description: 'Test responsive MJML generation', shouldPass: true, filePath: 'tests/services/MJMLService.test.ts', testType: 'processing', category: 'Services' },
      { id: 'mjml-conversion', name: 'should convert simple MJML to HTML', description: 'Test MJML to HTML conversion', shouldPass: true, filePath: 'tests/services/MJMLService.test.ts', testType: 'processing', category: 'Services' },
      { id: 'mjml-validation', name: 'should validate correct MJML structure', description: 'Test MJML structure validation', shouldPass: true, filePath: 'tests/services/MJMLService.test.ts', testType: 'processing', category: 'Services' }
    ]
  },
  {
    id: 'template-service',
    name: 'Direct Template Service',
    description: 'Template management service functionality tests',
    category: 'Services',
    filePath: 'tests/services/directTemplateService.test.ts',
    tests: [
      { id: 'template-creation', name: 'should create a new template with auto-generated name from subject line', description: 'Test template creation from subject line', shouldPass: true, filePath: 'tests/services/directTemplateService.test.ts', testType: 'service', category: 'Services' },
      { id: 'template-duplicates', name: 'should handle duplicate names by appending numbers', description: 'Test duplicate name handling', shouldPass: true, filePath: 'tests/services/directTemplateService.test.ts', testType: 'service', category: 'Services' },
      { id: 'template-filtering', name: 'should filter templates by name, category, and tags', description: 'Test template filtering functionality', shouldPass: true, filePath: 'tests/services/directTemplateService.test.ts', testType: 'service', category: 'Services' },
      { id: 'template-unique-ids', name: 'should generate unique IDs', description: 'Test unique ID generation', shouldPass: true, filePath: 'tests/services/directTemplateService.test.ts', testType: 'service', category: 'Services' }
    ]
  },
  {
    id: 'ai-services',
    name: 'AI Services',
    description: 'OpenAI integration and AI-powered functionality tests',
    category: 'Services',
    filePath: 'tests/services/aiServices.test.ts',
    tests: [
      { id: 'api-key-config', name: 'API Key Configuration', description: 'Verify OpenAI API key is properly configured', shouldPass: true, filePath: 'tests/services/aiServices.test.ts', testType: 'service', category: 'Services' },
      { id: 'api-connectivity', name: 'OpenAI API Connectivity', description: 'Test basic connection to OpenAI servers', shouldPass: true, filePath: 'tests/services/aiServices.test.ts', testType: 'service', category: 'Services' },
      { id: 'email-generation', name: 'Email Content Generation', description: 'Generate complete email using AI', shouldPass: true, filePath: 'tests/services/aiServices.test.ts', testType: 'service', category: 'Services' },
      { id: 'brand-voice-analysis', name: 'Brand Voice Analysis', description: 'Analyze email content for brand consistency', shouldPass: true, filePath: 'tests/services/aiServices.test.ts', testType: 'service', category: 'Services' },
      { id: 'performance-analysis', name: 'Performance Analysis', description: 'Technical performance and deliverability analysis', shouldPass: true, filePath: 'tests/services/aiServices.test.ts', testType: 'service', category: 'Services' }
    ]
  },

  // Integration Category
  {
    id: 'drag-drop-workflows',
    name: 'Drag and Drop Workflows',
    description: 'Complete workflow tests for drag and drop operations',
    category: 'Integration',
    filePath: 'tests/integration/dragDropWorkflows.test.tsx',
    tests: [
      { id: 'drag-text-to-canvas', name: 'should allow dragging text block to empty canvas', description: 'Test basic drag and drop workflow', shouldPass: true, filePath: 'tests/integration/dragDropWorkflows.test.tsx', testType: 'integration', category: 'Integration' },
      { id: 'drag-layout-blocks', name: 'should allow dragging layout blocks to canvas', description: 'Test layout drag and drop', shouldPass: true, filePath: 'tests/integration/dragDropWorkflows.test.tsx', testType: 'integration', category: 'Integration' },
      { id: 'multiple-block-drops', name: 'should handle multiple block drops in sequence', description: 'Test sequential block dropping', shouldPass: true, filePath: 'tests/integration/dragDropWorkflows.test.tsx', testType: 'integration', category: 'Integration' },
      { id: 'invalid-drag-data', name: 'should fail with invalid drag data', description: 'Test error handling with invalid drag data', shouldPass: false, expectedError: 'Invalid drag data format', filePath: 'tests/integration/dragDropWorkflows.test.tsx', testType: 'integration', category: 'Integration' }
    ]
  },
  {
    id: 'template-lifecycle',
    name: 'Template Lifecycle Integration',
    description: 'Full template lifecycle testing from creation to reuse',
    category: 'Integration',
    filePath: 'tests/integration/templateCycle.test.tsx',
    tests: [
      { id: 'template-creation-canvas', name: 'should allow creating email content in the canvas', description: 'Test template creation workflow', shouldPass: true, filePath: 'tests/integration/templateCycle.test.tsx', testType: 'integration', category: 'Integration' },
      { id: 'template-save-publish', name: 'should save template when publish button is clicked', description: 'Test template saving', shouldPass: true, filePath: 'tests/integration/templateCycle.test.tsx', testType: 'integration', category: 'Integration' },
      { id: 'template-full-cycle', name: 'should complete full cycle: create → save → load → modify → save again', description: 'Test complete template lifecycle', shouldPass: true, filePath: 'tests/integration/templateCycle.test.tsx', testType: 'integration', category: 'Integration' }
    ]
  },
  {
    id: 'analytics-workflow',
    name: 'Analytics Workflow Integration',
    description: 'Complete email analysis workflow from content to UI display',
    category: 'Integration',
    filePath: 'tests/integration/analyticsWorkflow.test.ts',
    tests: [
      { id: 'full-analysis-workflow', name: 'should complete full analysis workflow with AI engine', description: 'Test complete analytics workflow', shouldPass: true, filePath: 'tests/integration/analyticsWorkflow.test.ts', testType: 'integration', category: 'Integration' },
      { id: 'heuristic-fallback', name: 'should fallback to heuristic analysis when AI unavailable', description: 'Test analytics fallback mechanism', shouldPass: true, filePath: 'tests/integration/analyticsWorkflow.test.ts', testType: 'integration', category: 'Integration' },
      { id: 'cache-integration', name: 'should cache results and serve from cache on repeat requests', description: 'Test analytics caching integration', shouldPass: true, filePath: 'tests/integration/analyticsWorkflow.test.ts', testType: 'integration', category: 'Integration' }
    ]
  },

  // Utils Category
  {
    id: 'block-utils',
    name: 'Block Utils',
    description: 'Utility function tests for block creation and management',
    category: 'Utils',
    filePath: 'tests/utils/blockUtils.test.ts',
    tests: [
      { id: 'unique-id-generation', name: 'should generate a unique ID with correct format', description: 'Test ID generation utility', shouldPass: true, filePath: 'tests/utils/blockUtils.test.ts', testType: 'util', category: 'Utils' },
      { id: 'default-styling', name: 'should create default styling with all device types', description: 'Test default styling creation', shouldPass: true, filePath: 'tests/utils/blockUtils.test.ts', testType: 'util', category: 'Utils' }
    ]
  },
  {
    id: 'email-utils',
    name: 'Email Utils',
    description: 'Utility functions for email content processing and validation',
    category: 'Utils',
    filePath: 'tests/utils/emailUtils.test.ts',
    tests: [
      { id: 'html-document-wrap', name: 'should wrap content in a complete HTML document', description: 'Test HTML document wrapping', shouldPass: true, filePath: 'tests/utils/emailUtils.test.ts', testType: 'util', category: 'Utils' },
      { id: 'css-styles-include', name: 'should include email-specific CSS styles', description: 'Test CSS style inclusion', shouldPass: true, filePath: 'tests/utils/emailUtils.test.ts', testType: 'util', category: 'Utils' },
      { id: 'tiptap-attributes-remove', name: 'should remove TipTap-specific attributes', description: 'Test attribute cleaning', shouldPass: true, filePath: 'tests/utils/emailUtils.test.ts', testType: 'util', category: 'Utils' }
    ]
  },
  {
    id: 'block-factory',
    name: 'Block Factory',
    description: 'Tests for the block creation factory system',
    category: 'Utils',
    filePath: 'tests/utils/blockFactory.test.ts',
    tests: [
      { id: 'text-block-creation', name: 'should create a text block with default content', description: 'Test text block factory', shouldPass: true, filePath: 'tests/utils/blockFactory.test.ts', testType: 'util', category: 'Utils' },
      { id: 'image-block-creation', name: 'should create an image block with placeholder', description: 'Test image block factory', shouldPass: true, filePath: 'tests/utils/blockFactory.test.ts', testType: 'util', category: 'Utils' },
      { id: 'unknown-block-type', name: 'should throw error for unknown block type', description: 'Test error handling for unknown blocks', shouldPass: false, expectedError: 'Unknown block type: unknown', filePath: 'tests/utils/blockFactory.test.ts', testType: 'util', category: 'Utils' }
    ]
  },

  // Infrastructure Category
  {
    id: 'gmail-preview',
    name: 'Gmail Preview Infrastructure',
    description: 'Tests for Gmail preview user interface components and interactions',
    category: 'Infrastructure',
    filePath: 'tests/infrastructure/gmailPreview.test.tsx',
    tests: [
      { id: 'gmail-preview-button', name: 'Gmail Preview Button Visible', description: 'Verify Gmail preview button is visible in email preview', shouldPass: true, filePath: 'tests/infrastructure/gmailPreview.test.tsx', testType: 'ui', category: 'Infrastructure' },
      { id: 'gmail-modal-open', name: 'Gmail Preview Modal Opens', description: 'Test that clicking Gmail preview button opens the modal', shouldPass: true, filePath: 'tests/infrastructure/gmailPreview.test.tsx', testType: 'ui', category: 'Infrastructure' },
      { id: 'gmail-mode-switching', name: 'Desktop/Mobile Mode Switching', description: 'Test switching between desktop and mobile preview modes', shouldPass: true, filePath: 'tests/infrastructure/gmailPreview.test.tsx', testType: 'ui', category: 'Infrastructure' },
      { id: 'gmail-sidebar-labels', name: 'Gmail Sidebar Labels Render', description: 'Verify Gmail sidebar shows proper labels', shouldPass: true, filePath: 'tests/infrastructure/gmailPreview.test.tsx', testType: 'ui', category: 'Infrastructure' }
    ]
  },
  {
    id: 'analytics-architecture',
    name: 'Analytics Architecture',
    description: 'Core analytics engines and infrastructure tests',
    category: 'Infrastructure',
    filePath: 'tests/infrastructure/analyticsArchitecture.test.ts',
    tests: [
      { id: 'content-analysis-engine', name: 'Content Analysis Engine', description: 'Test core content parsing and metrics calculation', shouldPass: true, filePath: 'tests/infrastructure/analyticsArchitecture.test.ts', testType: 'processing', category: 'Infrastructure' },
      { id: 'heuristic-analysis-engine', name: 'Heuristic Analysis Engine', description: 'Test rule-based email analysis for baseline scoring', shouldPass: true, filePath: 'tests/infrastructure/analyticsArchitecture.test.ts', testType: 'processing', category: 'Infrastructure' },
      { id: 'openai-analytics-adapter', name: 'OpenAI Analytics Adapter', description: 'Test AI-powered email analysis with OpenAI integration', shouldPass: true, filePath: 'tests/infrastructure/analyticsArchitecture.test.ts', testType: 'processing', category: 'Infrastructure' },
      { id: 'memory-cache-strategy', name: 'Memory Cache Strategy', description: 'Test in-memory caching for analysis results with TTL', shouldPass: true, filePath: 'tests/infrastructure/analyticsArchitecture.test.ts', testType: 'performance', category: 'Infrastructure' },
      { id: 'analytics-service-orchestration', name: 'Analytics Service Orchestration', description: 'Test main orchestration service for email analysis workflows', shouldPass: true, filePath: 'tests/infrastructure/analyticsArchitecture.test.ts', testType: 'service', category: 'Infrastructure' }
    ]
  },
  {
    id: 'performance-tests',
    name: 'Performance Tests',
    description: 'Performance testing for analysis speed and resource usage',
    category: 'Infrastructure',
    filePath: 'tests/infrastructure/performance.test.ts',
    tests: [
      { id: 'large-email-processing', name: 'Large Email Processing Performance', description: 'Test processing performance with large email content', shouldPass: true, filePath: 'tests/infrastructure/performance.test.ts', testType: 'performance', category: 'Infrastructure' },
      { id: 'processing-timeout', name: 'Processing Timeout Handling', description: 'Test that email processing times out appropriately', shouldPass: false, expectedError: 'Processing timeout exceeded', filePath: 'tests/infrastructure/performance.test.ts', testType: 'performance', category: 'Infrastructure' },
      { id: 'concurrent-requests', name: 'Concurrent Request Handling', description: 'Test multiple simultaneous requests', shouldPass: true, filePath: 'tests/infrastructure/performance.test.ts', testType: 'performance', category: 'Infrastructure' }
    ]
  }
];

export const getUnifiedTestSummary = () => {
  const totalSuites = unifiedTestSuites.length;
  const totalTests = unifiedTestSuites.reduce((sum, suite) => sum + suite.tests.length, 0);
  
  const categoryCounts = unifiedTestSuites.reduce((acc, suite) => {
    acc[suite.category] = (acc[suite.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const testTypeCounts = unifiedTestSuites.reduce((acc, suite) => {
    suite.tests.forEach(test => {
      acc[test.testType] = (acc[test.testType] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const testCategoryCounts = unifiedTestSuites.reduce((acc, suite) => {
    suite.tests.forEach(test => {
      acc[test.category] = (acc[test.category] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  return {
    totalSuites,
    totalTests,
    categoryCounts,
    testTypeCounts,
    testCategoryCounts
  };
};
