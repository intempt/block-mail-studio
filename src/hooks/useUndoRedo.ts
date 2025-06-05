
import { useState, useCallback, useRef } from 'react';

interface UndoRedoState<T> {
  past: T[];
  present: T;
  future: T[];
}

interface UseUndoRedoOptions {
  maxHistorySize?: number;
}

export function useUndoRedo<T>(
  initialState: T,
  options: UseUndoRedoOptions = {}
) {
  const { maxHistorySize = 50 } = options;
  
  const [state, setState] = useState<UndoRedoState<T>>({
    past: [],
    present: initialState,
    future: []
  });

  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;

  const undo = useCallback(() => {
    if (!canUndo) return;

    const previous = state.past[state.past.length - 1];
    const newPast = state.past.slice(0, state.past.length - 1);

    setState({
      past: newPast,
      present: previous,
      future: [state.present, ...state.future]
    });
  }, [state, canUndo]);

  const redo = useCallback(() => {
    if (!canRedo) return;

    const next = state.future[0];
    const newFuture = state.future.slice(1);

    setState({
      past: [...state.past, state.present],
      present: next,
      future: newFuture
    });
  }, [state, canRedo]);

  const pushState = useCallback((newState: T) => {
    // Don't add to history if the state hasn't actually changed
    if (JSON.stringify(newState) === JSON.stringify(state.present)) {
      return;
    }

    const newPast = [...state.past, state.present];
    
    // Limit history size
    if (newPast.length > maxHistorySize) {
      newPast.shift();
    }

    setState({
      past: newPast,
      present: newState,
      future: [] // Clear future when new state is pushed
    });
  }, [state.present, maxHistorySize]);

  const reset = useCallback((newState: T) => {
    setState({
      past: [],
      present: newState,
      future: []
    });
  }, []);

  return {
    state: state.present,
    canUndo,
    canRedo,
    undo,
    redo,
    pushState,
    reset
  };
}
