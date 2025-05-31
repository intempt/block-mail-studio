
import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { useEmailBlocks } from '../../src/hooks/useEmailBlocks';
import { EmailBlock } from '../../src/types/emailBlocks';

const mockBlocks: EmailBlock[] = [
  {
    id: 'test-1',
    type: 'text',
    content: { html: '<p>Test</p>' },
    styling: { desktop: {} },
    position: { x: 0, y: 0 },
    displayOptions: { showOnDesktop: true, showOnTablet: true, showOnMobile: true }
  }
];

describe('useEmailBlocks', () => {
  it('initializes with provided blocks', () => {
    const { result } = renderHook(() => useEmailBlocks(mockBlocks));
    expect(result.current.blocks).toEqual(mockBlocks);
  });

  it('adds new block', () => {
    const { result } = renderHook(() => useEmailBlocks([]));
    
    const newBlock = {
      id: 'new-1',
      type: 'text',
      content: { html: '<p>New</p>' },
      styling: { desktop: {} },
      position: { x: 0, y: 0 },
      displayOptions: { showOnDesktop: true, showOnTablet: true, showOnMobile: true }
    };
    
    act(() => {
      result.current.addBlock(newBlock);
    });
    
    expect(result.current.blocks).toContain(newBlock);
  });

  it('updates existing block', () => {
    const { result } = renderHook(() => useEmailBlocks(mockBlocks));
    
    act(() => {
      result.current.updateBlock('test-1', { content: { html: '<p>Updated</p>' } });
    });
    
    expect(result.current.blocks[0].content.html).toBe('<p>Updated</p>');
  });

  it('deletes block', () => {
    const { result } = renderHook(() => useEmailBlocks(mockBlocks));
    
    act(() => {
      result.current.deleteBlock('test-1');
    });
    
    expect(result.current.blocks).toHaveLength(0);
  });

  it('duplicates block', () => {
    const { result } = renderHook(() => useEmailBlocks(mockBlocks));
    
    act(() => {
      result.current.duplicateBlock('test-1');
    });
    
    expect(result.current.blocks).toHaveLength(2);
    expect(result.current.blocks[1].content).toEqual(mockBlocks[0].content);
    expect(result.current.blocks[1].id).not.toBe('test-1');
  });

  it('moves block position', () => {
    const multipleBlocks = [
      ...mockBlocks,
      {
        id: 'test-2',
        type: 'image',
        content: { src: '', alt: '' },
        styling: { desktop: {} },
        position: { x: 0, y: 0 },
        displayOptions: { showOnDesktop: true, showOnTablet: true, showOnMobile: true }
      }
    ];
    
    const { result } = renderHook(() => useEmailBlocks(multipleBlocks));
    
    act(() => {
      result.current.moveBlock(0, 1);
    });
    
    expect(result.current.blocks[0].id).toBe('test-2');
    expect(result.current.blocks[1].id).toBe('test-1');
  });

  it('calls onChange callback when blocks change', () => {
    const onBlocksChange = vi.fn();
    const { result } = renderHook(() => useEmailBlocks([], onBlocksChange));
    
    act(() => {
      result.current.addBlock(mockBlocks[0]);
    });
    
    expect(onBlocksChange).toHaveBeenCalledWith([mockBlocks[0]]);
  });

  it('provides default content for block types', () => {
    const { result } = renderHook(() => useEmailBlocks([]));
    
    const textContent = result.current.getDefaultContent('text');
    expect(textContent).toEqual({ html: 'New text block' });
    
    const imageContent = result.current.getDefaultContent('image');
    expect(imageContent).toEqual({ src: '', alt: '' });
  });

  it('provides default styles for block types', () => {
    const { result } = renderHook(() => useEmailBlocks([]));
    
    const defaultStyles = result.current.getDefaultStyles('text');
    expect(defaultStyles).toHaveProperty('width');
    expect(defaultStyles).toHaveProperty('padding');
  });
});
