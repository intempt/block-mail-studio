
import React, { createContext, useContext, useEffect, useState } from 'react';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';

interface CollaborationContextType {
  provider: WebsocketProvider | null;
  ydoc: Y.Doc;
  isConnected: boolean;
  collaborators: CollaboratorPresence[];
  addComment: (comment: CommentData) => void;
  comments: CommentData[];
}

interface CollaboratorPresence {
  userId: string;
  userName: string;
  userColor: string;
  cursor?: { x: number; y: number };
  selection?: { from: number; to: number };
  isOnline: boolean;
}

interface CommentData {
  id: string;
  content: string;
  author: string;
  timestamp: Date;
  resolved: boolean;
  position: number;
  replies: CommentReply[];
}

interface CommentReply {
  id: string;
  content: string;
  author: string;
  timestamp: Date;
}

const CollaborationContext = createContext<CollaborationContextType | null>(null);

export const useCollaboration = () => {
  const context = useContext(CollaborationContext);
  if (!context) {
    throw new Error('useCollaboration must be used within CollaborationProvider');
  }
  return context;
};

interface CollaborationProviderProps {
  children: React.ReactNode;
  documentId: string;
  userId: string;
  userName: string;
  userColor?: string;
}

export const CollaborationProvider: React.FC<CollaborationProviderProps> = ({
  children,
  documentId,
  userId,
  userName,
  userColor = '#3B82F6'
}) => {
  const [ydoc] = useState(() => new Y.Doc());
  const [provider, setProvider] = useState<WebsocketProvider | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [collaborators, setCollaborators] = useState<CollaboratorPresence[]>([]);
  const [comments, setComments] = useState<CommentData[]>([]);

  useEffect(() => {
    // Create WebSocket provider for real-time collaboration
    const wsProvider = new WebsocketProvider(
      'wss://demos.yjs.dev', // Use demo server for now, replace with your own
      documentId,
      ydoc
    );

    wsProvider.on('status', (event: any) => {
      setIsConnected(event.status === 'connected');
    });

    // Set up awareness for presence
    const awareness = wsProvider.awareness;
    awareness.setLocalStateField('user', {
      userId,
      userName,
      userColor,
      cursor: null,
      selection: null
    });

    awareness.on('change', () => {
      const states = Array.from(awareness.getStates().values());
      const activeCollaborators = states
        .filter((state: any) => state.user && state.user.userId !== userId)
        .map((state: any) => ({
          userId: state.user.userId,
          userName: state.user.userName,
          userColor: state.user.userColor,
          cursor: state.user.cursor,
          selection: state.user.selection,
          isOnline: true
        }));
      
      setCollaborators(activeCollaborators);
    });

    setProvider(wsProvider);

    return () => {
      wsProvider.destroy();
    };
  }, [documentId, userId, userName, userColor, ydoc]);

  const addComment = (comment: Omit<CommentData, 'id' | 'timestamp' | 'replies'>) => {
    const newComment: CommentData = {
      ...comment,
      id: `comment-${Date.now()}`,
      timestamp: new Date(),
      replies: []
    };
    setComments(prev => [...prev, newComment]);
  };

  return (
    <CollaborationContext.Provider value={{
      provider,
      ydoc,
      isConnected,
      collaborators,
      addComment,
      comments
    }}>
      {children}
    </CollaborationContext.Provider>
  );
};
