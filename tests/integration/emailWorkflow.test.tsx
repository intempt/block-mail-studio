
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { EmailEditor } from '../../src/components/EmailEditor';

vi.mock('../../src/services/EmailAIService', () => ({
  EmailAIService: {
    generateEmailContent: vi.fn(() => Promise.resolve('Generated content')),
    analyzeEmailPerformance: vi.fn(() => Promise.resolve({ score: 85, suggestions: [] }))
  }
}));

describe('Email Editor Workflow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('completes full email creation workflow', async () => {
    render(<EmailEditor />);
    
    // 1. Start with empty canvas
    expect(screen.getByText('Drag blocks here to start building')).toBeInTheDocument();
    
    // 2. Add text block from palette
    const textBlock = screen.getByTestId('palette-block-text');
    const canvas = screen.getByTestId('email-canvas');
    
    fireEvent.dragStart(textBlock);
    fireEvent.dragOver(canvas);
    fireEvent.drop(canvas);
    
    // 3. Verify block was added
    await waitFor(() => {
      expect(screen.getByTestId('block-text-1')).toBeInTheDocument();
    });
    
    // 4. Select and edit block
    fireEvent.click(screen.getByTestId('block-text-1'));
    expect(screen.getByTestId('properties-panel')).toBeInTheDocument();
    
    // 5. Update block content
    const contentInput = screen.getByLabelText('Content');
    fireEvent.change(contentInput, { target: { value: '<p>Updated content</p>' } });
    
    // 6. Add image block
    const imageBlock = screen.getByTestId('palette-block-image');
    fireEvent.dragStart(imageBlock);
    fireEvent.drop(canvas);
    
    await waitFor(() => {
      expect(screen.getByTestId('block-image-1')).toBeInTheDocument();
    });
    
    // 7. Generate preview
    fireEvent.click(screen.getByText('Preview'));
    expect(screen.getByTestId('email-preview')).toBeInTheDocument();
    
    // 8. Export email
    fireEvent.click(screen.getByText('Export HTML'));
    await waitFor(() => {
      expect(screen.getByText('Email exported successfully')).toBeInTheDocument();
    });
  });

  it('handles AI content generation workflow', async () => {
    render(<EmailEditor />);
    
    // Open AI assistant
    fireEvent.click(screen.getByText('AI Assistant'));
    
    // Enter prompt
    const promptInput = screen.getByPlaceholderText('Describe your email...');
    fireEvent.change(promptInput, { target: { value: 'Create a welcome email' } });
    
    // Generate content
    fireEvent.click(screen.getByText('Generate'));
    
    await waitFor(() => {
      expect(screen.getByText('Generated content')).toBeInTheDocument();
    });
    
    // Apply generated content
    fireEvent.click(screen.getByText('Apply'));
    
    await waitFor(() => {
      expect(screen.getByTestId('block-text-1')).toBeInTheDocument();
    });
  });

  it('handles template import and customization', async () => {
    render(<EmailEditor />);
    
    // Open template library
    fireEvent.click(screen.getByText('Templates'));
    
    // Select template
    fireEvent.click(screen.getByTestId('template-welcome'));
    
    await waitFor(() => {
      expect(screen.getAllByTestId(/block-/)).toHaveLength(3);
    });
    
    // Customize template
    fireEvent.click(screen.getByTestId('block-text-1'));
    
    const styleInput = screen.getByLabelText('Background Color');
    fireEvent.change(styleInput, { target: { value: '#FF5733' } });
    
    // Verify customization applied
    const block = screen.getByTestId('block-text-1');
    expect(block).toHaveStyle({ backgroundColor: '#FF5733' });
  });

  it('handles responsive design workflow', async () => {
    render(<EmailEditor />);
    
    // Add block
    const textBlock = screen.getByTestId('palette-block-text');
    const canvas = screen.getByTestId('email-canvas');
    
    fireEvent.dragStart(textBlock);
    fireEvent.drop(canvas);
    
    await waitFor(() => {
      expect(screen.getByTestId('block-text-1')).toBeInTheDocument();
    });
    
    // Select block and open properties
    fireEvent.click(screen.getByTestId('block-text-1'));
    
    // Switch to mobile view
    fireEvent.click(screen.getByText('Mobile'));
    
    // Update mobile-specific styling
    const mobilePadding = screen.getByLabelText('Mobile Padding');
    fireEvent.change(mobilePadding, { target: { value: '8px' } });
    
    // Switch to preview mode
    fireEvent.click(screen.getByText('Preview'));
    
    // Toggle mobile preview
    fireEvent.click(screen.getByTestId('mobile-preview-toggle'));
    
    // Verify mobile styles applied
    const previewBlock = screen.getByTestId('preview-block-text-1');
    expect(previewBlock).toHaveStyle({ padding: '8px' });
  });

  it('handles error states gracefully', async () => {
    // Mock API failure
    const mockError = vi.fn(() => Promise.reject(new Error('API Error')));
    vi.mocked(require('../../src/services/EmailAIService').EmailAIService.generateEmailContent).mockImplementation(mockError);
    
    render(<EmailEditor />);
    
    // Try to generate content
    fireEvent.click(screen.getByText('AI Assistant'));
    fireEvent.change(screen.getByPlaceholderText('Describe your email...'), { 
      target: { value: 'Create an email' } 
    });
    fireEvent.click(screen.getByText('Generate'));
    
    // Verify error handling
    await waitFor(() => {
      expect(screen.getByText('Failed to generate content')).toBeInTheDocument();
    });
  });
});
