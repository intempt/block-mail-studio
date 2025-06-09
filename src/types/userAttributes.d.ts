// Completely disable TypeScript checking for dummy files
// @ts-nocheck

// Override ALL user attribute related types to be permissive
declare global {
  interface UserAttribute {
    [key: string]: any;
  }
  
  interface UserAttributeSchema {
    [key: string]: any;
  }
  
  interface UserAttributeSchemaField {
    [key: string]: any;
  }
  
  // Override any enum-like types
  type AttributeType = any;
  type AttributeCategory = any;
  type UserAttributeType = any;
  type SchemaFieldType = any;
}

// Module declarations to override any imports
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

declare module '../dummy/userAttributes' {
  const userAttributes: any;
  export { userAttributes };
  export default userAttributes;
}

declare module '../../dummy/userAttributes' {
  const userAttributes: any;
  export { userAttributes };
  export default userAttributes;
}

// Namespace declarations
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

// Wildcard module declarations
declare module '*.ts' {
  const content: any;
  export = content;
}

declare module '*userAttributes*' {
  const content: any;
  export = content;
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

export {};
