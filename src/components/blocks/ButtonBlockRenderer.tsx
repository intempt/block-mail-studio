
import React, { useMemo } from 'react';
import { ButtonBlock } from '@/types/emailBlocks';

interface GlobalStyles {
  email?: {
    backgroundColor?: string;
    width?: string;
    defaultFontFamily?: string;
  };
  text?: {
    body?: {
      fontFamily?: string;
      fontSize?: string;
      color?: string;
      lineHeight?: string;
    };
    h1?: {
      fontFamily?: string;
      fontSize?: string;
      color?: string;
      fontWeight?: string;
    };
    h2?: {
      fontFamily?: string;
      fontSize?: string;
      color?: string;
      fontWeight?: string;
    };
    h3?: {
      fontFamily?: string;
      fontSize?: string;
      color?: string;
      fontWeight?: string;
    };
    h4?: {
      fontFamily?: string;
      fontSize?: string;
      color?: string;
      fontWeight?: string;
    };
  };
  buttons?: {
    default?: {
      backgroundColor?: string;
      color?: string;
      borderColor?: string;
      borderRadius?: string;
      fontSize?: string;
      fontWeight?: string;
      padding?: string;
    };
  };
  links?: {
    normal?: string;
    hover?: string;
    textDecoration?: string;
    fontWeight?: string;
    fontStyle?: string;
  };
}

interface ButtonBlockRendererProps {
  block: ButtonBlock;
  isSelected: boolean;
  onUpdate: (block: ButtonBlock) => void;
  globalStyles?: GlobalStyles;
}

export const ButtonBlockRenderer: React.FC<ButtonBlockRendererProps> = ({ 
  block, 
  isSelected, 
  globalStyles = {} 
}) => {
  const styling = block.styling.desktop;

  // Merge global button styles with block-specific styles
  const buttonStyles = useMemo(() => {
    const baseStyles = {
      display: 'inline-block',
      padding: '12px 24px',
      backgroundColor: '#3B82F6',
      color: 'white',
      textDecoration: 'none',
      borderRadius: '6px',
      fontWeight: '500',
      border: block.content.style === 'outline' ? '2px solid #3B82F6' : 'none',
    };

    // Apply style variants
    if (block.content.style === 'outline') {
      baseStyles.backgroundColor = 'transparent';
      baseStyles.color = '#3B82F6';
    } else if (block.content.style === 'text') {
      baseStyles.backgroundColor = 'transparent';
      baseStyles.color = '#3B82F6';
      baseStyles.padding = '12px 0';
    }

    // Apply global button styles as defaults
    if (globalStyles.buttons?.default) {
      const globalButton = globalStyles.buttons.default;
      return {
        ...baseStyles,
        backgroundColor: baseStyles.backgroundColor === '#3B82F6' ? (globalButton.backgroundColor || baseStyles.backgroundColor) : baseStyles.backgroundColor,
        color: baseStyles.color === 'white' ? (globalButton.color || baseStyles.color) : baseStyles.color,
        borderRadius: globalButton.borderRadius || baseStyles.borderRadius,
        fontSize: globalButton.fontSize || baseStyles.fontSize,
        fontWeight: globalButton.fontWeight || baseStyles.fontWeight,
        padding: globalButton.padding || baseStyles.padding,
        borderColor: globalButton.borderColor || (block.content.style === 'outline' ? globalButton.backgroundColor || '#3B82F6' : 'none'),
      };
    }

    return baseStyles;
  }, [block.content.style, globalStyles]);

  return (
    <div
      className="button-block-renderer"
      style={{
        backgroundColor: styling.backgroundColor,
        padding: styling.padding,
        margin: styling.margin,
        textAlign: 'center',
      }}
    >
      <a
        href={block.content.link}
        style={buttonStyles}
      >
        {block.content.text || 'Button Text'}
      </a>
    </div>
  );
};
