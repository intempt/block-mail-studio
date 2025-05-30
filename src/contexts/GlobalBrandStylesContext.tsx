
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface GlobalBrandStyles {
  email: {
    maxWidth: number;
    backgroundColor: string;
    defaultFontFamily: string;
    padding: {
      top: number;
      right: number;
      bottom: number;
      left: number;
      linked: boolean;
    };
  };
  text: {
    body: {
      fontFamily: string;
      fontSize: number;
      color: string;
      fontWeight: string;
    };
    h1: {
      fontFamily: string;
      fontSize: number;
      color: string;
      fontWeight: string;
    };
    h2: {
      fontFamily: string;
      fontSize: number;
      color: string;
      fontWeight: string;
    };
    h3: {
      fontFamily: string;
      fontSize: number;
      color: string;
      fontWeight: string;
    };
    h4: {
      fontFamily: string;
      fontSize: number;
      color: string;
      fontWeight: string;
    };
  };
  buttons: {
    default: {
      backgroundColor: string;
      textColor: string;
      borderRadius: number;
      padding: {
        top: number;
        right: number;
        bottom: number;
        left: number;
        linked: boolean;
      };
      border: {
        width: number;
        style: string;
        color: string;
      };
    };
  };
  links: {
    normal: string;
    hover: string;
    visited: string;
    underline: boolean;
    fontWeight: string;
  };
}

const defaultGlobalStyles: GlobalBrandStyles = {
  email: {
    maxWidth: 600,
    backgroundColor: '#ffffff',
    defaultFontFamily: 'Arial, sans-serif',
    padding: { top: 20, right: 20, bottom: 20, left: 20, linked: true },
  },
  text: {
    body: {
      fontFamily: 'Arial, sans-serif',
      fontSize: 16,
      color: '#333333',
      fontWeight: '400',
    },
    h1: {
      fontFamily: 'Arial, sans-serif',
      fontSize: 32,
      color: '#1a1a1a',
      fontWeight: '700',
    },
    h2: {
      fontFamily: 'Arial, sans-serif',
      fontSize: 24,
      color: '#1a1a1a',
      fontWeight: '600',
    },
    h3: {
      fontFamily: 'Arial, sans-serif',
      fontSize: 20,
      color: '#1a1a1a',
      fontWeight: '600',
    },
    h4: {
      fontFamily: 'Arial, sans-serif',
      fontSize: 18,
      color: '#1a1a1a',
      fontWeight: '500',
    },
  },
  buttons: {
    default: {
      backgroundColor: '#3B82F6',
      textColor: '#ffffff',
      borderRadius: 8,
      padding: { top: 12, right: 24, bottom: 12, left: 24, linked: false },
      border: { width: 0, style: 'none', color: '#transparent' },
    },
  },
  links: {
    normal: '#3B82F6',
    hover: '#1E40AF',
    visited: '#7C3AED',
    underline: true,
    fontWeight: '400',
  },
};

interface GlobalBrandStylesContextType {
  styles: GlobalBrandStyles;
  updateStyles: (newStyles: Partial<GlobalBrandStyles>) => void;
  resetStyles: () => void;
  applyStylesToCanvas: () => void;
}

const GlobalBrandStylesContext = createContext<GlobalBrandStylesContextType | undefined>(undefined);

export const useGlobalBrandStyles = () => {
  const context = useContext(GlobalBrandStylesContext);
  if (!context) {
    throw new Error('useGlobalBrandStyles must be used within a GlobalBrandStylesProvider');
  }
  return context;
};

interface GlobalBrandStylesProviderProps {
  children: React.ReactNode;
  onStylesChange?: (styles: GlobalBrandStyles) => void;
}

