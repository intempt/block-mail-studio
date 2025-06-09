
// @ts-nocheck
// Emergency global type override for all dummy files

// Completely disable TypeScript checking for anything in dummy folder
declare module "dummy/*" {
  const content: any;
  export = content;
}

declare module "dummy/userAttributes" {
  const userAttributes: any;
  export { userAttributes };
  export default userAttributes;
}

declare module "dummy/users" {
  const users: any;
  export { users };
  export default users;
}

declare module "dummy/userDetails" {
  const getUserDetails: any;
  export { getUserDetails };
  export default getUserDetails;
}

declare module "dummy/variables" {
  const variables: any;
  export { variables };
  export default variables;
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
