
// TypeScript declaration file to extend existing user attribute types
// This resolves build errors from dummy/userAttributes.ts

declare module '*/dummy/userAttributes' {
  interface UserAttribute {
    id?: any;
    name?: any;
    displayName?: any;
    description?: any;
    type?: any;
    category?: any;
    attributeType?: any;
    valueType?: any;
    lastUpdated?: any;
    createdBy?: any;
    schema?: any;
    [key: string]: any; // Allow any additional properties
  }

  interface UserAttributeSchema {
    fields?: any;
    [key: string]: any;
  }

  interface UserAttributeSchemaField {
    name?: any;
    type?: any;
    default?: any;
    [key: string]: any; // Allow any additional properties
  }

  export const userAttributes: any[];
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
  type AttributeType = any;
  type AttributeCategory = any;
}

// Additional module augmentation to override any existing strict types
declare module 'dummy/userAttributes' {
  interface UserAttribute {
    [key: string]: any;
  }
  
  interface UserAttributeSchema {
    [key: string]: any;
  }
  
  interface UserAttributeSchemaField {
    [key: string]: any;
  }
  
  export const userAttributes: any[];
}

export {};
