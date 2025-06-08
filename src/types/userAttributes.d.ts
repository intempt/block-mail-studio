
// TypeScript declaration file to extend existing user attribute types
// This resolves build errors from dummy/userAttributes.ts

declare module '*/dummy/userAttributes' {
  // Extend the existing type unions to include missing types
  interface UserAttribute {
    name: string;
    displayName?: string;
    description?: string;
    type?: 'event' | 'user' | 'system' | 'account';
    category?: 'extracted' | 'computed' | 'event' | 'custom' | 'scoring' | 'predicted';
    attributeType?: string;
    valueType?: string;
    lastUpdated?: string;
    schema?: UserAttributeSchema;
  }

  interface UserAttributeSchema {
    fields?: UserAttributeSchemaField[];
  }

  interface UserAttributeSchemaField {
    name: string;
    type: string | string[];
    default?: any;
  }

  export const userAttributes: UserAttribute[];
}

// Global type augmentation for missing attribute types
declare global {
  type AttributeType = 'event' | 'user' | 'system' | 'account';
  type AttributeCategory = 'extracted' | 'computed' | 'event' | 'custom' | 'scoring' | 'predicted';
}

export {};
