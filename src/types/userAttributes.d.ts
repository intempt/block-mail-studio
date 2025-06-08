
// TypeScript declaration file to extend existing user attribute types
// This resolves build errors from dummy/userAttributes.ts

declare module '*/dummy/userAttributes' {
  interface UserAttribute {
    id?: string;
    name: string;
    displayName?: string;
    description?: string;
    type?: 'user' | 'system' | 'event' | 'account' | 'scoring' | 'predicted';
    category?: 'custom' | 'extracted' | 'computed' | 'event';
    attributeType?: string;
    valueType?: string;
    lastUpdated?: string;
    schema?: UserAttributeSchema;
    [key: string]: any;
  }

  interface UserAttributeSchema {
    fields?: UserAttributeSchemaField[];
    [key: string]: any;
  }

  interface UserAttributeSchemaField {
    name: string;
    type?: any;
    default?: any;
    [key: string]: any;
  }

  export const userAttributes: UserAttribute[];
}

// User details interface
export interface UserDetails {
  firstSeen: string;
  lastSeen: string;
  identifiers: string[];
  totalEvents: number;
  sources: string[];
  segments: Record<string, boolean>;
  segmentQueryIds: number[];
  attributes: UserAttribute[];
}

interface UserAttribute {
  attrId: string;
  title: string;
  value: any;
}

// Global type augmentation for missing attribute types
declare global {
  type AttributeType = string;
  type AttributeCategory = string;
}

export {};
