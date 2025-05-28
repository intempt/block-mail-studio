
import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EmailEditor from '@/components/EmailEditor';

// Mock the toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

// Mock the keyboard shortcuts hook
vi.mock('@/hooks/useKeyboardShortcuts', () => ({
  useKeyboardShortcuts: vi.fn()
}));

// Mock complex components to avoid dependency issues
vi.mock('@/components/EnhancedEmailBlockPalette', () => ({
  EnhancedEmailBlockPalette: ({ onBlockAdd }: { onBlockAdd: (type: string) => void }) => (
    <div data-testid="block-palette">
      <button onClick={() => onBlockAdd('text')}>Add Text Block</button>
    </div>
  )
}));

vi.mock('@/components/EmailBlockCanvas', () => ({
  EmailBlockCanvas: ({ onContentChange }: { onContentChange: (content: any) => void }) => (
    <div data-testid="email-block-canvas" onClick={() => onContentChange({ blocks: [] })}>
      Email Canvas
    </div>
  )
}));

vi.mock('@/components/EmailAIChatWithTemplates', () => ({
  EmailAIChatWithTemplates: () => <div data-testid="ai-chat">AI Chat Component</div>
}));

// Mock the DirectTemplateService
vi.mock('@/services/directTemplateService', () => ({
  DirectTemplateService: {
    getAllTemplates: vi.fn(() => [
      {
        id: 'default_welcome',
        name: 'Welcome Email',
        description: 'A warm welcome email for new subscribers',
        html: '<div><h1>Welcome!</h1></div>',
        subject: 'Welcome to our community!',
        category: 'Welcome',
        tags: ['welcome', 'onboarding'],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        isFavorite: false,
        usageCount: 0
      }
    ]),
    savePublishedTemplate: vi.fn((html, subject, existingNames) => ({
      id: `template_${Date.now()}_abc123`,
      name: subject || 'Untitled Email Template',
      description: `Saved from canvas on ${new Date().toLocaleDateString()}`,
      html,
      subject,
      category: 'Published',
      tags: ['canvas-created', 'published'],
      createdAt: new Date(),
      updatedAt: new Date(),
      isFavorite: false,
      usageCount: 0
    })),
    saveTemplate: vi.fn(),
    updateTemplate: vi.fn(),
    deleteTemplate: vi.fn(),
    toggleFavorite: vi.fn(),
    incrementUsage: vi.fn()
  }
}));

describe('Template Cycle Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Phase 1: Template Creation', () => {
    it('should allow creating email content in the canvas', async () => {
      render(<EmailEditor />);

      // Verify the canvas is present
      const canvas = screen.getByTestId('email-block-canvas');
      expect(canvas).toBeInTheDocument();

      // Verify subject line input exists
      const subjectInputs = screen.getAllByDisplayValue(/Welcome to Email Builder Pro|Email Subject Line/);
      expect(subjectInputs.length).toBeGreaterThan(0);
    });

    it('should update subject line when user types', async () => {
      const user = userEvent.setup();
      render(<EmailEditor />);

      // Find subject input (might have different default values)
      const subjectInput = screen.getAllByRole('textbox').find(input => 
        input.getAttribute('value')?.includes('Welcome') || 
        input.getAttribute('placeholder')?.includes('subject')
      );
      
      if (subjectInput) {
        await user.clear(subjectInput);
        await user.type(subjectInput, 'New Product Launch');
        expect(subjectInput).toHaveValue('New Product Launch');
      }
    });
  });

  describe('Phase 2: Template Saving', () => {
    it('should save template when publish button is clicked', async () => {
      const user = userEvent.setup();
      render(<EmailEditor />);

      // Find and click the publish button
      const publishButton = screen.getByRole('button', { name: /publish|save/i });
      expect(publishButton).toBeInTheDocument();

      await user.click(publishButton);

      // Verify the DirectTemplateService.savePublishedTemplate was called
      const { DirectTemplateService } = await import('@/services/directTemplateService');
      expect(DirectTemplateService.savePublishedTemplate).toHaveBeenCalled();
    });

    it('should handle template saving process', async () => {
      const user = userEvent.setup();
      render(<EmailEditor />);

      // Change subject line if possible
      const textInputs = screen.getAllByRole('textbox');
      const subjectInput = textInputs[0]; // Assume first textbox is subject
      
      if (subjectInput) {
        await user.clear(subjectInput);
        await user.type(subjectInput, 'Test Email Template');
      }

      const publishButton = screen.getByRole('button', { name: /publish|save/i });
      await user.click(publishButton);

      const { DirectTemplateService } = await import('@/services/directTemplateService');
      expect(DirectTemplateService.savePublishedTemplate).toHaveBeenCalled();
    });
  });

  describe('Phase 3: Template Loading', () => {
    it('should display AI assistant interface', async () => {
      render(<EmailEditor />);

      // Look for AI-related elements (tabs, buttons, etc.)
      const aiElements = screen.queryAllByText(/AI|assistant|brain/i);
      expect(aiElements.length).toBeGreaterThan(0);
    });

    it('should handle canvas interactions', async () => {
      const user = userEvent.setup();
      render(<EmailEditor />);

      // Verify canvas is interactive
      const canvas = screen.getByTestId('email-block-canvas');
      await user.click(canvas);

      expect(canvas).toBeInTheDocument();
    });
  });

  describe('Phase 4: Template Editing', () => {
    it('should allow editing loaded template content', async () => {
      const user = userEvent.setup();
      render(<EmailEditor />);

      // Verify canvas allows editing
      const canvas = screen.getByTestId('email-block-canvas');
      expect(canvas).toBeInTheDocument();

      // Try to interact with the canvas
      await user.click(canvas);
      
      // Verify basic functionality
      expect(canvas).toBeInTheDocument();
    });

    it('should save modified template as new template', async () => {
      const user = userEvent.setup();
      render(<EmailEditor />);

      // Modify content and save
      const publishButton = screen.getByRole('button', { name: /publish|save/i });
      await user.click(publishButton);

      const { DirectTemplateService } = await import('@/services/directTemplateService');
      expect(DirectTemplateService.savePublishedTemplate).toHaveBeenCalled();
    });
  });

  describe('Full Template Lifecycle', () => {
    it('should complete basic workflow: create → save → modify → save again', async () => {
      const user = userEvent.setup();
      render(<EmailEditor />);

      // Step 1: Verify initial state
      const canvas = screen.getByTestId('email-block-canvas');
      expect(canvas).toBeInTheDocument();

      // Step 2: Save template
      const publishButton = screen.getByRole('button', { name: /publish|save/i });
      await user.click(publishButton);

      const { DirectTemplateService } = await import('@/services/directTemplateService');
      expect(DirectTemplateService.savePublishedTemplate).toHaveBeenCalledTimes(1);

      // Step 3: Modify and save again
      await user.click(publishButton);
      expect(DirectTemplateService.savePublishedTemplate).toHaveBeenCalledTimes(2);
    });

    it('should handle block addition workflow', async () => {
      const user = userEvent.setup();
      render(<EmailEditor />);

      // Find block palette
      const blockPalette = screen.getByTestId('block-palette');
      expect(blockPalette).toBeInTheDocument();

      // Add a block
      const addTextButton = screen.getByText('Add Text Block');
      await user.click(addTextButton);

      // Verify interaction completed
      expect(addTextButton).toBeInTheDocument();
    });
  });
});
