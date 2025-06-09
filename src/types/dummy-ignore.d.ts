
// Completely ignore dummy folder in TypeScript compilation
declare module 'dummy/*' {
  const content: any;
  export = content;
}

declare module 'dummy/**/*' {
  const content: any;
  export = content;
}

declare module 'dummy/**/**/*' {
  const content: any;
  export = content;
}

// Ignore disabled files
declare module '*.disabled' {
  const content: any;
  export = content;
}

declare module '*.ts.disabled' {
  const content: any;
  export = content;
}

declare module '*.tsx.disabled' {
  const content: any;
  export = content;
}

// Prevent any imports from dummy folder
declare module 'dummy/userAttributes' {
  export const userAttributes: never;
}

declare module 'dummy/users' {
  export const users: never;
}

declare module 'dummy/userDetails' {
  export const getUserDetails: never;
}

declare module 'dummy/variables' {
  export const variables: never;
}

// Override any TypeScript processing of dummy files
declare module '*/dummy/userAttributes' {
  const content: any;
  export = content;
}

declare module '*/dummy/users' {
  const content: any;
  export = content;
}

declare module '*/dummy/userDetails' {
  const content: any;
  export = content;
}

declare module '*/dummy/variables' {
  const content: any;
  export = content;
}

// Add global declarations to prevent TypeScript from processing dummy files
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXCLUDE_DUMMY?: string;
    }
  }
}

export {};
