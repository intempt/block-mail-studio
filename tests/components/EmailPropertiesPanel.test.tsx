
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { EmailPropertiesPanel } from '../../src/components/EmailPropertiesPanel';
import { EmailBlock } from '../../src/types/emailBlocks';

const mockTextBlock: EmailBlock = {
  id: 'test-1',
  type: 'text',
  content: { html: '<p>Test</p>' },
  styling: { desktop: { padding: '16px', fontSize: '14px' } },
  position: { x: 0, y: 0 },
  displayOptions: { showOnDesktop: true, showOnTablet: true, showOnMobile: true }
};

describe('EmailPropertiesPanel', () => {
  const mockProps = {
    selectedBlock: mockTextBlock,
    onUpdateBlock: vi.fn(),
    globalStyles: {},
    onUpdateGlobalStyles: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders properties panel', () => {
    render(<EmailPropertiesPanel {...mockProps} />);
    expect(screen.getByTestId('properties-panel')).toBeInTheDocument();
  });

  it('shows block-specific properties', () => {
    render(<EmailPropertiesPanel {...mockProps} />);
    expect(screen.getByText('Text Properties')).toBeInTheDocument();
  });

  it('handles styling updates', () => {
    render(<EmailPropertiesPanel {...mockProps} />);
    const paddingInput = screen.getByLabelText('Padding');
    
    fireEvent.change(paddingInput, { target: { value: '20px' } });
    expect(mockProps.onUpdateBlock).toHaveBeenCalled();
  });

  it('shows responsive styling options', () => {
    render(<EmailPropertiesPanel {...mockProps} />);
    expect(screen.getByText('Desktop')).toBeInTheDocument();
    expect(screen.getByText('Tablet')).toBeInTheDocument();
    expect(screen.getByText('Mobile')).toBeInTheDocument();
  });

  it('handles device-specific styling', () => {
    render(<EmailPropertiesPanel {...mockProps} />);
    
    fireEvent.click(screen.getByText('Mobile'));
    const mobileInput = screen.getByLabelText('Mobile Padding');
    
    fireEvent.change(mobileInput, { target: { value: '12px' } });
    expect(mockProps.onUpdateBlock).toHaveBeenCalled();
  });

  it('shows empty state when no block selected', () => {
    render(<EmailPropertiesPanel {...mockProps} selectedBlock={null} />);
    expect(screen.getByText('Select a block to edit properties')).toBeInTheDocument();
  });

  it('handles global styles', () => {
    render(<EmailPropertiesPanel {...mockProps} />);
    
    fireEvent.click(screen.getByText('Global Styles'));
    expect(screen.getByText('Email Background')).toBeInTheDocument();
  });

  it('validates input values', () => {
    render(<EmailPropertiesPanel {...mockProps} />);
    const paddingInput = screen.getByLabelText('Padding');
    
    fireEvent.change(paddingInput, { target: { value: 'invalid' } });
    expect(screen.getByText('Invalid padding value')).toBeInTheDocument();
  });

  it('supports undo/redo for changes', () => {
    render(<EmailPropertiesPanel {...mockProps} />);
    
    fireEvent.keyDown(document, { key: 'z', ctrlKey: true });
    expect(mockProps.onUpdateBlock).toHaveBeenCalled();
  });
});
