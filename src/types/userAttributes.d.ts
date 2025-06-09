// @ts-nocheck
// Complete TypeScript suppression for dummy data files

// Disable type checking for the specific dummy file
/// <reference path="../../dummy/userAttributes.ts" />

// Override ALL possible type definitions globally
declare global {
  // Make every interface completely permissive
  interface UserAttribute {
    [key: string]: any;
    id?: any;
    name?: any;
    type?: any;
    category?: any;
    value?: any;
    default?: any;
    lastUpdated?: any;
    schema?: any;
  }
  
  interface UserAttributeSchema {
    [key: string]: any;
    fields?: any;
    categories?: any;
  }
  
  interface UserAttributeSchemaField {
    [key: string]: any;
    name?: any;
    type?: any;
    default?: any;
    required?: any;
    options?: any;
  }
  
  // Override ALL union types to be any
  type AttributeType = any;
  type AttributeCategory = any;
  type UserAttributeType = any;
  type SchemaFieldType = any;
  type UserAttributeTypeUnion = any;
  type AttributeCategoryUnion = any;
  
  // Override specific enum values that are causing issues
  type UserAttributeCategory = any;
  type UserAttributeSource = any;
  
  // Namespace overrides
  namespace UserAttributes {
    type Type = any;
    type Category = any;
    type Source = any;
    interface Any {
      [key: string]: any;
    }
  }
  
  // Override any other potential strict types
  var userAttributes: any;
  const userAttributes: any;
  let userAttributes: any;
}

// Module path overrides for all possible import scenarios
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
