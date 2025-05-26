
import { EmailSnippet } from '@/types/snippets';
import { EmailBlock } from '@/types/emailBlocks';

export class DirectSnippetService {
  private static snippetCounter = 0;
  private static sessionSnippets: EmailSnippet[] = [];

  // Create snippet from EmailBlock
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
    return newSnippet;
  }

  // Get all snippets including session snippets
  static getAllSnippets(): EmailSnippet[] {
    console.log('Getting snippets:', [...this.getDefaultSnippets(), ...this.sessionSnippets]);
    return [...this.getDefaultSnippets(), ...this.sessionSnippets];
  }

  // Delete snippet from session
  static deleteSnippet(id: string): void {
    console.log('Delete snippet called:', id);
    this.sessionSnippets = this.sessionSnippets.filter(s => s.id !== id);
  }

  // Update snippet name
  static updateSnippetName(id: string, newName: string): void {
    const snippet = this.sessionSnippets.find(s => s.id === id);
    if (snippet) {
      snippet.name = newName;
      snippet.updatedAt = new Date();
      console.log('Snippet name updated:', { id, newName });
    }
  }

  // No-op - no persistent storage
  static incrementUsage(id: string): void {
    console.log('Increment usage called (no-op):', id);
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
}

// Export the service instance for backward compatibility
export const directSnippetService = DirectSnippetService;
