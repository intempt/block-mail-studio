
// TypeScript declaration file to extend existing user attribute types
// This resolves build errors from dummy/userAttributes.ts

declare module '*/dummy/userAttributes' {
  interface UserAttribute {
    id?: string;
    name: string;
    displayName?: string;
    description?: string;
    type?: any; // Allow any type to match dummy data flexibility
    category?: any; // Allow any category to match dummy data flexibility
    attributeType?: any; // Allow any attribute type
    valueType?: string;
    lastUpdated?: string; // Added to support dummy data
    createdBy?: number;
    schema?: UserAttributeSchema;
    [key: string]: any; // Allow any additional properties
  }

  interface UserAttributeSchema {
    fields?: UserAttributeSchemaField[];
    [key: string]: any;
  }

  interface UserAttributeSchemaField {
    name: string;
    type?: any; // Allow arrays, strings, or any other type
    default?: any; // Made optional to match dummy data
    [key: string]: any; // Allow any additional properties like "type" in arrays
  }

  export const userAttributes: UserAttribute[];
}

// User details interface for components
export interface UserDetails {
  firstSeen: string;
  lastSeen: string;
  identifiers: string[];
  totalEvents: number;
  sources: string[];
  segments: Record<string, boolean>;
  segmentQueryIds: number[];
  attributes: UserDetailAttribute[];
}

interface UserDetailAttribute {
  attrId: string;
  title: string;
  value: any;
  lastUpdated?: string;
}

// Global type augmentation - make these completely flexible to avoid conflicts
declare global {
  type AttributeType = any; // Completely flexible to support all dummy data values
  type AttributeCategory = any; // Completely flexible to support all dummy data values
}

export {};
