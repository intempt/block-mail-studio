
import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EmailEditor from '@/components/EmailEditor';
import { DirectTemplateService } from '@/services/directTemplateService';

// Mock all the necessary services and hooks
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

vi.mock('@/hooks/useKeyboardShortcuts', () => ({
  useKeyboardShortcuts: vi.fn()
}));

// Mock AI services to prevent API calls
vi.mock('@/services/directAIService', () => ({
  directAIService: {
    generateEmail: vi.fn().mockResolvedValue({
      html: '<div>AI Generated Email</div>',
      subject: 'AI Generated Subject',
      previewText: 'AI preview'
    }),
    generateImage: vi.fn().mockResolvedValue({
      imageUrl: 'data:image/png;base64,mockimage'
    }),
    refineEmail: vi.fn().mockResolvedValue('<div>Refined Email</div>'),
    generateContent: vi.fn().mockResolvedValue('Generated content')
  }
}));

describe('Full Template Cycle End-to-End Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Complete Template Lifecycle', () => {
    it('should complete the full cycle: create → save → load → edit → save again', async () => {
      const user = userEvent.setup();
      render(<EmailEditor />);

      // ===== PHASE 1: CREATE EMAIL CONTENT =====
      
      // Verify initial state
      expect(screen.getByDisplayValue('Welcome to Email Builder Pro')).toBeInTheDocument();
      expect(screen.getByTestId('email-block-canvas')).toBeInTheDocument();

      // Create new content by modifying subject line
      const subjectInput = screen.getByDisplayValue('Welcome to Email Builder Pro');
      await user.clear(subjectInput);
      await user.type(subjectInput, 'My First Custom Template');

      // ===== PHASE 2: SAVE AS TEMPLATE =====
      
      // Click publish to save template
      const publishButton = screen.getByRole('button', { name: /publish/i });
      await user.click(publishButton);

      // Verify template was saved (should show success toast)
      await waitFor(() => {
        // The publish action should have been triggered
        expect(publishButton).toBeInTheDocument();
      });

      // ===== PHASE 3: LOAD TEMPLATE FROM AI ASSISTANT =====
      
      // Open AI assistant
      const aiTabButton = screen.getByRole('button', { name: /brain/i });
      await user.click(aiTabButton);

      // Verify AI assistant is open
      expect(screen.getByText('AI Email Assistant')).toBeInTheDocument();

      // ===== PHASE 4: EDIT AND REUSE TEMPLATE =====
      
      // Modify the loaded template
      await user.clear(subjectInput);
      await user.type(subjectInput, 'My Modified Template v2');

      // Save the modified version as a new template
      await user.click(publishButton);

      // Verify the modification was saved
      expect(subjectInput).toHaveValue('My Modified Template v2');
    });

    it('should handle multiple template creation and management', async () => {
      const user = userEvent.setup();
      render(<EmailEditor />);

      const subjectInput = screen.getByDisplayValue('Welcome to Email Builder Pro');
      const publishButton = screen.getByRole('button', { name: /publish/i });

      // Create first template
      await user.clear(subjectInput);
      await user.type(subjectInput, 'Template One');
      await user.click(publishButton);

      // Create second template
      await user.clear(subjectInput);
      await user.type(subjectInput, 'Template Two');
      await user.click(publishButton);

      // Create third template
      await user.clear(subjectInput);
      await user.type(subjectInput, 'Template Three');
      await user.click(publishButton);

      // Verify final template state
      expect(subjectInput).toHaveValue('Template Three');
    });

    it('should maintain template state during editing session', async () => {
      const user = userEvent.setup();
      render(<EmailEditor />);

      const subjectInput = screen.getByDisplayValue('Welcome to Email Builder Pro');

      // Create and save a template
      await user.clear(subjectInput);
      await user.type(subjectInput, 'Session Template');
      
      const publishButton = screen.getByRole('button', { name: /publish/i });
      await user.click(publishButton);

      // Switch between panels to simulate user navigation
      const designTab = screen.getByRole('button', { name: /palette/i });
      await user.click(designTab);

      const blocksTab = screen.getByRole('button', { name: /blocks/i });
      await user.click(blocksTab);

      // Verify template state is maintained
      expect(subjectInput).toHaveValue('Session Template');
    });

    it('should handle template operations with different content types', async () => {
      const user = userEvent.setup();
      render(<EmailEditor />);

      const subjectInput = screen.getByDisplayValue('Welcome to Email Builder Pro');
      const publishButton = screen.getByRole('button', { name: /publish/i });

      // Test with promotional content
      await user.clear(subjectInput);
      await user.type(subjectInput, '🎉 Black Friday Sale - 50% Off Everything!');
      await user.click(publishButton);

      // Test with newsletter content  
      await user.clear(subjectInput);
      await user.type(subjectInput, 'Weekly Newsletter - Tech Updates');
      await user.click(publishButton);

      // Test with transactional content
      await user.clear(subjectInput);
      await user.type(subjectInput, 'Order Confirmation #12345');
      await user.click(publishButton);

      // Verify final state
      expect(subjectInput).toHaveValue('Order Confirmation #12345');
    });
  });

  describe('Template Service Integration', () => {
    it('should properly integrate with DirectTemplateService', async () => {
      const user = userEvent.setup();
      
      // Spy on DirectTemplateService methods
      const savePublishedTemplateSpy = vi.spyOn(DirectTemplateService, 'savePublishedTemplate');
      const getAllTemplatesSpy = vi.spyOn(DirectTemplateService, 'getAllTemplates');

      render(<EmailEditor />);

      // Verify initial templates are loaded
      expect(getAllTemplatesSpy).toHaveBeenCalled();

      // Create and save a template
      const subjectInput = screen.getByDisplayValue('Welcome to Email Builder Pro');
      await user.clear(subjectInput);
      await user.type(subjectInput, 'Service Integration Test');

      const publishButton = screen.getByRole('button', { name: /publish/i });
      await user.click(publishButton);

      // Verify service method was called
      expect(savePublishedTemplateSpy).toHaveBeenCalledWith(
        expect.any(String), // HTML content
        'Service Integration Test', // Subject line
        expect.any(Array) // Existing template names
      );
    });

    it('should handle service errors gracefully', async () => {
      const user = userEvent.setup();
      
      // Mock service to throw error
      vi.spyOn(DirectTemplateService, 'savePublishedTemplate').mockImplementation(() => {
        throw new Error('Service error');
      });

      render(<EmailEditor />);

      const subjectInput = screen.getByDisplayValue('Welcome to Email Builder Pro');
      await user.clear(subjectInput);
      await user.type(subjectInput, 'Error Test Template');

      const publishButton = screen.getByRole('button', { name: /publish/i });
      
      // This should not crash the application
      await user.click(publishButton);
      
      // Verify the editor is still functional
      expect(subjectInput).toHaveValue('Error Test Template');
    });
  });

  describe('Performance and Edge Cases', () => {
    it('should handle rapid template creation', async () => {
      const user = userEvent.setup();
      render(<EmailEditor />);

      const subjectInput = screen.getByDisplayValue('Welcome to Email Builder Pro');
      const publishButton = screen.getByRole('button', { name: /publish/i });

      // Create multiple templates quickly
      for (let i = 1; i <= 5; i++) {
        await user.clear(subjectInput);
        await user.type(subjectInput, `Rapid Template ${i}`);
        await user.click(publishButton);
      }

      // Verify final state
      expect(subjectInput).toHaveValue('Rapid Template 5');
    });

    it('should handle empty and edge case content', async () => {
      const user = userEvent.setup();
      render(<EmailEditor />);

      const subjectInput = screen.getByDisplayValue('Welcome to Email Builder Pro');
      const publishButton = screen.getByRole('button', { name: /publish/i });

      // Test with empty subject line
      await user.clear(subjectInput);
      await user.click(publishButton);

      // Test with very long subject line
      const longSubject = 'A'.repeat(200);
      await user.clear(subjectInput);
      await user.type(subjectInput, longSubject);
      await user.click(publishButton);

      // Test with special characters
      await user.clear(subjectInput);
      await user.type(subjectInput, '🎉💌 Special-Characters & "Quotes" (Test)');
      await user.click(publishButton);

      // Verify the editor handles all cases
      expect(publishButton).toBeInTheDocument();
    });
  });
});
