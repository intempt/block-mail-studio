
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SimpleTipTapEditor } from '@/components/SimpleTipTapEditor';

describe('SimpleTipTapEditor', () => {
  const mockOnChange = vi.fn();
  const mockOnBlur = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
    mockOnBlur.mockClear();
  });

  it('should render with provided content', () => {
    render(
      <SimpleTipTapEditor
        content="<p>Test content</p>"
        onChange={mockOnChange}
        onBlur={mockOnBlur}
      />
    );
    
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should render formatting toolbar', () => {
    render(
      <SimpleTipTapEditor
        content="<p>Test content</p>"
        onChange={mockOnChange}
        onBlur={mockOnBlur}
      />
    );
    
    expect(screen.getByRole('button', { name: /bold/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /italic/i })).toBeInTheDocument();
  });

  it('should call onChange when content changes', async () => {
    render(
      <SimpleTipTapEditor
        content="<p>Initial content</p>"
        onChange={mockOnChange}
        onBlur={mockOnBlur}
      />
    );
    
    const editor = screen.getByRole('textbox');
    
    // Modify the content using TipTap commands (simulated)
    fireEvent.input(editor, {
      target: { innerHTML: '<p>Modified content</p>' },
      bubbles: true
    });
    
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalled();
    });
  });

  it('should call onBlur when editor loses focus', async () => {
    render(
      <SimpleTipTapEditor
        content="<p>Initial content</p>"
        onChange={mockOnChange}
        onBlur={mockOnBlur}
      />
    );
    
    const editor = screen.getByRole('textbox');
    
    // Focus and then blur the editor
    fireEvent.focus(editor);
    fireEvent.blur(editor);
    
    await waitFor(() => {
      expect(mockOnBlur).toHaveBeenCalled();
    });
  });

  it('should handle bold formatting button', async () => {
    render(
      <SimpleTipTapEditor
        content="<p>Test content</p>"
        onChange={mockOnChange}
        onBlur={mockOnBlur}
      />
    );
    
    const boldButton = screen.getByRole('button', { name: /bold/i });
    
    // Click bold button
    fireEvent.click(boldButton);
    
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalled();
    });
  });

  it('should handle italic formatting button', async () => {
    render(
      <SimpleTipTapEditor
        content="<p>Test content</p>"
        onChange={mockOnChange}
        onBlur={mockOnBlur}
      />
    );
    
    const italicButton = screen.getByRole('button', { name: /italic/i });
    
    // Click italic button
    fireEvent.click(italicButton);
    
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalled();
    });
  });

  it('should toggle styles when formatting buttons are clicked multiple times', async () => {
    render(
      <SimpleTipTapEditor
        content="<p>Test content</p>"
        onChange={mockOnChange}
        onBlur={mockOnBlur}
      />
    );
    
    const boldButton = screen.getByRole('button', { name: /bold/i });
    
    // Click bold button twice to toggle
    fireEvent.click(boldButton);
    fireEvent.click(boldButton);
    
    // Should have been called twice
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledTimes(2);
    });
  });

  it('should handle complex content types', () => {
    render(
      <SimpleTipTapEditor
        content="<h1>Heading</h1><p>Paragraph</p><ul><li>List item</li></ul>"
        onChange={mockOnChange}
        onBlur={mockOnBlur}
      />
    );
    
    expect(screen.getByText('Heading')).toBeInTheDocument();
    expect(screen.getByText('Paragraph')).toBeInTheDocument();
    expect(screen.getByText('List item')).toBeInTheDocument();
  });
});
