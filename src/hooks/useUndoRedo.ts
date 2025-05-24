
import { useState, useCallback, useRef } from 'react';

interface UndoRedoState<T> {
  past: T[];
  present: T;
  future: T[];
}

interface UndoRedoActions<T> {
  set: (newState: T, skipHistory?: boolean) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  clear: () => void;
  getHistory: () => { past: T[]; future: T[] };
}

const MAX_HISTORY_SIZE = 50;

export function useUndoRedo<T>(initialState: T): [T, UndoRedoActions<T>] {
  const [state, setState] = useState<UndoRedoState<T>>({
    past: [],
    present: initialState,
    future: []
  });

  const lastActionTime = useRef(Date.now());
  const DEBOUNCE_MS = 500; // Group changes within 500ms

  const set = useCallback((newState: T, skipHistory = false) => {
    const now = Date.now();
    const shouldDebounce = now - lastActionTime.current < DEBOUNCE_MS;
    
    setState(prevState => {
      if (skipHistory || (shouldDebounce && prevState.past.length > 0)) {
        // Replace the current state without adding to history
        return {
          ...prevState,
          present: newState
        };
      }

      // Add current state to history
      const newPast = [...prevState.past, prevState.present];
      
      // Limit history size
      if (newPast.length > MAX_HISTORY_SIZE) {
        newPast.shift();
      }

      return {
        past: newPast,
        present: newState,
        future: [] // Clear future when new action is performed
      };
    });

    lastActionTime.current = now;
  }, []);

  const undo = useCallback(() => {
    setState(prevState => {
      if (prevState.past.length === 0) return prevState;

      const previous = prevState.past[prevState.past.length - 1];
      const newPast = prevState.past.slice(0, prevState.past.length - 1);

      return {
        past: newPast,
        present: previous,
        future: [prevState.present, ...prevState.future]
      };
    });
  }, []);

  const redo = useCallback(() => {
    setState(prevState => {
      if (prevState.future.length === 0) return prevState;

      const next = prevState.future[0];
      const newFuture = prevState.future.slice(1);

      return {
        past: [...prevState.past, prevState.present],
        present: next,
        future: newFuture
      };
    });
  }, []);

  const clear = useCallback(() => {
    setState(prevState => ({
      past: [],
      present: prevState.present,
      future: []
    }));
  }, []);

  const getHistory = useCallback(() => ({
    past: state.past,
    future: state.future
  }), [state.past, state.future]);

  const actions: UndoRedoActions<T> = {
    set,
    undo,
    redo,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
    clear,
    getHistory
  };

  return [state.present, actions];
}
