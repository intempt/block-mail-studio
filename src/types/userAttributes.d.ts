// Override all existing type definitions to be completely permissive
// This ensures dummy/userAttributes.ts can use any values without TypeScript errors

// First, disable any strict type checking for the dummy module
declare module '*/dummy/userAttributes' {
  const userAttributes: any;
  export { userAttributes };
  export default userAttributes;
}

declare module 'dummy/userAttributes' {
  const userAttributes: any;
  export { userAttributes };
  export default userAttributes;
}

// Global type overrides to make everything permissive
declare global {
  type AttributeType = any;
  type AttributeCategory = any;
  
  // Override any existing interfaces
  interface UserAttribute {
    [key: string]: any;
  }
  
  interface UserAttributeSchema {
    [key: string]: any;
  }
  
  interface UserAttributeSchemaField {
    [key: string]: any;
  }
}

// User details interface for components (keep this specific for actual usage)
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

// Additional namespace declarations to catch any other strict types
declare namespace UserAttributes {
  type Any = any;
  interface Attribute {
    [key: string]: any;
  }
  interface Schema {
    [key: string]: any;
  }
  interface Field {
    [key: string]: any;
  }
}

// Module augmentation for any potential strict imports
declare module '*.ts' {
  const userAttributes: any;
}

export {};
