
import { EmailSnippet } from '@/types/snippets';
import { EmailBlock } from '@/types/emailBlocks';
import { SnippetReference, UniversalChange, ChangeImpact } from '@/types/universal';
import { DirectSnippetService } from './directSnippetService';

export class UniversalSnippetService {
  private static changeListeners: ((change: UniversalChange) => void)[] = [];
  private static snippetReferences: Map<string, SnippetReference[]> = new Map();

  // Add change listener
  static addChangeListener(listener: (change: UniversalChange) => void) {
    this.changeListeners.push(listener);
  }

  // Remove change listener
  static removeChangeListener(listener: (change: UniversalChange) => void) {
    this.changeListeners = this.changeListeners.filter(l => l !== listener);
  }

  // Notify listeners of universal changes
  private static notifyChange(change: UniversalChange) {
    this.changeListeners.forEach(listener => listener(change));
  }

  // Register snippet reference for a template
  static registerSnippetReference(templateId: string, snippetId: string, customizations?: Record<string, any>) {
    const reference: SnippetReference = {
      snippetId,
      customizations,
      locked: false,
      version: this.getSnippetVersion(snippetId)
    };

    const existing = this.snippetReferences.get(templateId) || [];
    const updated = existing.filter(ref => ref.snippetId !== snippetId);
    updated.push(reference);
    
    this.snippetReferences.set(templateId, updated);
    console.log('Registered snippet reference:', { templateId, snippetId });
  }

  // Get snippet references for a template
  static getSnippetReferences(templateId: string): SnippetReference[] {
    return this.snippetReferences.get(templateId) || [];
  }

  // Update snippet universally across all templates
  static updateSnippetUniversally(snippetId: string, updates: Partial<EmailSnippet>): ChangeImpact[] {
    console.log('Updating snippet universally:', { snippetId, updates });
    
    const affectedTemplates = this.getTemplatesUsingSnippet(snippetId);
    const impacts: ChangeImpact[] = [];

    // Update the snippet itself
    const snippet = DirectSnippetService.getSnippetById(snippetId);
    if (!snippet) {
      console.warn('Snippet not found:', snippetId);
      return impacts;
    }

    // Calculate impact for each affected template
    affectedTemplates.forEach(templateId => {
      const references = this.getSnippetReferences(templateId);
      const reference = references.find(ref => ref.snippetId === snippetId);
      
      if (reference && !reference.locked) {
        const impact = this.calculateSnippetImpact(templateId, snippetId, updates);
        impacts.push(impact);
      }
    });

    // Create universal change record
    const change: UniversalChange = {
      id: `change_${Date.now()}`,
      type: 'snippet',
      targetId: snippetId,
      changes: updates,
      affectedTemplates,
      timestamp: new Date(),
      status: 'pending'
    };

    this.notifyChange(change);
    return impacts;
  }

  // Get templates using a specific snippet
  static getTemplatesUsingSnippet(snippetId: string): string[] {
    const templates: string[] = [];
    
    this.snippetReferences.forEach((references, templateId) => {
      if (references.some(ref => ref.snippetId === snippetId)) {
        templates.push(templateId);
      }
    });

    return templates;
  }

  // Calculate impact of snippet changes on a template
  private static calculateSnippetImpact(templateId: string, snippetId: string, updates: Partial<EmailSnippet>): ChangeImpact {
    const snippet = DirectSnippetService.getSnippetById(snippetId);
    const changes = [];

    if (updates.name && snippet?.name !== updates.name) {
      changes.push({
        property: 'name',
        oldValue: snippet?.name,
        newValue: updates.name
      });
    }

    if (updates.blockData && snippet?.blockData) {
      changes.push({
        property: 'content',
        oldValue: snippet.blockData.content,
        newValue: updates.blockData.content
      });
    }

    return {
      templateId,
      templateName: `Template ${templateId}`,
      changes,
      severity: changes.length > 1 ? 'high' : changes.length === 1 ? 'medium' : 'low'
    };
  }

  // Get snippet version for tracking
  private static getSnippetVersion(snippetId: string): string {
    const snippet = DirectSnippetService.getSnippetById(snippetId);
    return snippet ? snippet.updatedAt.toISOString() : new Date().toISOString();
  }

  // Apply universal changes to all affected templates
  static applyUniversalChanges(changeId: string): boolean {
    console.log('Applying universal changes:', changeId);
    // Implementation would update all affected templates
    // For now, we'll mark the change as applied
    return true;
  }

  // Lock/unlock snippet for universal updates
  static toggleSnippetLock(templateId: string, snippetId: string): void {
    const references = this.getSnippetReferences(templateId);
    const reference = references.find(ref => ref.snippetId === snippetId);
    
    if (reference) {
      reference.locked = !reference.locked;
      console.log('Toggled snippet lock:', { templateId, snippetId, locked: reference.locked });
    }
  }

  // Clear all references (for testing)
  static clearAllReferences(): void {
    this.snippetReferences.clear();
  }
}
