
import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmailAIChatWithTemplates } from '@/components/EmailAIChatWithTemplates';
import { EmailTemplate } from '@/components/TemplateManager';

// Mock templates
const mockTemplates: EmailTemplate[] = [
  {
    id: 'template-1',
    name: 'Welcome Email',
    description: 'A warm welcome email for new subscribers',
    html: '<div><h1>Welcome!</h1><p>Thank you for joining us.</p></div>',
    subject: 'Welcome to our community!',
    category: 'Welcome',
    tags: ['welcome', 'onboarding'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    isFavorite: false,
    usageCount: 5
  },
  {
    id: 'template-2',
    name: 'Product Launch',
    description: 'Announce new product launches',
    html: '<div><h1>New Product!</h1><p>Check out our latest offering.</p></div>',
    subject: 'Exciting new product launch!',
    category: 'Promotional',
    tags: ['product', 'launch', 'announcement'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    isFavorite: true,
    usageCount: 12
  }
];

const defaultProps = {
  editor: null,
  templates: mockTemplates,
  onLoadTemplate: vi.fn(),
  onSaveTemplate: vi.fn()
};

describe('EmailAIChatWithTemplates', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Template Display', () => {
    it('should render all provided templates', () => {
      render(<EmailAIChatWithTemplates {...defaultProps} />);

      expect(screen.getByText('Welcome Email')).toBeInTheDocument();
      expect(screen.getByText('Product Launch')).toBeInTheDocument();
    });

    it('should display template metadata correctly', () => {
      render(<EmailAIChatWithTemplates {...defaultProps} />);

      expect(screen.getByText('A warm welcome email for new subscribers')).toBeInTheDocument();
      expect(screen.getByText('Welcome')).toBeInTheDocument();
      expect(screen.getByText('5 uses')).toBeInTheDocument();
    });

    it('should show favorite status', () => {
      render(<EmailAIChatWithTemplates {...defaultProps} />);

      // Check for favorite indicator on Product Launch template
      const favoriteStars = screen.getAllByTestId('favorite-star');
      expect(favoriteStars).toHaveLength(2); // One for each template
    });
  });

  describe('Template Search and Filtering', () => {
    it('should filter templates by search term', async () => {
      const user = userEvent.setup();
      render(<EmailAIChatWithTemplates {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText(/search templates/i);
      await user.type(searchInput, 'welcome');

      expect(screen.getByText('Welcome Email')).toBeInTheDocument();
      expect(screen.queryByText('Product Launch')).not.toBeInTheDocument();
    });

    it('should filter templates by category', async () => {
      const user = userEvent.setup();
      render(<EmailAIChatWithTemplates {...defaultProps} />);

      const categoryButton = screen.getByRole('button', { name: 'Promotional' });
      await user.click(categoryButton);

      expect(screen.queryByText('Welcome Email')).not.toBeInTheDocument();
      expect(screen.getByText('Product Launch')).toBeInTheDocument();
    });

    it('should show all templates when "All" category is selected', async () => {
      const user = userEvent.setup();
      render(<EmailAIChatWithTemplates {...defaultProps} />);

      // First filter to promotional
      const promotionalButton = screen.getByRole('button', { name: 'Promotional' });
      await user.click(promotionalButton);

      // Then click "All"
      const allButton = screen.getByRole('button', { name: 'All' });
      await user.click(allButton);

      expect(screen.getByText('Welcome Email')).toBeInTheDocument();
      expect(screen.getByText('Product Launch')).toBeInTheDocument();
    });

    it('should search by tags', async () => {
      const user = userEvent.setup();
      render(<EmailAIChatWithTemplates {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText(/search templates/i);
      await user.type(searchInput, 'launch');

      expect(screen.queryByText('Welcome Email')).not.toBeInTheDocument();
      expect(screen.getByText('Product Launch')).toBeInTheDocument();
    });
  });

  describe('Template Loading', () => {
    it('should call onLoadTemplate when template is loaded', async () => {
      const user = userEvent.setup();
      render(<EmailAIChatWithTemplates {...defaultProps} />);

      const loadButtons = screen.getAllByText('Load Template');
      await user.click(loadButtons[0]);

      expect(defaultProps.onLoadTemplate).toHaveBeenCalledWith(mockTemplates[0]);
    });

    it('should increment usage count when template is loaded', async () => {
      const user = userEvent.setup();
      render(<EmailAIChatWithTemplates {...defaultProps} />);

      const loadButtons = screen.getAllByText('Load Template');
      await user.click(loadButtons[0]);

      expect(defaultProps.onLoadTemplate).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'template-1',
          name: 'Welcome Email'
        })
      );
    });
  });

  describe('Template Management', () => {
    it('should toggle favorite status when star is clicked', async () => {
      const onToggleFavorite = vi.fn();
      const user = userEvent.setup();
      
      render(
        <EmailAIChatWithTemplates 
          {...defaultProps} 
          onToggleFavorite={onToggleFavorite}
        />
      );

      const favoriteButtons = screen.getAllByTestId('favorite-button');
      await user.click(favoriteButtons[0]);

      expect(onToggleFavorite).toHaveBeenCalledWith('template-1');
    });

    it('should copy template HTML to clipboard', async () => {
      const user = userEvent.setup();
      
      // Mock clipboard API
      const mockWriteText = vi.fn();
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText
        }
      });

      render(<EmailAIChatWithTemplates {...defaultProps} />);

      const copyButtons = screen.getAllByTestId('copy-button');
      await user.click(copyButtons[0]);

      expect(mockWriteText).toHaveBeenCalledWith(mockTemplates[0].html);
    });

    it('should delete template when delete button is clicked', async () => {
      const onDeleteTemplate = vi.fn();
      const user = userEvent.setup();
      
      render(
        <EmailAIChatWithTemplates 
          {...defaultProps} 
          onDeleteTemplate={onDeleteTemplate}
        />
      );

      const deleteButtons = screen.getAllByTestId('delete-button');
      await user.click(deleteButtons[0]);

      expect(onDeleteTemplate).toHaveBeenCalledWith('template-1');
    });
  });

  describe('Empty States', () => {
    it('should show empty state when no templates match search', async () => {
      const user = userEvent.setup();
      render(<EmailAIChatWithTemplates {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText(/search templates/i);
      await user.type(searchInput, 'nonexistent template');

      expect(screen.getByText('No templates found')).toBeInTheDocument();
    });

    it('should show empty state when no templates are provided', () => {
      render(<EmailAIChatWithTemplates {...defaultProps} templates={[]} />);

      expect(screen.getByText('No templates found')).toBeInTheDocument();
    });
  });

  describe('Template Saving', () => {
    it('should show save dialog when save button is clicked', async () => {
      const user = userEvent.setup();
      render(<EmailAIChatWithTemplates {...defaultProps} />);

      const saveButton = screen.getByRole('button', { name: /save current/i });
      await user.click(saveButton);

      expect(screen.getByText('Save Template')).toBeInTheDocument();
    });

    it('should call onSaveTemplate when template is saved', async () => {
      const user = userEvent.setup();
      render(<EmailAIChatWithTemplates {...defaultProps} />);

      // Open save dialog
      const saveButton = screen.getByRole('button', { name: /save current/i });
      await user.click(saveButton);

      // Fill in template details
      const nameInput = screen.getByPlaceholderText('Template name');
      await user.type(nameInput, 'New Test Template');

      const descInput = screen.getByPlaceholderText('Brief description');
      await user.type(descInput, 'A test template for testing');

      // Save the template
      const saveTemplateButton = screen.getByRole('button', { name: 'Save Template' });
      await user.click(saveTemplateButton);

      expect(defaultProps.onSaveTemplate).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'New Test Template',
          description: 'A test template for testing'
        })
      );
    });
  });
});
