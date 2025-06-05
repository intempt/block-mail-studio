import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Undo, Redo } from 'lucide-react';
import { EmailBlock } from '@/types/emailBlocks';
import { DevWrapper } from './dev/DevWrapper';

interface EmailEditorState {
  id: string;
  timestamp: number;
  blocks: EmailBlock[];
  subject: string;
  description: string;
}

interface UndoManagerProps {
  onUndo?: () => void;
  onRedo?: () => void;
  blocks?: EmailBlock[];
  subject?: string;
  onStateRestore?: (state: EmailEditorState) => void;
}

export const UndoManager: React.FC<UndoManagerProps> = ({
  onUndo,
  onRedo,
  blocks = [],
  subject = '',
  onStateRestore
}) => {
  const [stateHistory, setStateHistory] = useState<EmailEditorState[]>([]);
  const [currentStateIndex, setCurrentStateIndex] = useState(-1);
  const [isInitialized, setIsInitialized] = useState(false);

  // Create a new state entry
  const createState = useCallback((blocks: EmailBlock[], subject: string, description: string): EmailEditorState => {
    return {
      id: `state-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      blocks: JSON.parse(JSON.stringify(blocks)), // Deep clone
      subject,
      description
    };
  }, []);

  // Save current state to history
  const saveState = useCallback((description: string = 'Change made') => {
    if (!blocks || blocks.length === 0) return;

    const newState = createState(blocks, subject, description);
    
    setStateHistory(prev => {
      // Remove any states after current index (for new branch)
      const newHistory = prev.slice(0, currentStateIndex + 1);
      
      // Add new state
      newHistory.push(newState);
      
      // Limit history size to 50 states
      if (newHistory.length > 50) {
        return newHistory.slice(-50);
      }
      
      return newHistory;
    });
    
    setCurrentStateIndex(prev => {
      const newIndex = Math.min(prev + 1, 49);
      return newIndex;
    });

    console.log('UndoManager: State saved -', description);
  }, [blocks, subject, currentStateIndex, createState]);

  // Initialize with first state
  useEffect(() => {
    if (!isInitialized && blocks.length > 0) {
      const initialState = createState(blocks, subject, 'Initial state');
      setStateHistory([initialState]);
      setCurrentStateIndex(0);
      setIsInitialized(true);
      console.log('UndoManager: Initialized with initial state');
    }
  }, [blocks, subject, isInitialized, createState]);

  // Auto-save state when blocks or subject change (debounced)
  useEffect(() => {
    if (!isInitialized) return;

    const timeoutId = setTimeout(() => {
      // Check if there's actually a change
      const currentState = stateHistory[currentStateIndex];
      if (currentState) {
        const hasBlocksChanged = JSON.stringify(currentState.blocks) !== JSON.stringify(blocks);
        const hasSubjectChanged = currentState.subject !== subject;
        
        if (hasBlocksChanged || hasSubjectChanged) {
          let description = 'Auto-save';
          if (hasBlocksChanged && hasSubjectChanged) {
            description = 'Blocks and subject changed';
          } else if (hasBlocksChanged) {
            description = 'Blocks changed';
          } else if (hasSubjectChanged) {
            description = 'Subject changed';
          }
          
          saveState(description);
        }
      }
    }, 1000); // 1 second debounce

    return () => clearTimeout(timeoutId);
  }, [blocks, subject, isInitialized, stateHistory, currentStateIndex, saveState]);

  const handleUndo = useCallback(() => {
    if (currentStateIndex > 0) {
      const newIndex = currentStateIndex - 1;
      const previousState = stateHistory[newIndex];
      
      if (previousState && onStateRestore) {
        setCurrentStateIndex(newIndex);
        onStateRestore(previousState);
        console.log('UndoManager: Undo to state -', previousState.description);
      }
    }
    
    // Call original onUndo if provided
    onUndo?.();
  }, [currentStateIndex, stateHistory, onStateRestore, onUndo]);

  const handleRedo = useCallback(() => {
    if (currentStateIndex < stateHistory.length - 1) {
      const newIndex = currentStateIndex + 1;
      const nextState = stateHistory[newIndex];
      
      if (nextState && onStateRestore) {
        setCurrentStateIndex(newIndex);
        onStateRestore(nextState);
        console.log('UndoManager: Redo to state -', nextState.description);
      }
    }
    
    // Call original onRedo if provided
    onRedo?.();
  }, [currentStateIndex, stateHistory, onStateRestore, onRedo]);

  const canUndo = currentStateIndex > 0;
  const canRedo = currentStateIndex < stateHistory.length - 1;

  return (
    <DevWrapper componentName="UndoManager" htmlId="undo-manager-container">
      <div className="flex gap-2">
        <DevWrapper componentName="UndoButton" htmlId="undo-button">
          <Button
            variant="outline"
            size="sm"
            onClick={handleUndo}
            disabled={!canUndo}
            className="h-8 w-8 p-0"
            title={`Undo (${stateHistory.length > 0 ? stateHistory[Math.max(0, currentStateIndex - 1)]?.description || 'Previous change' : 'No previous state'})`}
          >
            <Undo className="w-4 h-4" />
          </Button>
        </DevWrapper>
        
        <DevWrapper componentName="RedoButton" htmlId="redo-button">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRedo}
            disabled={!canRedo}
            className="h-8 w-8 p-0"
            title={`Redo (${currentStateIndex < stateHistory.length - 1 ? stateHistory[currentStateIndex + 1]?.description || 'Next change' : 'No next state'})`}
          >
            <Redo className="w-4 h-4" />
          </Button>
        </DevWrapper>
        
        <DevWrapper componentName="StateIndicator" htmlId="state-indicator">
          <div className="flex items-center text-xs text-gray-500 ml-2">
            {stateHistory.length > 0 && (
              <span>
                {currentStateIndex + 1} / {stateHistory.length}
              </span>
            )}
          </div>
        </DevWrapper>
      </div>
    </DevWrapper>
  );
};
