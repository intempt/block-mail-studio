
import React, { createContext, useContext, useState } from 'react';

export interface GlobalBrandStyles {
  primaryColor?: string;
  fontFamily?: string;
  text?: any;
  email?: {
    defaultFontFamily?: string;
  };
  buttons?: {
    default?: {
      backgroundColor?: string;
      textColor?: string;
      borderRadius?: number;
    };
  };
}

interface GlobalBrandStylesContextType {
  styles: GlobalBrandStyles;
  updateStyles: (newStyles: Partial<GlobalBrandStyles>) => void;
}

const GlobalBrandStylesContext = createContext<GlobalBrandStylesContextType | undefined>(undefined);

export const GlobalBrandStylesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [styles, setStyles] = useState<GlobalBrandStyles>({
    primaryColor: '#3B82F6',
    fontFamily: 'Arial, sans-serif',
    email: {
      defaultFontFamily: 'Arial, sans-serif'
    },
    buttons: {
      default: {
        backgroundColor: '#3B82F6',
        textColor: '#ffffff',
        borderRadius: 6
      }
    }
  });

  const updateStyles = (newStyles: Partial<GlobalBrandStyles>) => {
    setStyles(prev => ({ ...prev, ...newStyles }));
  };

  return (
    <GlobalBrandStylesContext.Provider value={{ styles, updateStyles }}>
      {children}
    </GlobalBrandStylesContext.Provider>
  );
};

export const useGlobalBrandStyles = () => {
  const context = useContext(GlobalBrandStylesContext);
  if (!context) {
    throw new Error('useGlobalBrandStyles must be used within a GlobalBrandStylesProvider');
  }
  return context;
};
