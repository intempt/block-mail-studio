
// @ts-nocheck
// Emergency type override for dummy files

// Completely disable TypeScript checking for anything in dummy folder
declare module "dummy/*" {
  const content: any;
  export = content;
}

// Override all type checking in the global scope for dummy data
declare global {
  // Completely override the variable declaration
  namespace globalThis {
    var userAttributes: any;
  }
  
  // Override at window level too
  interface Window {
    userAttributes?: any;
  }
}

export {};
