// Global type declarations for external libraries without proper TypeScript support

declare module 'mdurl' {
  export function format(url: string, options?: any): string;
  export function parse(url: string): any;
  // Add other mdurl functions as needed
}

declare module 'mammoth' {
  export function convertToHtml(buffer: ArrayBuffer | Buffer, options?: any): Promise<{value: string, messages: any[]}>;
  export function extractRawText(buffer: ArrayBuffer | Buffer, options?: any): Promise<{value: string, messages: any[]}>;
}

// Add other module declarations as needed
declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.jpg' {
  const value: string;
  export default value;
}

declare module '*.jpeg' {
  const value: string;
  export default value;
}

declare module '*.svg' {
  const value: string;
  export default value;
}

declare module '*.webp' {
  const value: string;
  export default value;
}

declare module '*.gif' {
  const value: string;
  export default value;
}