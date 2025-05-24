import { EmailSnippet, SnippetLibrary } from '@/types/snippets';
import { EmailBlock } from '@/types/emailBlocks';

export class SnippetService {
  private static SNIPPETS_KEY = 'email_snippets';
  private static LIBRARIES_KEY = 'snippet_libraries';

  static async saveSnippet(block: EmailBlock, name: string, description: string, category: string, tags: string[] = []): Promise<EmailSnippet> {
    const snippet: EmailSnippet = {
      id: `snippet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      category: category as any,
      tags,
      blockData: { ...block, id: `block_${Date.now()}` },
      blockType: block.type,
      createdAt: new Date(),
      updatedAt: new Date(),
      usageCount: 0,
      isFavorite: false
    };

    const snippets = this.getAllSnippets();
    snippets.push(snippet);
    localStorage.setItem(this.SNIPPETS_KEY, JSON.stringify(snippets));
    
    return snippet;
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

  static getSnippetsByCategory(category: string): EmailSnippet[] {
    return this.getAllSnippets().filter(snippet => snippet.category === category);
  }

  static searchSnippets(query: string): EmailSnippet[] {
    const snippets = this.getAllSnippets();
    const lowerQuery = query.toLowerCase();
    
    return snippets.filter(snippet =>
      snippet.name.toLowerCase().includes(lowerQuery) ||
      snippet.description.toLowerCase().includes(lowerQuery) ||
      snippet.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  static updateSnippet(id: string, updates: Partial<EmailSnippet>): void {
    const snippets = this.getAllSnippets();
    const index = snippets.findIndex(s => s.id === id);
    
    if (index !== -1) {
      snippets[index] = { ...snippets[index], ...updates, updatedAt: new Date() };
      localStorage.setItem(this.SNIPPETS_KEY, JSON.stringify(snippets));
    }
  }

  static deleteSnippet(id: string): void {
    const snippets = this.getAllSnippets().filter(s => s.id !== id);
    localStorage.setItem(this.SNIPPETS_KEY, JSON.stringify(snippets));
  }

  static incrementUsage(id: string): void {
    const snippets = this.getAllSnippets();
    const snippet = snippets.find(s => s.id === id);
    
    if (snippet) {
      snippet.usageCount++;
      snippet.updatedAt = new Date();
      localStorage.setItem(this.SNIPPETS_KEY, JSON.stringify(snippets));
    }
  }

  static toggleFavorite(id: string): void {
    const snippets = this.getAllSnippets();
    const snippet = snippets.find(s => s.id === id);
    
    if (snippet) {
      snippet.isFavorite = !snippet.isFavorite;
      snippet.updatedAt = new Date();
      localStorage.setItem(this.SNIPPETS_KEY, JSON.stringify(snippets));
    }
  }

  static getPopularSnippets(limit: number = 10): EmailSnippet[] {
    return this.getAllSnippets()
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, limit);
  }

  static getFavoriteSnippets(): EmailSnippet[] {
    return this.getAllSnippets().filter(snippet => snippet.isFavorite);
  }

  static exportSnippets(): string {
    const snippets = this.getAllSnippets();
    return JSON.stringify(snippets, null, 2);
  }

  static importSnippets(jsonData: string): void {
    try {
      const importedSnippets = JSON.parse(jsonData);
      const existingSnippets = this.getAllSnippets();
      
      const allSnippets = [...existingSnippets];
      
      importedSnippets.forEach((snippet: EmailSnippet) => {
        if (!allSnippets.find(s => s.id === snippet.id)) {
          allSnippets.push(snippet);
        }
      });
      
      localStorage.setItem(this.SNIPPETS_KEY, JSON.stringify(allSnippets));
    } catch (error) {
      console.error('Failed to import snippets:', error);
      throw new Error('Invalid snippet data format');
    }
  }
}
