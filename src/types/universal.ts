
export interface SnippetReference {
  snippetId: string;
  customizations?: Record<string, any>;
  locked?: boolean; // Prevent universal updates
  version?: string;
}

export interface GlobalStyleDefinition {
  id: string;
  property: string;
  value: string;
  cssVariable: string;
  scope: 'email' | 'text' | 'buttons' | 'links' | 'headings';
  category: string;
}

export interface TemplateMetadata {
  snippetReferences: SnippetReference[];
  globalStyleOverrides: Record<string, string>;
  styleVersion: string;
  lastUpdated: Date;
}

export interface UniversalChange {
  id: string;
  type: 'snippet' | 'style';
  targetId: string;
  changes: Record<string, any>;
  affectedTemplates: string[];
  timestamp: Date;
  status: 'pending' | 'applied' | 'rejected';
}

export interface ChangeImpact {
  templateId: string;
  templateName: string;
  changes: {
    property: string;
    oldValue: any;
    newValue: any;
  }[];
  severity: 'low' | 'medium' | 'high';
}
