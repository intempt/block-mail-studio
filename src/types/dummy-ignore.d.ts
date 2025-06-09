
// Completely ignore dummy folder in TypeScript compilation
declare module 'dummy/*' {
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
