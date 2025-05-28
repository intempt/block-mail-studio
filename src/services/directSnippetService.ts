import { EmailSnippet } from '@/types/snippets';
import { EmailBlock } from '@/types/emailBlocks';

export class DirectSnippetService {
  private static snippetCounter = 0;
  private static sessionSnippets: EmailSnippet[] = [];
  private static listeners: (() => void)[] = [];

  // Add listener for snippet changes
  static addChangeListener(listener: () => void) {
    this.listeners.push(listener);
  }

  // Remove listener
  static removeChangeListener(listener: () => void) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  // Notify listeners of changes
  private static notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  // Create snippet from EmailBlock with improved tracking
  static createSnippet(block: EmailBlock, name: string, description: string): EmailSnippet {
    this.snippetCounter++;
    
    console.log('Creating snippet from block:', { block, name, description });
    
    const snippet: EmailSnippet = {
      id: `snippet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: name || `${block.type} snippet`,
      description: description || `Saved ${block.type} block`,
      category: 'custom',
      tags: [block.type],
      blockData: { ...block, id: `block_${Date.now()}` },
      blockType: block.type,
      createdAt: new Date(),
      updatedAt: new Date(),
      usageCount: 0,
      isFavorite: false
    };

    // Add to session snippets
    this.sessionSnippets.push(snippet);
    
    console.log('Snippet saved to session:', snippet);
    console.log('Total snippets now:', this.sessionSnippets.length);

    // Immediate notification to all listeners
    this.notifyListeners();
    
    // Force a second notification after a tiny delay to ensure UI updates
    setTimeout(() => {
      this.notifyListeners();
    }, 50);

    return snippet;
  }

  // Save snippet method for backward compatibility
  static async saveSnippet(snippet: Omit<EmailSnippet, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>): Promise<EmailSnippet> {
    const newSnippet: EmailSnippet = {
      ...snippet,
      id: `snippet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      usageCount: 0
    };

    this.sessionSnippets.push(newSnippet);
    
    // Immediate notification
    this.notifyListeners();
    
    return newSnippet;
  }

  // Get all snippets including session snippets
  static getAllSnippets(): EmailSnippet[] {
    const allSnippets = [...this.getDefaultSnippets(), ...this.sessionSnippets];
    console.log('Getting all snippets:', allSnippets.length, 'total');
    return allSnippets;
  }

  // Get only custom snippets for the ribbon
  static getCustomSnippets(): EmailSnippet[] {
    return this.sessionSnippets;
  }

  // Delete snippet from session
  static deleteSnippet(id: string): void {
    console.log('Delete snippet called:', id);
    const beforeCount = this.sessionSnippets.length;
    this.sessionSnippets = this.sessionSnippets.filter(s => s.id !== id);
    const afterCount = this.sessionSnippets.length;
    
    if (beforeCount !== afterCount) {
      this.notifyListeners();
      console.log(`Snippet ${id} deleted. Count: ${beforeCount} -> ${afterCount}`);
      
      // Immediate notification
      this.notifyListeners();
      
      // Force a second notification to ensure UI updates
      setTimeout(() => {
        this.notifyListeners();
      }, 50);
    }
  }

  // Update snippet name
  static updateSnippetName(id: string, newName: string): void {
    const snippet = this.sessionSnippets.find(s => s.id === id);
    if (snippet) {
      snippet.name = newName;
      snippet.updatedAt = new Date();
      this.notifyListeners();
      console.log('Snippet name updated:', { id, newName });
    }
  }

  // Increment usage count
  static incrementUsage(id: string): void {
    const snippet = this.sessionSnippets.find(s => s.id === id);
    if (snippet) {
      snippet.usageCount++;
      snippet.updatedAt = new Date();
      this.notifyListeners();
      console.log('Snippet usage incremented:', id);
    }
  }

  // Generate default snippets on demand
  static getDefaultSnippets(): EmailSnippet[] {
    return [
      {
        id: 'default_header',
        name: 'Header Block',
        description: 'Simple header with logo and title',
        category: 'layout',
        tags: ['header', 'branding'],
        blockData: { 
          id: 'default_header_block',
          type: 'text', 
          content: { html: '<h1>Default Header</h1>', textStyle: 'heading1' },
          styling: {
            desktop: { width: '100%', height: 'auto' },
            tablet: { width: '100%', height: 'auto' },
            mobile: { width: '100%', height: 'auto' }
          },
          position: { x: 0, y: 0 },
          displayOptions: {
            showOnDesktop: true,
            showOnTablet: true,
            showOnMobile: true
          }
        },
        blockType: 'text',
        createdAt: new Date(),
        updatedAt: new Date(),
        usageCount: 0,
        isFavorite: false
      },
      {
        id: 'default_cta',
        name: 'Call to Action',
        description: 'Button with call to action',
        category: 'content',
        tags: ['button', 'cta'],
        blockData: { 
          id: 'default_cta_block',
          type: 'button', 
          content: { text: 'Click Here', link: '#', style: 'solid', size: 'medium' },
          styling: {
            desktop: { width: '100%', height: 'auto' },
            tablet: { width: '100%', height: 'auto' },
            mobile: { width: '100%', height: 'auto' }
          },
          position: { x: 0, y: 0 },
          displayOptions: {
            showOnDesktop: true,
            showOnTablet: true,
            showOnMobile: true
          }
        },
        blockType: 'button',
        createdAt: new Date(),
        updatedAt: new Date(),
        usageCount: 0,
        isFavorite: false
      }
    ];
  }

  // Clear all custom snippets
  static clearCustomSnippets(): void {
    this.sessionSnippets = [];
    this.notifyListeners();
    console.log('All custom snippets cleared');
  }

  // Get snippet by ID
  static getSnippetById(id: string): EmailSnippet | undefined {
    return this.getAllSnippets().find(s => s.id === id);
  }
}

// Export the service instance for backward compatibility
export const directSnippetService = DirectSnippetService;
