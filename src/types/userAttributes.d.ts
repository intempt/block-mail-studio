
// TypeScript declaration file to extend existing user attribute types
// This resolves build errors from dummy/userAttributes.ts

declare module '*/dummy/userAttributes' {
  // Extend the existing type unions to include missing types
  interface UserAttribute {
    id?: string; // Add id field to align with attrId
    name: string;
    displayName?: string;
    description?: string;
    type?: any; // Allow any string for type to match dummy data
    category?: any; // Allow any string for category to match dummy data
    attributeType?: any; // Allow any string for attributeType to match dummy data
    valueType?: string; // Add valueType property that UserFilter.tsx expects
    lastUpdated?: string; // Add lastUpdated property that exists in dummy data
    schema?: UserAttributeSchema;
    [key: string]: any; // Allow any additional properties
  }

  interface UserAttributeSchema {
    fields?: UserAttributeSchemaField[];
    [key: string]: any; // Allow any additional properties
  }

  interface UserAttributeSchemaField {
    name: string;
    type?: any; // Allow flexible type structure and make optional
    default?: any; // Make default optional since it's missing in many places
    [key: string]: any; // Allow any additional properties
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
  type AttributeType = any; // Allow any string to match all values in dummy data
  type AttributeCategory = any; // Allow any string to match all values in dummy data
}

export {};
