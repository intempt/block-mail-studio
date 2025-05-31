
import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { useDragDrop } from '../../src/hooks/useDragDrop';

describe('useDragDrop', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes drag state', () => {
    const { result } = renderHook(() => useDragDrop());
    
    expect(result.current.isDragging).toBe(false);
    expect(result.current.draggedItem).toBeNull();
    expect(result.current.dropZone).toBeNull();
  });

  it('handles drag start', () => {
    const { result } = renderHook(() => useDragDrop());
    
    act(() => {
      result.current.onDragStart('test-item', 'block');
    });
    
    expect(result.current.isDragging).toBe(true);
    expect(result.current.draggedItem).toBe('test-item');
  });

  it('handles drag end', () => {
    const { result } = renderHook(() => useDragDrop());
    
    act(() => {
      result.current.onDragStart('test-item', 'block');
      result.current.onDragEnd();
    });
    
    expect(result.current.isDragging).toBe(false);
    expect(result.current.draggedItem).toBeNull();
  });

  it('handles drop zone enter', () => {
    const { result } = renderHook(() => useDragDrop());
    
    act(() => {
      result.current.onDropZoneEnter('canvas');
    });
    
    expect(result.current.dropZone).toBe('canvas');
  });

  it('handles drop zone leave', () => {
    const { result } = renderHook(() => useDragDrop());
    
    act(() => {
      result.current.onDropZoneEnter('canvas');
      result.current.onDropZoneLeave();
    });
    
    expect(result.current.dropZone).toBeNull();
  });

  it('handles successful drop', () => {
    const onDrop = vi.fn();
    const { result } = renderHook(() => useDragDrop(onDrop));
    
    act(() => {
      result.current.onDragStart('test-item', 'block');
      result.current.onDropZoneEnter('canvas');
      result.current.onDrop('canvas', 0);
    });
    
    expect(onDrop).toHaveBeenCalledWith('test-item', 'canvas', 0);
    expect(result.current.isDragging).toBe(false);
  });

  it('prevents invalid drops', () => {
    const onDrop = vi.fn();
    const { result } = renderHook(() => useDragDrop(onDrop, {
      canDrop: (item, zone) => zone !== 'invalid'
    }));
    
    act(() => {
      result.current.onDragStart('test-item', 'block');
      result.current.onDrop('invalid', 0);
    });
    
    expect(onDrop).not.toHaveBeenCalled();
  });

  it('tracks drag over position', () => {
    const { result } = renderHook(() => useDragDrop());
    
    act(() => {
      result.current.onDragOver({ x: 100, y: 200 });
    });
    
    expect(result.current.dragPosition).toEqual({ x: 100, y: 200 });
  });

  it('handles multiple drag types', () => {
    const { result } = renderHook(() => useDragDrop());
    
    act(() => {
      result.current.onDragStart('layout-item', 'layout');
    });
    
    expect(result.current.dragType).toBe('layout');
  });
});
