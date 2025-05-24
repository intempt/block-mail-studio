
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
      tags: [...tags, block.type], // Auto-add block type as tag
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
      snippet.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      snippet.blockType.toLowerCase().includes(lowerQuery)
    );
  }

  static getSnippetsByTags(tags: string[]): EmailSnippet[] {
    const snippets = this.getAllSnippets();
    return snippets.filter(snippet =>
      tags.some(tag => snippet.tags.includes(tag.toLowerCase()))
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

  static getRecentSnippets(limit: number = 5): EmailSnippet[] {
    return this.getAllSnippets()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  static getCategoryStats(): Record<string, number> {
    const snippets = this.getAllSnippets();
    const stats: Record<string, number> = {};
    
    snippets.forEach(snippet => {
      stats[snippet.category] = (stats[snippet.category] || 0) + 1;
    });
    
    return stats;
  }

  static getTagCloud(): Array<{ tag: string; count: number }> {
    const snippets = this.getAllSnippets();
    const tagCounts: Record<string, number> = {};
    
    snippets.forEach(snippet => {
      snippet.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    
    return Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
  }

  static duplicateSnippet(id: string): EmailSnippet | null {
    const snippet = this.getAllSnippets().find(s => s.id === id);
    if (!snippet) return null;
    
    const duplicated: EmailSnippet = {
      ...snippet,
      id: `snippet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: `${snippet.name} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date(),
      usageCount: 0,
      isFavorite: false
    };
    
    const snippets = this.getAllSnippets();
    snippets.push(duplicated);
    localStorage.setItem(this.SNIPPETS_KEY, JSON.stringify(snippets));
    
    return duplicated;
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

  // Library management methods
  static createLibrary(name: string, description: string, snippetIds: string[] = []): SnippetLibrary {
    const library: SnippetLibrary = {
      id: `library_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      snippets: this.getAllSnippets().filter(s => snippetIds.includes(s.id)),
      isPublic: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const libraries = this.getAllLibraries();
    libraries.push(library);
    localStorage.setItem(this.LIBRARIES_KEY, JSON.stringify(libraries));
    
    return library;
  }

  static getAllLibraries(): SnippetLibrary[] {
    try {
      const stored = localStorage.getItem(this.LIBRARIES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load libraries:', error);
      return [];
    }
  }
}
