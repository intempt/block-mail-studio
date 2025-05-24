
import { EmailSnippet } from '@/types/snippets';
import { EmailBlock } from '@/types/emailBlocks';

export class SnippetService {
  private static SNIPPETS_KEY = 'email_snippets';

  static async saveSnippet(block: EmailBlock, name: string, description: string): Promise<EmailSnippet> {
    const snippet: EmailSnippet = {
      id: `snippet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      category: 'custom',
      tags: [block.type],
      blockData: { ...block, id: `block_${Date.now()}` },
      blockType: block.type,
      createdAt: new Date(),
      updatedAt: new Date(),
      usageCount: 0,
      isFavorite: false
    };

    try {
      const snippets = this.getAllSnippets();
      snippets.push(snippet);
      localStorage.setItem(this.SNIPPETS_KEY, JSON.stringify(snippets));
      return snippet;
    } catch (error) {
      console.error('Failed to save snippet:', error);
      return snippet;
    }
  }

  static getAllSnippets(): EmailSnippet[] {
    try {
      const stored = localStorage.getItem(this.SNIPPETS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load snippets:', error);
      return [];
    }
  }

  static deleteSnippet(id: string): void {
    try {
      const snippets = this.getAllSnippets().filter(s => s.id !== id);
      localStorage.setItem(this.SNIPPETS_KEY, JSON.stringify(snippets));
    } catch (error) {
      console.error('Failed to delete snippet:', error);
    }
  }

  static incrementUsage(id: string): void {
    try {
      const snippets = this.getAllSnippets();
      const snippet = snippets.find(s => s.id === id);
      
      if (snippet) {
        snippet.usageCount++;
        snippet.updatedAt = new Date();
        localStorage.setItem(this.SNIPPETS_KEY, JSON.stringify(snippets));
      }
    } catch (error) {
      console.error('Failed to increment usage:', error);
    }
  }
}
