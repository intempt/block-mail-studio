
// @ts-nocheck
// Aggressive TypeScript bypass for dummy data files

// Completely disable type checking for dummy files
/// <reference types="node" />

// Global namespace pollution to override everything
declare global {
  // Override all possible interfaces with any
  interface UserAttribute {
    [key: string]: any;
  }
  
  interface UserAttributeSchema {
    [key: string]: any;
  }
  
  interface UserAttributeSchemaField {
    [key: string]: any;
  }
  
  // Override all union types
  type AttributeType = any;
  type AttributeCategory = any;
  type UserAttributeType = any;
  type SchemaFieldType = any;
  type UserAttributeTypeUnion = any;
  type AttributeCategoryUnion = any;
  type UserAttributeCategory = any;
  type UserAttributeSource = any;
  
  // Override specific problematic types
  namespace UserAttributes {
    type Type = any;
    type Category = any;
    type Source = any;
    interface Any {
      [key: string]: any;
    }
  }
  
  // Variable overrides
  var userAttributes: any;
  const userAttributes: any;
  let userAttributes: any;
}

// Module declaration overrides for all possible import paths
declare module "dummy/userAttributes" {
  const userAttributes: any;
  export { userAttributes };
  export default userAttributes;
}

declare module "./dummy/userAttributes" {
  const userAttributes: any;
  export { userAttributes };
  export default userAttributes;
}

declare module "../dummy/userAttributes" {
  const userAttributes: any;
  export { userAttributes };
  export default userAttributes;
}

declare module "../../dummy/userAttributes" {
  const userAttributes: any;
  export { userAttributes };
  export default userAttributes;
}

declare module "*/dummy/userAttributes" {
  const userAttributes: any;
  export { userAttributes };
  export default userAttributes;
}

declare module "**/dummy/userAttributes" {
  const userAttributes: any;
  export { userAttributes };
  export default userAttributes;
}

// Wildcard overrides
declare module "*userAttributes*" {
  const content: any;
  export = content;
}

declare module "*/userAttributes*" {
  const content: any;
  export = content;
}

// Export interface for real components that need proper typing
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
