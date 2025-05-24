
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

export class TipTapProCollabService extends TipTapProService {
  private static collaborationEndpoint = 'https://api.tiptap.dev/collaboration';

  static async createDocument(documentId: string): Promise<any> {
    return this.makeRequest(`/documents`, {
      method: 'POST',
      body: JSON.stringify({
        appId: this.getAppId(),
        documentId,
        initialContent: ''
      })
    });
  }

  static async joinCollaboration(config: CollaborationConfig): Promise<any> {
    return this.makeRequest(`/collaboration/${config.documentId}/join`, {
      method: 'POST',
      body: JSON.stringify({
        userId: config.userId,
        userName: config.userName,
        userColor: config.userColor
      })
    });
  }

  static async getCollaborators(documentId: string): Promise<any> {
    return this.makeRequest(`/collaboration/${documentId}/users`);
  }

  static async addComment(documentId: string, comment: Omit<CommentData, 'id' | 'timestamp'>): Promise<any> {
    return this.makeRequest(`/documents/${documentId}/comments`, {
      method: 'POST',
      body: JSON.stringify({
        ...comment,
        timestamp: new Date().toISOString()
      })
    });
  }

  static async getComments(documentId: string): Promise<CommentData[]> {
    const response = await this.makeRequest(`/documents/${documentId}/comments`);
    return response.json();
  }

  static async generateImage(prompt: string, style?: string): Promise<string> {
    const response = await this.makeRequest('/ai/generate-image', {
      method: 'POST',
      body: JSON.stringify({
        prompt,
        style: style || 'professional',
        format: 'email-optimized'
      })
    });
    
    const data = await response.json();
    return data.imageUrl;
  }
}
