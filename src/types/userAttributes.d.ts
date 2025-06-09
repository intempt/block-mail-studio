
// TypeScript declaration file to extend existing user attribute types
// This resolves build errors from dummy/userAttributes.ts

declare module '*/dummy/userAttributes' {
  interface UserAttribute {
    id?: string;
    name: string;
    displayName?: string;
    description?: string;
    type?: AttributeType;
    category?: AttributeCategory;
    attributeType?: AttributeType;
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
    type?: any;
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

// Global type augmentation for attribute types
declare global {
  type AttributeType = 
    | 'user' 
    | 'system' 
    | 'event' 
    | 'account'  // Added missing type
    | 'custom' 
    | 'extracted' 
    | 'computed' 
    | 'scoring'  // Added missing type
    | 'predicted' // Added missing type
    | string;    // Allow any string for flexibility

  type AttributeCategory = 
    | 'user' 
    | 'system' 
    | 'event' 
    | 'account'  // Added missing category
    | 'custom' 
    | 'extracted' 
    | 'computed' 
    | 'scoring'  // Added missing category
    | 'predicted' // Added missing category
    | string;    // Allow any string for flexibility
}

export {};
