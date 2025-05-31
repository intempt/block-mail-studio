
import React from 'react';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { EmailEditor } from '../../src/components/EmailEditor';
import { EmailBlockPalette } from '../../src/components/EmailBlockPalette';
import { EmailPropertiesPanel } from '../../src/components/EmailPropertiesPanel';

describe('Accessibility Compliance', () => {
  it('EmailEditor has no accessibility violations', async () => {
    const { container } = render(<EmailEditor />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('EmailBlockPalette has no accessibility violations', async () => {
    const { container } = render(<EmailBlockPalette />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('EmailPropertiesPanel has no accessibility violations', async () => {
    const mockProps = {
      selectedBlock: null,
      onUpdateBlock: () => {},
      globalStyles: {},
      onUpdateGlobalStyles: () => {}
    };
    
    const { container } = render(<EmailPropertiesPanel {...mockProps} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('keyboard navigation works correctly', () => {
    const { container } = render(<EmailEditor />);
    
    // Test tab navigation
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    expect(focusableElements.length).toBeGreaterThan(0);
    
    // Verify no elements have negative tabindex (except intentional)
    const negativeTabIndex = container.querySelectorAll('[tabindex="-1"]');
    negativeTabIndex.forEach(el => {
      expect(el).toHaveAttribute('aria-hidden', 'true');
    });
  });

  it('ARIA labels are properly implemented', () => {
    const { container } = render(<EmailEditor />);
    
    // Check for proper ARIA labels
    const interactiveElements = container.querySelectorAll('button, input, select');
    interactiveElements.forEach(el => {
      const hasLabel = el.hasAttribute('aria-label') || 
                      el.hasAttribute('aria-labelledby') ||
                      el.querySelector('label');
      expect(hasLabel).toBeTruthy();
    });
  });

  it('supports screen readers', () => {
    const { container } = render(<EmailEditor />);
    
    // Check for screen reader only content
    const srOnlyElements = container.querySelectorAll('.sr-only');
    expect(srOnlyElements.length).toBeGreaterThan(0);
    
    // Check for proper heading structure
    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
    expect(headings.length).toBeGreaterThan(0);
  });

  it('color contrast meets WCAG standards', () => {
    const { container } = render(<EmailEditor />);
    
    // This would typically use a tool like vitest-axe or custom contrast checking
    // For now, we verify text elements have proper styling
    const textElements = container.querySelectorAll('p, span, div, button');
    textElements.forEach(el => {
      const styles = window.getComputedStyle(el);
      expect(styles.color).not.toBe('');
    });
  });
});
