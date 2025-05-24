
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  color: string;
  isOnline: boolean;
  lastSeen: Date;
  cursor?: {
    x: number;
    y: number;
    blockId?: string;
  };
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  blockId?: string;
  position?: { x: number; y: number };
  createdAt: Date;
  resolved: boolean;
  replies: Comment[];
}

export interface CollaborationState {
  users: User[];
  comments: Comment[];
  isLocked: boolean;
  lockedBy?: string;
  version: number;
}

export interface CollaborationEvent {
  type: 'user-join' | 'user-leave' | 'cursor-move' | 'content-change' | 'comment-add' | 'comment-resolve';
  userId: string;
  data: any;
  timestamp: Date;
}

export class CollaborationService {
  private static instance: CollaborationService;
  private eventListeners: Map<string, Function[]> = new Map();
  private collaborationState: CollaborationState = {
    users: [],
    comments: [],
    isLocked: false,
    version: 1
  };
  private currentUser: User | null = null;
  private simulatedUsers: User[] = [];

  static getInstance(): CollaborationService {
    if (!this.instance) {
      this.instance = new CollaborationService();
    }
    return this.instance;
  }

  // Initialize collaboration session
  async initSession(user: User): Promise<void> {
    this.currentUser = user;
    this.addUser(user);
    this.simulateCollaborators();
    
    // Simulate real-time events
    this.startEventSimulation();
  }

  // User management
  addUser(user: User): void {
    const existingIndex = this.collaborationState.users.findIndex(u => u.id === user.id);
    if (existingIndex >= 0) {
      this.collaborationState.users[existingIndex] = user;
    } else {
      this.collaborationState.users.push(user);
    }
    
    this.emitEvent({
      type: 'user-join',
      userId: user.id,
      data: user,
      timestamp: new Date()
    });
  }

  removeUser(userId: string): void {
    this.collaborationState.users = this.collaborationState.users.filter(u => u.id !== userId);
    
    this.emitEvent({
      type: 'user-leave',
      userId,
      data: null,
      timestamp: new Date()
    });
  }

  updateUserCursor(userId: string, cursor: User['cursor']): void {
    const user = this.collaborationState.users.find(u => u.id === userId);
    if (user) {
      user.cursor = cursor;
      
      this.emitEvent({
        type: 'cursor-move',
        userId,
        data: cursor,
        timestamp: new Date()
      });
    }
  }

  // Comments management
  addComment(content: string, blockId?: string, position?: { x: number; y: number }): Comment {
    if (!this.currentUser) throw new Error('No user session');
    
    const comment: Comment = {
      id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: this.currentUser.id,
      userName: this.currentUser.name,
      content,
      blockId,
      position,
      createdAt: new Date(),
      resolved: false,
      replies: []
    };
    
    this.collaborationState.comments.push(comment);
    
    this.emitEvent({
      type: 'comment-add',
      userId: this.currentUser.id,
      data: comment,
      timestamp: new Date()
    });
    
    return comment;
  }

  resolveComment(commentId: string): void {
    const comment = this.collaborationState.comments.find(c => c.id === commentId);
    if (comment) {
      comment.resolved = true;
      
      this.emitEvent({
        type: 'comment-resolve',
        userId: this.currentUser?.id || '',
        data: { commentId },
        timestamp: new Date()
      });
    }
  }

  addReply(commentId: string, content: string): Comment | null {
    if (!this.currentUser) return null;
    
    const parentComment = this.collaborationState.comments.find(c => c.id === commentId);
    if (!parentComment) return null;
    
    const reply: Comment = {
      id: `reply_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: this.currentUser.id,
      userName: this.currentUser.name,
      content,
      createdAt: new Date(),
      resolved: false,
      replies: []
    };
    
    parentComment.replies.push(reply);
    return reply;
  }

  // Event system
  on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emitEvent(event: CollaborationEvent): void {
    const listeners = this.eventListeners.get(event.type);
    if (listeners) {
      listeners.forEach(callback => callback(event));
    }
  }

  // Getters
  getCollaborationState(): CollaborationState {
    return { ...this.collaborationState };
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  getOnlineUsers(): User[] {
    return this.collaborationState.users.filter(u => u.isOnline);
  }

  getComments(blockId?: string): Comment[] {
    if (blockId) {
      return this.collaborationState.comments.filter(c => c.blockId === blockId && !c.resolved);
    }
    return this.collaborationState.comments.filter(c => !c.resolved);
  }

  // Simulation methods
  private simulateCollaborators(): void {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];
    
    this.simulatedUsers = [
      {
        id: 'user_1',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        color: colors[0],
        isOnline: true,
        lastSeen: new Date()
      },
      {
        id: 'user_2',
        name: 'Mike Chen',
        email: 'mike@example.com',
        color: colors[1],
        isOnline: true,
        lastSeen: new Date()
      }
    ];
    
    this.simulatedUsers.forEach(user => this.addUser(user));
  }

  private startEventSimulation(): void {
    // Simulate cursor movements
    setInterval(() => {
      this.simulatedUsers.forEach(user => {
        if (Math.random() > 0.7) {
          this.updateUserCursor(user.id, {
            x: Math.random() * 800,
            y: Math.random() * 600,
            blockId: `block_${Math.floor(Math.random() * 5)}`
          });
        }
      });
    }, 3000);
    
    // Simulate occasional comments
    setTimeout(() => {
      this.simulateComment();
    }, 10000);
  }

  private simulateComment(): void {
    const comments = [
      'This looks great! Maybe we could adjust the color?',
      'I think this section needs more emphasis.',
      'Perfect! This aligns well with our brand.',
      'Could we make this CTA more prominent?'
    ];
    
    const randomUser = this.simulatedUsers[Math.floor(Math.random() * this.simulatedUsers.length)];
    const randomComment = comments[Math.floor(Math.random() * comments.length)];
    
    // Temporarily switch current user for simulation
    const originalUser = this.currentUser;
    this.currentUser = randomUser;
    this.addComment(randomComment, `block_${Math.floor(Math.random() * 5)}`);
    this.currentUser = originalUser;
  }
}
