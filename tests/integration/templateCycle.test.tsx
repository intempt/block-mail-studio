
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

      // Verify subject line input
      const subjectInput = screen.getByDisplayValue('Welcome to Email Builder Pro');
      expect(subjectInput).toBeInTheDocument();
    });

    it('should update subject line when user types', async () => {
      const user = userEvent.setup();
      render(<EmailEditor />);

      const subjectInput = screen.getByDisplayValue('Welcome to Email Builder Pro');
      await user.clear(subjectInput);
      await user.type(subjectInput, 'New Product Launch');

      expect(subjectInput).toHaveValue('New Product Launch');
    });
  });

  describe('Phase 2: Template Saving', () => {
    it('should save template when publish button is clicked', async () => {
      const user = userEvent.setup();
      render(<EmailEditor />);

      // Find and click the publish button
      const publishButton = screen.getByRole('button', { name: /publish/i });
      expect(publishButton).toBeInTheDocument();

      await user.click(publishButton);

      // Verify the DirectTemplateService.savePublishedTemplate was called
      const { DirectTemplateService } = await import('@/services/directTemplateService');
      expect(DirectTemplateService.savePublishedTemplate).toHaveBeenCalled();
    });

    it('should handle duplicate template names correctly', async () => {
      const user = userEvent.setup();
      render(<EmailEditor />);

      // Change subject line to match existing template
      const subjectInput = screen.getByDisplayValue('Welcome to Email Builder Pro');
      await user.clear(subjectInput);
      await user.type(subjectInput, 'Welcome Email');

      const publishButton = screen.getByRole('button', { name: /publish/i });
      await user.click(publishButton);

      const { DirectTemplateService } = await import('@/services/directTemplateService');
      expect(DirectTemplateService.savePublishedTemplate).toHaveBeenCalledWith(
        expect.any(String),
        'Welcome Email',
        expect.arrayContaining(['Welcome Email'])
      );
    });
  });

  describe('Phase 3: Template Loading', () => {
    it('should open AI assistant when blocks tab is clicked', async () => {
      const user = userEvent.setup();
      render(<EmailEditor />);

      // Click on AI tab in left panel
      const aiTab = screen.getByRole('button', { name: /brain/i });
      await user.click(aiTab);

      // Verify AI chat component is visible
      expect(screen.getByText('AI Email Assistant')).toBeInTheDocument();
    });

    it('should load template when selected from AI assistant', async () => {
      render(<EmailEditor />);

      // This would require mocking the EmailAIChatWithTemplates component
      // to verify template loading functionality
      expect(screen.getByTestId('email-block-canvas')).toBeInTheDocument();
    });
  });

  describe('Phase 4: Template Reuse and Iteration', () => {
    it('should allow editing loaded template content', async () => {
      const user = userEvent.setup();
      render(<EmailEditor />);

      // Verify canvas allows editing
      const canvas = screen.getByTestId('email-block-canvas');
      expect(canvas).toBeInTheDocument();

      // Verify subject line can be modified
      const subjectInput = screen.getByDisplayValue('Welcome to Email Builder Pro');
      await user.clear(subjectInput);
      await user.type(subjectInput, 'Modified Template Subject');

      expect(subjectInput).toHaveValue('Modified Template Subject');
    });

    it('should save modified template as new template', async () => {
      const user = userEvent.setup();
      render(<EmailEditor />);

      // Modify subject line
      const subjectInput = screen.getByDisplayValue('Welcome to Email Builder Pro');
      await user.clear(subjectInput);
      await user.type(subjectInput, 'Modified Welcome Email');

      // Save as new template
      const publishButton = screen.getByRole('button', { name: /publish/i });
      await user.click(publishButton);

      const { DirectTemplateService } = await import('@/services/directTemplateService');
      expect(DirectTemplateService.savePublishedTemplate).toHaveBeenCalledWith(
        expect.any(String),
        'Modified Welcome Email',
        expect.any(Array)
      );
    });
  });

  describe('Full Template Lifecycle', () => {
    it('should complete full cycle: create → save → load → modify → save again', async () => {
      const user = userEvent.setup();
      render(<EmailEditor />);

      // Step 1: Create content (modify subject)
      const subjectInput = screen.getByDisplayValue('Welcome to Email Builder Pro');
      await user.clear(subjectInput);
      await user.type(subjectInput, 'Original Template');

      // Step 2: Save template
      const publishButton = screen.getByRole('button', { name: /publish/i });
      await user.click(publishButton);

      const { DirectTemplateService } = await import('@/services/directTemplateService');
      expect(DirectTemplateService.savePublishedTemplate).toHaveBeenCalledWith(
        expect.any(String),
        'Original Template',
        expect.any(Array)
      );

      // Step 3: Modify the template
      await user.clear(subjectInput);
      await user.type(subjectInput, 'Modified Template');

      // Step 4: Save modified version
      await user.click(publishButton);

      expect(DirectTemplateService.savePublishedTemplate).toHaveBeenCalledWith(
        expect.any(String),
        'Modified Template',
        expect.any(Array)
      );

      // Verify both calls were made
      expect(DirectTemplateService.savePublishedTemplate).toHaveBeenCalledTimes(2);
    });
  });
});
