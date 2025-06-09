
// TypeScript declaration file to extend existing user attribute types
// This resolves build errors from dummy/userAttributes.ts

declare module '*/dummy/userAttributes' {
  interface UserAttribute {
    id?: string;
    name: string;
    displayName?: string;
    description?: string;
    type?: any; // Made flexible to support all dummy data types
    category?: any; // Made flexible to support all dummy data values
    attributeType?: any; // Made flexible to support all dummy data types
    valueType?: string;
    lastUpdated?: string;
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
    type?: any; // Made flexible to support arrays and other types
    default?: any; // Made optional to match dummy data
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
  lastUpdated?: string;
}

// Global type augmentation for missing attribute types
declare global {
  type AttributeType = any; // Made flexible to support all types used in dummy data
  type AttributeCategory = any; // Made flexible to support all categories used in dummy data
}

export {};
