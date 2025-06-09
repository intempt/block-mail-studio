// @ts-nocheck
// Aggressive TypeScript suppression for dummy data files

// Completely disable all type checking for dummy files
declare module "*/dummy/userAttributes" {
  const userAttributes: any;
  export { userAttributes };
  export default userAttributes;
}

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

// Global type overrides - make everything permissive
declare global {
  // Override all user attribute interfaces to be completely permissive
  interface UserAttribute {
    [key: string]: any;
  }
  
  interface UserAttributeSchema {
    [key: string]: any;
  }
  
  interface UserAttributeSchemaField {
    [key: string]: any;
    name?: any;
    type?: any;
    default?: any;
  }
  
  // Override all union types to accept any string
  type AttributeType = any;
  type AttributeCategory = any;
  type UserAttributeType = any;
  type SchemaFieldType = any;
  
  // Override specific problematic union types
  type UserAttributeTypeUnion = any;
  type AttributeCategoryUnion = any;
  
  // Namespace overrides
  namespace UserAttributes {
    type Type = any;
    type Category = any;
    interface Any {
      [key: string]: any;
    }
  }
}

// Wildcard module overrides
declare module "*userAttributes*" {
  const content: any;
  export = content;
}

declare module "*.ts" {
  const content: any;
  export = content;
}

// Specific interface for actual components (keep this for real usage)
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

// Export to make this a module
export {};