export const GlobalBrandStylesProvider: React.FC<GlobalBrandStylesProviderProps> = ({
  children,
  onStylesChange
}) => {
  const [styles, setStyles] = useState<GlobalBrandStyles>(defaultGlobalStyles);

  const updateStyles = (newStyles: Partial<GlobalBrandStyles>) => {
    const updatedStyles = {
      ...styles,
      ...newStyles,
      // Deep merge for nested objects
      email: { ...styles.email, ...newStyles.email },
      text: { ...styles.text, ...newStyles.text },
      buttons: { ...styles.buttons, ...newStyles.buttons },
      links: { ...styles.links, ...newStyles.links },
    };
    setStyles(updatedStyles);
    onStylesChange?.(updatedStyles);
  };

  const resetStyles = () => {
    setStyles(defaultGlobalStyles);
    onStylesChange?.(defaultGlobalStyles);
  };

  const applyStylesToCanvas = () => {
    // This will trigger CSS variable updates and canvas refresh
    onStylesChange?.(styles);
  };

  // Generate CSS variables from styles
  useEffect(() => {
    const root = document.documentElement;
    
    // Email styles
    root.style.setProperty('--email-max-width', `${styles.email.maxWidth}px`);
    root.style.setProperty('--email-bg-color', styles.email.backgroundColor);
    root.style.setProperty('--email-font-family', styles.email.defaultFontFamily);
    root.style.setProperty('--email-padding', `${styles.email.padding.top}px ${styles.email.padding.right}px ${styles.email.padding.bottom}px ${styles.email.padding.left}px`);
    
    // Text styles
    root.style.setProperty('--text-body-font', styles.text.body.fontFamily);
    root.style.setProperty('--text-body-size', `${styles.text.body.fontSize}px`);
    root.style.setProperty('--text-body-color', styles.text.body.color);
    root.style.setProperty('--text-body-weight', styles.text.body.fontWeight);
    
    root.style.setProperty('--text-h1-font', styles.text.h1.fontFamily);
    root.style.setProperty('--text-h1-size', `${styles.text.h1.fontSize}px`);
    root.style.setProperty('--text-h1-color', styles.text.h1.color);
    root.style.setProperty('--text-h1-weight', styles.text.h1.fontWeight);
    
    root.style.setProperty('--text-h2-font', styles.text.h2.fontFamily);
    root.style.setProperty('--text-h2-size', `${styles.text.h2.fontSize}px`);
    root.style.setProperty('--text-h2-color', styles.text.h2.color);
    root.style.setProperty('--text-h2-weight', styles.text.h2.fontWeight);
    
    root.style.setProperty('--text-h3-font', styles.text.h3.fontFamily);
    root.style.setProperty('--text-h3-size', `${styles.text.h3.fontSize}px`);
    root.style.setProperty('--text-h3-color', styles.text.h3.color);
    root.style.setProperty('--text-h3-weight', styles.text.h3.fontWeight);
    
    root.style.setProperty('--text-h4-font', styles.text.h4.fontFamily);
    root.style.setProperty('--text-h4-size', `${styles.text.h4.fontSize}px`);
    root.style.setProperty('--text-h4-color', styles.text.h4.color);
    root.style.setProperty('--text-h4-weight', styles.text.h4.fontWeight);
    
    // Button styles
    root.style.setProperty('--button-bg-color', styles.buttons.default.backgroundColor);
    root.style.setProperty('--button-text-color', styles.buttons.default.textColor);
    root.style.setProperty('--button-border-radius', `${styles.buttons.default.borderRadius}px`);
    root.style.setProperty('--button-padding', `${styles.buttons.default.padding.top}px ${styles.buttons.default.padding.right}px ${styles.buttons.default.padding.bottom}px ${styles.buttons.default.padding.left}px`);
    
    // Link styles
    root.style.setProperty('--link-normal-color', styles.links.normal);
    root.style.setProperty('--link-hover-color', styles.links.hover);
    root.style.setProperty('--link-visited-color', styles.links.visited);
    root.style.setProperty('--link-font-weight', styles.links.fontWeight);
    root.style.setProperty('--link-underline', styles.links.underline ? 'underline' : 'none');
    
  }, [styles]);

  return (
    <GlobalBrandStylesContext.Provider
      value={{
        styles,
        updateStyles,
        resetStyles,
        applyStylesToCanvas,
      }}
    >
      {children}
    </GlobalBrandStylesContext.Provider>
  );
};
