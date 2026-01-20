declare module 'react-simple-maps' {
  import * as React from 'react';
  export interface GeographyProps {
    geography: any;
    style?: any;
    onMouseEnter?: (e: any) => void;
    onMouseLeave?: (e: any) => void;
    onClick?: (e: any) => void;
    className?: string;
  }
  export const ComposableMap: React.FC<any>;
  export const Geographies: React.FC<{ geography: any; children: (p:{ geographies:any[] }) => React.ReactNode }>;
  export const Geography: React.FC<GeographyProps>;
}
