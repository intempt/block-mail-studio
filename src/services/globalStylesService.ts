
import { GlobalStyleDefinition, UniversalChange, ChangeImpact } from '@/types/universal';

export class GlobalStylesService {
  private static styles: Map<string, GlobalStyleDefinition> = new Map();
  private static changeListeners: ((change: UniversalChange) => void)[] = [];
  private static templateStyles: Map<string, Record<string, string>> = new Map();

  // Initialize default global styles
  static initializeDefaultStyles() {
    const defaultStyles: GlobalStyleDefinition[] = [
      {
        id: 'email-bg-color',
        property: 'backgroundColor',
        value: '#ffffff',
        cssVariable: '--email-bg-color',
        scope: 'email',
        category: 'background'
      },
      {
        id: 'text-font-family',
        property: 'fontFamily',
        value: 'Arial, sans-serif',
        cssVariable: '--text-font-family',
        scope: 'text',
        category: 'typography'
      },
      {
        id: 'text-color',
        property: 'color',
        value: '#333333',
        cssVariable: '--text-color',
        scope: 'text',
        category: 'typography'
      },
      {
        id: 'heading-color',
        property: 'color',
        value: '#1a1a1a',
        cssVariable: '--heading-color',
        scope: 'headings',
        category: 'typography'
      },
      {
        id: 'button-bg-color',
        property: 'backgroundColor',
        value: '#007bff',
        cssVariable: '--button-bg-color',
        scope: 'buttons',
        category: 'buttons'
      },
      {
        id: 'button-text-color',
        property: 'color',
        value: '#ffffff',
        cssVariable: '--button-text-color',
        scope: 'buttons',
        category: 'buttons'
      },
      {
        id: 'link-color',
        property: 'color',
        value: '#007bff',
        cssVariable: '--link-color',
        scope: 'links',
        category: 'links'
      }
    ];

    defaultStyles.forEach(style => {
      this.styles.set(style.id, style);
    });

    console.log('Initialized default global styles:', defaultStyles.length);
  }

  // Add change listener
  static addChangeListener(listener: (change: UniversalChange) => void) {
    this.changeListeners.push(listener);
  }

  // Remove change listener
  static removeChangeListener(listener: (change: UniversalChange) => void) {
    this.changeListeners = this.changeListeners.filter(l => l !== listener);
  }

  // Get all global styles
  static getAllStyles(): GlobalStyleDefinition[] {
    if (this.styles.size === 0) {
      this.initializeDefaultStyles();
    }
    return Array.from(this.styles.values());
  }

  // Get styles by scope
  static getStylesByScope(scope: string): GlobalStyleDefinition[] {
    return this.getAllStyles().filter(style => style.scope === scope);
  }

  // Update global style universally
  static updateStyleUniversally(styleId: string, newValue: string): ChangeImpact[] {
    console.log('Updating style universally:', { styleId, newValue });
    
    const style = this.styles.get(styleId);
    if (!style) {
      console.warn('Style not found:', styleId);
      return [];
    }

    const oldValue = style.value;
    const affectedTemplates = Array.from(this.templateStyles.keys());
    
    // Update the style
    style.value = newValue;
    this.styles.set(styleId, style);

    // Calculate impact
    const impacts: ChangeImpact[] = affectedTemplates.map(templateId => ({
      templateId,
      templateName: `Template ${templateId}`,
      changes: [{
        property: style.property,
        oldValue,
        newValue
      }],
      severity: this.calculateStyleSeverity(style)
    }));

    // Create universal change record
    const change: UniversalChange = {
      id: `style_change_${Date.now()}`,
      type: 'style',
      targetId: styleId,
      changes: { value: newValue },
      affectedTemplates,
      timestamp: new Date(),
      status: 'pending'
    };

    this.notifyChange(change);
    this.updateTemplateCSS();
    
    return impacts;
  }

  // Generate CSS for templates
  static generateTemplateCSS(templateId?: string): string {
    const styles = this.getAllStyles();
    const overrides = templateId ? this.templateStyles.get(templateId) || {} : {};
    
    const cssVariables = styles.map(style => {
      const value = overrides[style.id] || style.value;
      return `  ${style.cssVariable}: ${value};`;
    }).join('\n');

    return `:root {\n${cssVariables}\n}\n\n` + this.generateScopeCSS();
  }

  // Generate scoped CSS rules
  private static generateScopeCSS(): string {
    return `
/* Email Background */
.email-container {
  background-color: var(--email-bg-color);
}

/* Text Styles */
.email-text, p, div {
  font-family: var(--text-font-family);
  color: var(--text-color);
}

/* Heading Styles */
h1, h2, h3, h4, h5, h6 {
  color: var(--heading-color);
  font-family: var(--text-font-family);
}

/* Button Styles */
.email-button, button {
  background-color: var(--button-bg-color);
  color: var(--button-text-color);
}

/* Link Styles */
a {
  color: var(--link-color);
}
    `.trim();
  }

  // Update CSS in all templates
  private static updateTemplateCSS() {
    // This would inject the updated CSS into all active templates
    console.log('Updating CSS across all templates');
  }

  // Calculate severity of style changes
  private static calculateStyleSeverity(style: GlobalStyleDefinition): 'low' | 'medium' | 'high' {
    if (style.scope === 'email' || style.category === 'typography') {
      return 'high';
    }
    if (style.scope === 'buttons' || style.scope === 'headings') {
      return 'medium';
    }
    return 'low';
  }

  // Set template-specific style overrides
  static setTemplateStyleOverride(templateId: string, styleId: string, value: string): void {
    const templateOverrides = this.templateStyles.get(templateId) || {};
    templateOverrides[styleId] = value;
    this.templateStyles.set(templateId, templateOverrides);
    
    console.log('Set template style override:', { templateId, styleId, value });
  }

  // Get template style overrides
  static getTemplateStyleOverrides(templateId: string): Record<string, string> {
    return this.templateStyles.get(templateId) || {};
  }

  // Clear all template overrides
  static clearTemplateOverrides(templateId: string): void {
    this.templateStyles.delete(templateId);
  }

  // Notify change listeners
  private static notifyChange(change: UniversalChange) {
    this.changeListeners.forEach(listener => listener(change));
  }
}

// Initialize on import
GlobalStylesService.initializeDefaultStyles();
