
import { EmailSnippet } from '@/types/snippets';
import { EmailBlock } from '@/types/emailBlocks';

interface SimpleBlock {
  id: string;
  type: string;
  content: any;
  styles?: Record<string, string>;
}

export class DirectSnippetService {
  private static snippetCounter = 0;
  private static sessionSnippets: EmailSnippet[] = [];

  // Create snippet from a simple block configuration
  static createSnippetFromBlock(block: SimpleBlock): EmailSnippet {
    this.snippetCounter++;
    
    console.log('Creating snippet from block:', { block });
    
    const snippet: EmailSnippet = {
      id: `snippet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: `Untitled-${this.snippetCounter} Snippet`,
      description: `Saved ${block.type} block`,
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

  // Legacy method for creating snippets from EmailBlocks
  static createSnippet(block: EmailBlock, name: string, description: string): EmailSnippet {
    console.log('Creating in-memory snippet:', { block, name, description });
    
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

    this.sessionSnippets.push(snippet);
    return snippet;
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
        blockData: { type: 'header', content: 'Default Header' },
        blockType: 'header',
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
        blockData: { type: 'button', content: 'Click Here' },
        blockType: 'button',
        createdAt: new Date(),
        updatedAt: new Date(),
        usageCount: 0,
        isFavorite: false
      }
    ];
  }
}
