export interface TestCase {
  name: string;
  shouldPass: boolean;
  expectedError?: string;
  filePath: string;
}

export interface TestSuite {
  name: string;
  description: string;
  category: string;
  tests: TestCase[];
  filePath: string;
}

export interface TestResult {
  name: string;
  status: 'passed' | 'failed';
  duration: number;
  error?: string;
  errorType?: string;
  severity?: 'low' | 'medium' | 'high';
  stack?: string;
  details?: string;
  filePath?: string;
}

// Extract real test cases from actual test files
export const realTestSuites: TestSuite[] = [
  // Integration Tests
  {
    name: 'Email Editor Integration',
    description: 'End-to-end integration tests for the main EmailEditor component',
    category: 'Integration',
    filePath: 'tests/integration/emailEditor.test.tsx',
    tests: [
      { name: 'should render layout and block tabs', shouldPass: true, filePath: 'tests/integration/emailEditor.test.tsx' },
      { name: 'should switch between tabs correctly', shouldPass: true, filePath: 'tests/integration/emailEditor.test.tsx' },
      { name: 'should call onBlockAdd when block is clicked', shouldPass: true, filePath: 'tests/integration/emailEditor.test.tsx' },
      { name: 'should handle template loading', shouldPass: true, filePath: 'tests/integration/emailEditor.test.tsx' },
      { name: 'should save and export email content', shouldPass: true, filePath: 'tests/integration/emailEditor.test.tsx' },
      { name: 'should handle responsive preview modes', shouldPass: true, filePath: 'tests/integration/emailEditor.test.tsx' },
      { name: 'should fail with corrupted editor state', shouldPass: false, expectedError: 'Editor state corruption detected', filePath: 'tests/integration/emailEditor.test.tsx' }
    ]
  },
  {
    name: 'Drag and Drop Functionality',
    description: 'Integration tests for drag and drop functionality across the editor',
    category: 'Integration',
    filePath: 'tests/integration/dragDropFunctionality.test.tsx',
    tests: [
      { name: 'should allow dragging text blocks from palette', shouldPass: true, filePath: 'tests/integration/dragDropFunctionality.test.tsx' },
      { name: 'should handle dragstart event with correct data', shouldPass: true, filePath: 'tests/integration/dragDropFunctionality.test.tsx' },
      { name: 'should allow dragging layout presets', shouldPass: true, filePath: 'tests/integration/dragDropFunctionality.test.tsx' },
      { name: 'should handle layout dragstart with columns configuration', shouldPass: true, filePath: 'tests/integration/dragDropFunctionality.test.tsx' },
      { name: 'should accept drops and create blocks', shouldPass: true, filePath: 'tests/integration/dragDropFunctionality.test.tsx' },
      { name: 'should handle layout drops correctly', shouldPass: true, filePath: 'tests/integration/dragDropFunctionality.test.tsx' },
      { name: 'should create multiple blocks for ecommerce template', shouldPass: true, filePath: 'tests/integration/dragDropFunctionality.test.tsx' }
    ]
  },
  {
    name: 'Drag and Drop Workflows',
    description: 'Complete workflow tests for drag and drop operations',
    category: 'Integration',
    filePath: 'tests/integration/dragDropWorkflows.test.tsx',
    tests: [
      { name: 'should allow dragging text block to empty canvas', shouldPass: true, filePath: 'tests/integration/dragDropWorkflows.test.tsx' },
      { name: 'should allow dragging layout blocks to canvas', shouldPass: true, filePath: 'tests/integration/dragDropWorkflows.test.tsx' },
      { name: 'should allow selecting and deleting blocks', shouldPass: true, filePath: 'tests/integration/dragDropWorkflows.test.tsx' },
      { name: 'should allow preview mode switching', shouldPass: true, filePath: 'tests/integration/dragDropWorkflows.test.tsx' },
      { name: 'should handle multiple block drops in sequence', shouldPass: true, filePath: 'tests/integration/dragDropWorkflows.test.tsx' },
      { name: 'should validate drop zones correctly', shouldPass: true, filePath: 'tests/integration/dragDropWorkflows.test.tsx' },
      { name: 'should fail with invalid drag data', shouldPass: false, expectedError: 'Invalid drag data format', filePath: 'tests/integration/dragDropWorkflows.test.tsx' }
    ]
  },
  {
    name: 'Template Cycle Integration',
    description: 'Full template lifecycle testing from creation to reuse',
    category: 'Integration',
    filePath: 'tests/integration/templateCycle.test.tsx',
    tests: [
      { name: 'should allow creating email content in the canvas', shouldPass: true, filePath: 'tests/integration/templateCycle.test.tsx' },
      { name: 'should update subject line when user types', shouldPass: true, filePath: 'tests/integration/templateCycle.test.tsx' },
      { name: 'should save template when publish button is clicked', shouldPass: true, filePath: 'tests/integration/templateCycle.test.tsx' },
      { name: 'should handle duplicate template names correctly', shouldPass: true, filePath: 'tests/integration/templateCycle.test.tsx' },
      { name: 'should open AI assistant when blocks tab is clicked', shouldPass: true, filePath: 'tests/integration/templateCycle.test.tsx' },
      { name: 'should load template when selected from AI assistant', shouldPass: true, filePath: 'tests/integration/templateCycle.test.tsx' },
      { name: 'should allow editing loaded template content', shouldPass: true, filePath: 'tests/integration/templateCycle.test.tsx' },
      { name: 'should save modified template as new template', shouldPass: true, filePath: 'tests/integration/templateCycle.test.tsx' },
      { name: 'should complete full cycle: create → save → load → modify → save again', shouldPass: true, filePath: 'tests/integration/templateCycle.test.tsx' }
    ]
  },
  {
    name: 'Full Template Cycle End-to-End',
    description: 'Complete end-to-end template lifecycle tests',
    category: 'Integration',
    filePath: 'tests/integration/fullTemplateCycle.test.tsx',
    tests: [
      { name: 'should complete the full cycle: create → save → load → edit → save again', shouldPass: true, filePath: 'tests/integration/fullTemplateCycle.test.tsx' },
      { name: 'should handle multiple template creation and management', shouldPass: true, filePath: 'tests/integration/fullTemplateCycle.test.tsx' },
      { name: 'should maintain template state during editing session', shouldPass: true, filePath: 'tests/integration/fullTemplateCycle.test.tsx' },
      { name: 'should handle template operations with different content types', shouldPass: true, filePath: 'tests/integration/fullTemplateCycle.test.tsx' },
      { name: 'should properly integrate with DirectTemplateService', shouldPass: true, filePath: 'tests/integration/fullTemplateCycle.test.tsx' },
      { name: 'should handle service errors gracefully', shouldPass: true, filePath: 'tests/integration/fullTemplateCycle.test.tsx' },
      { name: 'should handle rapid template creation', shouldPass: true, filePath: 'tests/integration/fullTemplateCycle.test.tsx' },
      { name: 'should handle empty and edge case content', shouldPass: true, filePath: 'tests/integration/fullTemplateCycle.test.tsx' }
    ]
  },

  // Service Tests
  {
    name: 'MJML Service',
    description: 'Tests for MJML generation, conversion, and validation',
    category: 'Services',
    filePath: 'tests/services/MJMLService.test.ts',
    tests: [
      { name: 'should generate valid MJML for empty email', shouldPass: true, filePath: 'tests/services/MJMLService.test.ts' },
      { name: 'should generate MJML for text block', shouldPass: true, filePath: 'tests/services/MJMLService.test.ts' },
      { name: 'should generate MJML for image block', shouldPass: true, filePath: 'tests/services/MJMLService.test.ts' },
      { name: 'should generate MJML for button block', shouldPass: true, filePath: 'tests/services/MJMLService.test.ts' },
      { name: 'should handle responsive styling correctly', shouldPass: true, filePath: 'tests/services/MJMLService.test.ts' },
      { name: 'should convert simple MJML to HTML', shouldPass: true, filePath: 'tests/services/MJMLService.test.ts' },
      { name: 'should handle MJML conversion errors', shouldPass: true, filePath: 'tests/services/MJMLService.test.ts' },
      { name: 'should validate correct MJML structure', shouldPass: true, filePath: 'tests/services/MJMLService.test.ts' },
      { name: 'should detect invalid MJML structure', shouldPass: true, filePath: 'tests/services/MJMLService.test.ts' }
    ]
  },
  {
    name: 'Direct Template Service',
    description: 'Template management service functionality tests',
    category: 'Services',
    filePath: 'tests/services/directTemplateService.test.ts',
    tests: [
      { name: 'should create a new template with auto-generated name from subject line', shouldPass: true, filePath: 'tests/services/directTemplateService.test.ts' },
      { name: 'should handle duplicate names by appending numbers', shouldPass: true, filePath: 'tests/services/directTemplateService.test.ts' },
      { name: 'should handle empty subject line', shouldPass: true, filePath: 'tests/services/directTemplateService.test.ts' },
      { name: 'should generate unique IDs', shouldPass: true, filePath: 'tests/services/directTemplateService.test.ts' },
      { name: 'should return predefined templates', shouldPass: true, filePath: 'tests/services/directTemplateService.test.ts' },
      { name: 'should return default templates only', shouldPass: true, filePath: 'tests/services/directTemplateService.test.ts' },
      { name: 'should filter templates by name', shouldPass: true, filePath: 'tests/services/directTemplateService.test.ts' },
      { name: 'should filter templates by category', shouldPass: true, filePath: 'tests/services/directTemplateService.test.ts' },
      { name: 'should filter templates by tags', shouldPass: true, filePath: 'tests/services/directTemplateService.test.ts' },
      { name: 'should be case insensitive', shouldPass: true, filePath: 'tests/services/directTemplateService.test.ts' },
      { name: 'should return empty array for no matches', shouldPass: true, filePath: 'tests/services/directTemplateService.test.ts' },
      { name: 'should create template with generated ID and timestamps', shouldPass: true, filePath: 'tests/services/directTemplateService.test.ts' }
    ]
  },

  // Component Tests
  {
    name: 'Button Component UI',
    description: 'UI component tests for the reusable Button component',
    category: 'Components',
    filePath: 'tests/components/ui/Button.test.tsx',
    tests: [
      { name: 'should render button with text', shouldPass: true, filePath: 'tests/components/ui/Button.test.tsx' },
      { name: 'should handle click events', shouldPass: true, filePath: 'tests/components/ui/Button.test.tsx' },
      { name: 'should apply variant classes correctly', shouldPass: true, filePath: 'tests/components/ui/Button.test.tsx' },
      { name: 'should be disabled when disabled prop is true', shouldPass: true, filePath: 'tests/components/ui/Button.test.tsx' }
    ]
  },
  {
    name: 'Layout Config Panel',
    description: 'Tests for the layout configuration interface',
    category: 'Components',
    filePath: 'tests/components/LayoutConfigPanel.test.tsx',
    tests: [
      { name: 'should render layout options', shouldPass: true, filePath: 'tests/components/LayoutConfigPanel.test.tsx' },
      { name: 'should call onLayoutSelect when layout is clicked', shouldPass: true, filePath: 'tests/components/LayoutConfigPanel.test.tsx' },
      { name: 'should render in compact mode', shouldPass: true, filePath: 'tests/components/LayoutConfigPanel.test.tsx' }
    ]
  },
  {
    name: 'Email Editor Component',
    description: 'Core functionality tests for the main EmailEditor component',
    category: 'Components',
    filePath: 'tests/components/EmailEditor.test.tsx',
    tests: [
      { name: 'should render email editor with all main components', shouldPass: true, filePath: 'tests/components/EmailEditor.test.tsx' },
      { name: 'should handle subject line changes', shouldPass: true, filePath: 'tests/components/EmailEditor.test.tsx' },
      { name: 'should render OmnipresentRibbon with correct props', shouldPass: true, filePath: 'tests/components/EmailEditor.test.tsx' },
      { name: 'should handle canvas width and device mode changes', shouldPass: true, filePath: 'tests/components/EmailEditor.test.tsx' },
      { name: 'should handle preview mode switching', shouldPass: true, filePath: 'tests/components/EmailEditor.test.tsx' },
      { name: 'should render CompactAISuggestions component', shouldPass: true, filePath: 'tests/components/EmailEditor.test.tsx' },
      { name: 'should handle back navigation when provided', shouldPass: true, filePath: 'tests/components/EmailEditor.test.tsx' },
      { name: 'should initialize with empty canvas when no content provided', shouldPass: true, filePath: 'tests/components/EmailEditor.test.tsx' },
      { name: 'should handle content updates from canvas', shouldPass: true, filePath: 'tests/components/EmailEditor.test.tsx' },
      { name: 'should fail with invalid props', shouldPass: false, expectedError: 'Invalid props provided to EmailEditor', filePath: 'tests/components/EmailEditor.test.tsx' }
    ]
  },
  {
    name: 'Email Block Canvas',
    description: 'Tests for the canvas where email blocks are rendered and managed',
    category: 'Components',
    filePath: 'tests/components/EmailBlockCanvas.test.tsx',
    tests: [
      { name: 'should render empty canvas with drop zone message', shouldPass: true, filePath: 'tests/components/EmailBlockCanvas.test.tsx' },
      { name: 'should handle drag over events', shouldPass: true, filePath: 'tests/components/EmailBlockCanvas.test.tsx' },
      { name: 'should handle block drops', shouldPass: true, filePath: 'tests/components/EmailBlockCanvas.test.tsx' },
      { name: 'should handle layout drops with column configuration', shouldPass: true, filePath: 'tests/components/EmailBlockCanvas.test.tsx' },
      { name: 'should render blocks when provided', shouldPass: true, filePath: 'tests/components/EmailBlockCanvas.test.tsx' },
      { name: 'should handle block selection', shouldPass: true, filePath: 'tests/components/EmailBlockCanvas.test.tsx' },
      { name: 'should respond to preview mode changes', shouldPass: true, filePath: 'tests/components/EmailBlockCanvas.test.tsx' },
      { name: 'should handle custom preview widths', shouldPass: true, filePath: 'tests/components/EmailBlockCanvas.test.tsx' },
      { name: 'should generate MJML content when blocks are present', shouldPass: true, filePath: 'tests/components/EmailBlockCanvas.test.tsx' },
      { name: 'should fail with corrupted block data', shouldPass: false, expectedError: 'Invalid block structure detected', filePath: 'tests/components/EmailBlockCanvas.test.tsx' }
    ]
  },
  {
    name: 'All Block Renderers',
    description: 'Comprehensive tests for all email block rendering components',
    category: 'Components',
    filePath: 'tests/components/AllBlockRenderers.test.tsx',
    tests: [
      { name: 'should render all block types correctly', shouldPass: true, filePath: 'tests/components/AllBlockRenderers.test.tsx' },
      { name: 'should handle text block rendering', shouldPass: true, filePath: 'tests/components/AllBlockRenderers.test.tsx' },
      { name: 'should handle image block rendering', shouldPass: true, filePath: 'tests/components/AllBlockRenderers.test.tsx' },
      { name: 'should handle button block rendering', shouldPass: true, filePath: 'tests/components/AllBlockRenderers.test.tsx' },
      { name: 'should handle columns block rendering', shouldPass: true, filePath: 'tests/components/AllBlockRenderers.test.tsx' },
      { name: 'should handle divider block rendering', shouldPass: true, filePath: 'tests/components/AllBlockRenderers.test.tsx' },
      { name: 'should handle spacer block rendering', shouldPass: true, filePath: 'tests/components/AllBlockRenderers.test.tsx' },
      { name: 'should handle video block rendering', shouldPass: true, filePath: 'tests/components/AllBlockRenderers.test.tsx' },
      { name: 'should handle table block rendering', shouldPass: true, filePath: 'tests/components/AllBlockRenderers.test.tsx' },
      { name: 'should handle social block rendering', shouldPass: true, filePath: 'tests/components/AllBlockRenderers.test.tsx' },
      { name: 'should handle HTML block rendering', shouldPass: true, filePath: 'tests/components/AllBlockRenderers.test.tsx' },
      { name: 'should handle code block rendering', shouldPass: true, filePath: 'tests/components/AllBlockRenderers.test.tsx' },
      { name: 'should handle menu block rendering', shouldPass: true, filePath: 'tests/components/AllBlockRenderers.test.tsx' },
      { name: 'should handle MJML-specific block rendering', shouldPass: true, filePath: 'tests/components/AllBlockRenderers.test.tsx' },
      { name: 'should fail with invalid block data', shouldPass: false, expectedError: 'Invalid block data provided', filePath: 'tests/components/AllBlockRenderers.test.tsx' }
    ]
  },
  {
    name: 'Block Renderer',
    description: 'Core block rendering system tests',
    category: 'Components',
    filePath: 'tests/components/BlockRenderer.test.tsx',
    tests: [
      { name: 'should render blocks based on type', shouldPass: true, filePath: 'tests/components/BlockRenderer.test.tsx' },
      { name: 'should handle block selection and editing', shouldPass: true, filePath: 'tests/components/BlockRenderer.test.tsx' },
      { name: 'should apply responsive styling correctly', shouldPass: true, filePath: 'tests/components/BlockRenderer.test.tsx' },
      { name: 'should handle block deletion', shouldPass: true, filePath: 'tests/components/BlockRenderer.test.tsx' },
      { name: 'should manage block focus states', shouldPass: true, filePath: 'tests/components/BlockRenderer.test.tsx' }
    ]
  },
  {
    name: 'Compact AI Suggestions',
    description: 'Tests for the compact AI suggestions component',
    category: 'Components',
    filePath: 'tests/components/CompactAISuggestions.test.tsx',
    tests: [
      { name: 'should render AI suggestions interface', shouldPass: true, filePath: 'tests/components/CompactAISuggestions.test.tsx' },
      { name: 'should handle suggestion clicks', shouldPass: true, filePath: 'tests/components/CompactAISuggestions.test.tsx' },
      { name: 'should display loading states', shouldPass: true, filePath: 'tests/components/CompactAISuggestions.test.tsx' },
      { name: 'should handle empty suggestions', shouldPass: true, filePath: 'tests/components/CompactAISuggestions.test.tsx' }
    ]
  },
  {
    name: 'Email AI Chat With Templates',
    description: 'AI chat integration with template management',
    category: 'Components',
    filePath: 'tests/components/emailAIChatWithTemplates.test.tsx',
    tests: [
      { name: 'should render chat interface with template options', shouldPass: true, filePath: 'tests/components/emailAIChatWithTemplates.test.tsx' },
      { name: 'should handle template selection from chat', shouldPass: true, filePath: 'tests/components/emailAIChatWithTemplates.test.tsx' },
      { name: 'should process AI responses correctly', shouldPass: true, filePath: 'tests/components/emailAIChatWithTemplates.test.tsx' },
      { name: 'should handle template creation from AI suggestions', shouldPass: true, filePath: 'tests/components/emailAIChatWithTemplates.test.tsx' }
    ]
  },

  // Utility Tests
  {
    name: 'Block Utils',
    description: 'Utility function tests for block creation and management',
    category: 'Utils',
    filePath: 'tests/utils/blockUtils.test.ts',
    tests: [
      { name: 'should generate a unique ID with correct format', shouldPass: true, filePath: 'tests/utils/blockUtils.test.ts' },
      { name: 'should generate different IDs on multiple calls', shouldPass: true, filePath: 'tests/utils/blockUtils.test.ts' },
      { name: 'should create default styling with all device types', shouldPass: true, filePath: 'tests/utils/blockUtils.test.ts' },
      { name: 'should have consistent default values across devices', shouldPass: true, filePath: 'tests/utils/blockUtils.test.ts' }
    ]
  },
  {
    name: 'Email Utils',
    description: 'Utility functions for email content processing and validation',
    category: 'Utils',
    filePath: 'tests/utils/emailUtils.test.ts',
    tests: [
      { name: 'should generate a unique ID', shouldPass: true, filePath: 'tests/utils/emailUtils.test.ts' },
      { name: 'should wrap content in a complete HTML document', shouldPass: true, filePath: 'tests/utils/emailUtils.test.ts' },
      { name: 'should include email-specific CSS styles', shouldPass: true, filePath: 'tests/utils/emailUtils.test.ts' },
      { name: 'should remove TipTap-specific attributes', shouldPass: true, filePath: 'tests/utils/emailUtils.test.ts' }
    ]
  },
  {
    name: 'Block Factory',
    description: 'Tests for the block creation factory system',
    category: 'Utils',
    filePath: 'tests/utils/blockFactory.test.ts',
    tests: [
      { name: 'should create a text block with default content', shouldPass: true, filePath: 'tests/utils/blockFactory.test.ts' },
      { name: 'should create an image block with placeholder', shouldPass: true, filePath: 'tests/utils/blockFactory.test.ts' },
      { name: 'should create a button block with default styling', shouldPass: true, filePath: 'tests/utils/blockFactory.test.ts' },
      { name: 'should create a columns block with specified ratio', shouldPass: true, filePath: 'tests/utils/blockFactory.test.ts' },
      { name: 'should handle complex block configurations', shouldPass: true, filePath: 'tests/utils/blockFactory.test.ts' },
      { name: 'should throw error for unknown block type', shouldPass: false, expectedError: 'Unknown block type: unknown', filePath: 'tests/utils/blockFactory.test.ts' }
    ]
  }
];

// Calculate totals
export const getTestSummary = () => {
  const totalSuites = realTestSuites.length;
  const totalTests = realTestSuites.reduce((sum, suite) => sum + suite.tests.length, 0);
  const categoryCounts = realTestSuites.reduce((acc, suite) => {
    acc[suite.category] = (acc[suite.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalSuites,
    totalTests,
    categoryCounts
  };
};
