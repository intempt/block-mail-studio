
// TypeScript declaration file to extend existing user attribute types
// This resolves build errors from dummy/userAttributes.ts

declare module '*/dummy/userAttributes' {
  // Extend the existing type unions to include missing types
  interface UserAttribute {
    name: string;
    displayName?: string;
    description?: string;
    type?: string; // Allow any string for type to match dummy data
    category?: string; // Allow any string for category to match dummy data
    attributeType?: string; // Allow any string for attributeType to match dummy data
    valueType?: string; // Add valueType property
    lastUpdated?: string; // Add lastUpdated property
    schema?: UserAttributeSchema;
  }

  interface UserAttributeSchema {
    fields?: UserAttributeSchemaField[];
  }

  interface UserAttributeSchemaField {
    name: string;
    type: string | string[];
    default?: any; // Make default optional
  }

  export const userAttributes: UserAttribute[];
}

// Global type augmentation for missing attribute types
declare global {
  type AttributeType = string; // Allow any string
  type AttributeCategory = string; // Allow any string
}

export {};
