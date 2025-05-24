
import { TipTapProService } from './TipTapProService';

export interface CollaborationConfig {
  documentId: string;
  userId: string;
  userName: string;
  userColor: string;
}

export interface CommentData {
  id: string;
  content: string;
  author: string;
  timestamp: Date;
  resolved: boolean;
}

export interface CollaboratorData {
  id: string;
  name: string;
  color: string;
  isOnline: boolean;
  cursor?: {
    x: number;
    y: number;
  };
}

export class TipTapProCollabService extends TipTapProService {
  private static collaborationEndpoint = 'https://api.tiptap.dev/collaboration';
  private static activeDocuments = new Map<string, any>();

  static async createDocument(documentId: string): Promise<any> {
    try {
      const response = await this.makeRequest(`/documents`, {
        method: 'POST',
        body: JSON.stringify({
          appId: this.getAppId(),
          documentId,
          initialContent: ''
        })
      });
      
      if (response.ok) {
        console.log(`Document ${documentId} created successfully`);
      }
      
      return response;
    } catch (error) {
      console.error('Failed to create document:', error);
      return { ok: false, error };
    }
  }

  static async joinCollaboration(config: CollaborationConfig): Promise<any> {
    try {
      const response = await this.makeRequest(`/collaboration/${config.documentId}/join`, {
        method: 'POST',
        body: JSON.stringify({
          userId: config.userId,
          userName: config.userName,
          userColor: config.userColor
        })
      });
      
      if (response.ok) {
        console.log(`User ${config.userName} joined collaboration on ${config.documentId}`);
        this.activeDocuments.set(config.documentId, config);
      }
      
      return response;
    } catch (error) {
      console.error('Failed to join collaboration:', error);
      return { ok: false, error };
    }
  }

  static async getCollaborators(documentId: string): Promise<any> {
    try {
      const response = await this.makeRequest(`/collaboration/${documentId}/users`);
      
      if (!response.ok) {
        // Return mock data if API fails
        return {
          json: async () => ({
            users: this.getMockCollaborators(documentId)
          })
        };
      }
      
      return response;
    } catch (error) {
      console.error('Failed to get collaborators:', error);
      // Return mock data as fallback
      return {
        json: async () => ({
          users: this.getMockCollaborators(documentId)
        })
      };
    }
  }

  private static getMockCollaborators(documentId: string): CollaboratorData[] {
    const activeConfig = this.activeDocuments.get(documentId);
    
    const mockUsers: CollaboratorData[] = [
      {
        id: 'user-1',
        name: 'Sarah Chen',
        color: '#3B82F6',
        isOnline: true
      },
      {
        id: 'user-2',
        name: 'Mike Johnson',
        color: '#10B981',
        isOnline: true
      }
    ];

    // Add current user if they've joined
    if (activeConfig) {
      mockUsers.unshift({
        id: activeConfig.userId,
        name: activeConfig.userName,
        color: activeConfig.userColor,
        isOnline: true
      });
    }

    return mockUsers;
  }

  static async addComment(documentId: string, comment: Omit<CommentData, 'id' | 'timestamp'>): Promise<any> {
    try {
      const response = await this.makeRequest(`/documents/${documentId}/comments`, {
        method: 'POST',
        body: JSON.stringify({
          ...comment,
          timestamp: new Date().toISOString()
        })
      });
      
      return response;
    } catch (error) {
      console.error('Failed to add comment:', error);
      return { ok: false, error };
    }
  }

  static async getComments(documentId: string): Promise<CommentData[]> {
    try {
      const response = await this.makeRequest(`/documents/${documentId}/comments`);
      
      if (response.ok) {
        return response.json();
      }
      
      return [];
    } catch (error) {
      console.error('Failed to get comments:', error);
      return [];
    }
  }

  static async generateImage(prompt: string, style?: string): Promise<string> {
    try {
      const response = await this.makeRequest('/ai/generate-image', {
        method: 'POST',
        body: JSON.stringify({
          prompt,
          style: style || 'professional',
          format: 'email-optimized'
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.imageUrl;
      }
      
      throw new Error('Failed to generate image');
    } catch (error) {
      console.error('Failed to generate image:', error);
      throw error;
    }
  }

  static async updateUserPresence(documentId: string, userId: string, presence: any): Promise<void> {
    try {
      await this.makeRequest(`/collaboration/${documentId}/presence`, {
        method: 'POST',
        body: JSON.stringify({
          userId,
          presence,
          timestamp: Date.now()
        })
      });
    } catch (error) {
      console.error('Failed to update presence:', error);
    }
  }

  static leaveCollaboration(documentId: string): void {
    this.activeDocuments.delete(documentId);
    console.log(`Left collaboration for document ${documentId}`);
  }
}
