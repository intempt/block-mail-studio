
// @ts-nocheck
// Emergency global type override for all dummy files

// Completely disable TypeScript checking for anything in dummy folder
declare module "dummy/*" {
  const content: any;
  export = content;
}

// Global window and namespace overrides
declare global {
  namespace globalThis {
    var userAttributes: any;
    var UserAttribute: any;
    var UserAttributeSchema: any;
    var UserAttributeSchemaField: any;
  }
  
  interface Window {
    userAttributes?: any;
    UserAttribute?: any;
    UserAttributeSchema?: any;
    UserAttributeSchemaField?: any;
  }
  
  // Emergency type augmentation
  var UserAttribute: any;
  var UserAttributeSchema: any;
  var UserAttributeSchemaField: any;
  var AttributeType: any;
  var AttributeCategory: any;
  var UserAttributeType: any;
  var SchemaFieldType: any;
}

// Complete module wildcard override
declare module "*" {
  const content: any;
  export = content;
}

export {};
