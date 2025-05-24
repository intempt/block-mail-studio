
import { EmailSnippet } from '@/types/snippets';
import { EmailBlock } from '@/types/emailBlocks';

export class SnippetService {
  private static SNIPPETS_KEY = 'email_snippets';

  static async saveSnippet(block: EmailBlock, name: string, description: string): Promise<EmailSnippet> {
    console.log('Saving snippet:', { block, name, description });
    
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
      console.log('Snippet saved successfully:', snippet);
      return snippet;
    } catch (error) {
      console.error('Failed to save snippet:', error);
      return snippet;
    }
  }

  static getAllSnippets(): EmailSnippet[] {
    try {
      console.log('Getting all snippets from localStorage');
      const stored = localStorage.getItem(this.SNIPPETS_KEY);
      const result = stored ? JSON.parse(stored) : [];
      console.log('Retrieved snippets:', result);
      return result;
    } catch (error) {
      console.error('Failed to load snippets:', error);
      return [];
    }
  }

  static deleteSnippet(id: string): void {
    try {
      console.log('Deleting snippet with id:', id);
      const snippets = this.getAllSnippets().filter(s => s.id !== id);
      localStorage.setItem(this.SNIPPETS_KEY, JSON.stringify(snippets));
      console.log('Snippet deleted successfully');
    } catch (error) {
      console.error('Failed to delete snippet:', error);
    }
  }

  static incrementUsage(id: string): void {
    try {
      console.log('Incrementing usage for snippet:', id);
      const snippets = this.getAllSnippets();
      const snippet = snippets.find(s => s.id === id);
      
      if (snippet) {
        snippet.usageCount++;
        snippet.updatedAt = new Date();
        localStorage.setItem(this.SNIPPETS_KEY, JSON.stringify(snippets));
        console.log('Usage incremented for snippet:', snippet);
      } else {
        console.warn('Snippet not found for usage increment:', id);
      }
    } catch (error) {
      console.error('Failed to increment usage:', error);
    }
  }
}
