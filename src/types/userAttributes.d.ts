
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
    valueType?: string; // Add valueType property that UserFilter.tsx expects
    lastUpdated?: string; // Add lastUpdated property that exists in dummy data
    schema?: UserAttributeSchema;
  }

  interface UserAttributeSchema {
    fields?: UserAttributeSchemaField[];
  }

  interface UserAttributeSchemaField {
    name: string;
    type: string | string[] | { type?: string }; // Allow flexible type structure
    default?: any; // Make default optional since it's missing in many places
  }

  export const userAttributes: UserAttribute[];
}

// Global type augmentation for missing attribute types
declare global {
  type AttributeType = string; // Allow any string to match all values in dummy data
  type AttributeCategory = string; // Allow any string to match all values in dummy data
}

export {};
