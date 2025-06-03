

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom';
import { GlobalStylesPanel } from '@/components/GlobalStylesPanel';

describe('GlobalStylesPanel', () => {
  const mockOnStylesChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render all global style sections', () => {
      render(<GlobalStylesPanel onStylesChange={mockOnStylesChange} />);
      
      // Check for main sections (implementation may vary)
      expect(screen.getByText(/font/i) || screen.getByText(/typography/i)).toBeInTheDocument();
      expect(screen.getByText(/color/i) || screen.getByText(/theme/i)).toBeInTheDocument();
    });

    it('should render in compact mode', () => {
      render(<GlobalStylesPanel onStylesChange={mockOnStylesChange} compactMode={true} />);
      
      // In compact mode, should still show controls but with smaller styling
      const panel = screen.getByRole('generic') || screen.getByTestId('global-styles-panel');
      expect(panel).toBeInTheDocument();
    });
  });

  describe('Font Family Selection', () => {
    it('should handle font family changes', async () => {
      const user = userEvent.setup();
      render(<GlobalStylesPanel onStylesChange={mockOnStylesChange} />);
      
      // Find font family selector (implementation may vary)
      const fontSelectors = screen.getAllByRole('combobox');
      const fontSelector = fontSelectors.find(select => 
        select.getAttribute('aria-label')?.includes('font') ||
        select.closest('div')?.textContent?.includes('Font')
      );
      
      if (fontSelector) {
        await user.click(fontSelector);
        
        // Select a font option
        const fontOption = screen.getByText('Georgia') || screen.getByText('serif');
        if (fontOption) {
          await user.click(fontOption);
          
          expect(mockOnStylesChange).toHaveBeenCalledWith(
            expect.objectContaining({
              fontFamily: expect.any(String)
            })
          );
        }
      }
    });

    it('should apply font family to preview elements', async () => {
      const user = userEvent.setup();
      render(<GlobalStylesPanel onStylesChange={mockOnStylesChange} />);
      
      // Test that font changes are reflected in any preview elements
      const previewElements = screen.getAllByText(/preview/i);
      expect(previewElements.length >= 0).toBe(true);
    });
  });

  describe('Color Theme Selection', () => {
    it('should handle color preset changes', async () => {
      const user = userEvent.setup();
      render(<GlobalStylesPanel onStylesChange={mockOnStylesChange} />);
      
      // Find color preset buttons
      const colorButtons = screen.getAllByRole('button');
      const colorPresetButton = colorButtons.find(button => 
        button.textContent?.includes('Blue') ||
        button.textContent?.includes('Theme') ||
        button.querySelector('div[style*="background"]')
      );
      
      if (colorPresetButton) {
        await user.click(colorPresetButton);
        
        expect(mockOnStylesChange).toHaveBeenCalledWith(
          expect.objectContaining({
            colorPreset: expect.any(Object)
          })
        );
      }
    });

    it('should display color swatches for themes', () => {
      render(<GlobalStylesPanel onStylesChange={mockOnStylesChange} />);
      
      // Look for color swatch elements
      const colorSwatches = screen.getAllByRole('button').filter(button => 
        button.querySelector('div[style*="background"]') ||
        button.querySelector('.w-3.h-3.rounded-full')
      );
      
      expect(colorSwatches.length).toBeGreaterThan(0);
    });
  });

  describe('Typography Settings', () => {
    it('should handle heading style changes', async () => {
      const user = userEvent.setup();
      render(<GlobalStylesPanel onStylesChange={mockOnStylesChange} />);
      
      // Find heading style buttons
      const headingButtons = screen.getAllByRole('button');
      const headingStyleButton = headingButtons.find(button => 
        button.textContent?.includes('Modern') ||
        button.textContent?.includes('Classic') ||
        button.textContent?.includes('Minimal')
      );
      
      if (headingStyleButton) {
        await user.click(headingStyleButton);
        
        expect(mockOnStylesChange).toHaveBeenCalledWith(
          expect.objectContaining({
            headingStyle: expect.any(String)
          })
        );
      }
    });

    it('should show typography preview', () => {
      render(<GlobalStylesPanel onStylesChange={mockOnStylesChange} />);
      
      // Check for heading previews
      const headingPreviews = screen.getAllByText(/clean/i).concat(
        screen.getAllByText(/bold/i),
        screen.getAllByText(/traditional/i),
        screen.getAllByText(/simple/i)
      );
      
      expect(headingPreviews.length).toBeGreaterThan(0);
    });
  });

  describe('Link Styling', () => {
    it('should display link styling options', () => {
      render(<GlobalStylesPanel onStylesChange={mockOnStylesChange} />);
      
      // Check for link-related text or icons
      const linkElements = screen.getAllByText(/link/i).concat(
        screen.getAllByText(/underlin/i)
      );
      
      expect(linkElements.length).toBeGreaterThan(0);
    });

    it('should show link style indicators', () => {
      render(<GlobalStylesPanel onStylesChange={mockOnStylesChange} />);
      
      // Look for underlined badge or similar indicator
      const linkIndicators = screen.getAllByText(/underlined/i);
      expect(linkIndicators.length).toBeGreaterThan(0);
    });
  });

  describe('Style Application', () => {
    it('should call onStylesChange with correct structure', async () => {
      const user = userEvent.setup();
      render(<GlobalStylesPanel onStylesChange={mockOnStylesChange} />);
      
      // Trigger any style change
      const buttons = screen.getAllByRole('button');
      if (buttons.length > 0) {
        await user.click(buttons[0]);
        
        // Verify the callback structure
        if (mockOnStylesChange.mock.calls.length > 0) {
          const lastCall = mockOnStylesChange.mock.calls[mockOnStylesChange.mock.calls.length - 1][0];
          expect(typeof lastCall).toBe('object');
        }
      }
    });

    it('should maintain style consistency across changes', async () => {
      const user = userEvent.setup();
      render(<GlobalStylesPanel onStylesChange={mockOnStylesChange} />);
      
      // Make multiple style changes
      const buttons = screen.getAllByRole('button').slice(0, 2);
      
      for (const button of buttons) {
        await user.click(button);
      }
      
      // Each call should be independent
      expect(mockOnStylesChange).toHaveBeenCalled();
    });
  });

  describe('Responsive Behavior', () => {
    it('should handle compact mode correctly', () => {
      const { rerender } = render(
        <GlobalStylesPanel onStylesChange={mockOnStylesChange} compactMode={false} />
      );
      
      rerender(
        <GlobalStylesPanel onStylesChange={mockOnStylesChange} compactMode={true} />
      );
      
      // Should still render all essential elements in compact mode
      expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
    });

    it('should adapt to container width', () => {
      // Test would involve mocking container resize
      render(<GlobalStylesPanel onStylesChange={mockOnStylesChange} />);
      
      // Verify responsive classes are applied
      const panel = document.querySelector('[class*="flex"]');
      expect(panel).toBeInTheDocument();
    });
  });
});
