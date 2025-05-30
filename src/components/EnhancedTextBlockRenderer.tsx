
import React, { useMemo } from 'react';
import { TextBlock } from '@/types/emailBlocks';
import { SimpleTipTapEditor } from './SimpleTipTapEditor';

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

interface EnhancedTextBlockRendererProps {
  block: TextBlock;
  isSelected: boolean;
  isEditing: boolean;
  onUpdate: (block: TextBlock) => void;
  onEditStart: () => void;
  onEditEnd: () => void;
  globalStyles?: GlobalStyles;
}

export const EnhancedTextBlockRenderer: React.FC<EnhancedTextBlockRendererProps> = ({
  block,
  isSelected,
  isEditing,
  onUpdate,
  onEditStart,
  onEditEnd,
  globalStyles = {}
}) => {
  const styling = block.styling.desktop;

  // Merge global text styles with block-specific styles
  const mergedStyles = useMemo(() => {
    const baseStyle = {
      backgroundColor: styling.backgroundColor,
      padding: styling.padding,
      margin: styling.margin,
      borderRadius: styling.borderRadius,
      border: styling.border,
      textColor: styling.textColor,
      fontSize: styling.fontSize,
      fontWeight: styling.fontWeight,
      fontFamily: styling.fontFamily,
      lineHeight: styling.lineHeight,
    };

    // Apply global text styles as defaults
    if (globalStyles.text?.body) {
      const globalText = globalStyles.text.body;
      return {
        ...baseStyle,
        fontFamily: baseStyle.fontFamily || globalText.fontFamily,
        fontSize: baseStyle.fontSize || globalText.fontSize,
        textColor: baseStyle.textColor || globalText.color,
        lineHeight: baseStyle.lineHeight || globalText.lineHeight,
      };
    }

    // Apply global email font family as fallback
    if (globalStyles.email?.defaultFontFamily) {
      return {
        ...baseStyle,
        fontFamily: baseStyle.fontFamily || globalStyles.email.defaultFontFamily,
      };
    }

    return baseStyle;
  }, [styling, globalStyles]);

  // Generate global CSS for links and headings
  const globalCSS = useMemo(() => {
    let css = '';
    
    // Apply global link styles
    if (globalStyles.links) {
      const linkStyles = globalStyles.links;
      css += `
        .enhanced-text-block-renderer a {
          color: ${linkStyles.normal || '#3B82F6'} !important;
          text-decoration: ${linkStyles.textDecoration || 'underline'} !important;
          font-weight: ${linkStyles.fontWeight || 'normal'} !important;
          font-style: ${linkStyles.fontStyle || 'normal'} !important;
        }
        .enhanced-text-block-renderer a:hover {
          color: ${linkStyles.hover || linkStyles.normal || '#1E40AF'} !important;
        }
      `;
    }

    // Apply global heading styles
    if (globalStyles.text) {
      const textStyles = globalStyles.text;
      
      if (textStyles.h1) {
        css += `
          .enhanced-text-block-renderer h1 {
            font-family: ${textStyles.h1.fontFamily || 'inherit'} !important;
            font-size: ${textStyles.h1.fontSize || '2em'} !important;
            color: ${textStyles.h1.color || 'inherit'} !important;
            font-weight: ${textStyles.h1.fontWeight || 'bold'} !important;
          }
        `;
      }
      
      if (textStyles.h2) {
        css += `
          .enhanced-text-block-renderer h2 {
            font-family: ${textStyles.h2.fontFamily || 'inherit'} !important;
            font-size: ${textStyles.h2.fontSize || '1.5em'} !important;
            color: ${textStyles.h2.color || 'inherit'} !important;
            font-weight: ${textStyles.h2.fontWeight || 'bold'} !important;
          }
        `;
      }
      
      if (textStyles.h3) {
        css += `
          .enhanced-text-block-renderer h3 {
            font-family: ${textStyles.h3.fontFamily || 'inherit'} !important;
            font-size: ${textStyles.h3.fontSize || '1.25em'} !important;
            color: ${textStyles.h3.color || 'inherit'} !important;
            font-weight: ${textStyles.h3.fontWeight || 'bold'} !important;
          }
        `;
      }
      
      if (textStyles.h4) {
        css += `
          .enhanced-text-block-renderer h4 {
            font-family: ${textStyles.h4.fontFamily || 'inherit'} !important;
            font-size: ${textStyles.h4.fontSize || '1.1em'} !important;
            color: ${textStyles.h4.color || 'inherit'} !important;
            font-weight: ${textStyles.h4.fontWeight || 'bold'} !important;
          }
        `;
      }
    }

    return css;
  }, [globalStyles]);

  const handleContentChange = (html: string) => {
    const updatedBlock: TextBlock = {
      ...block,
      content: {
        ...block.content,
        html
      }
    };
    onUpdate(updatedBlock);
  };

  const handleClick = () => {
    if (!isEditing) {
      onEditStart();
    }
  };

  const handleBlur = () => {
    onEditEnd();
  };

  const editorStyle = {
    ...mergedStyles,
    color: mergedStyles.textColor,
    fontFamily: mergedStyles.fontFamily,
    fontSize: mergedStyles.fontSize,
    fontWeight: mergedStyles.fontWeight,
    lineHeight: mergedStyles.lineHeight,
  };

  return (
    <>
      {/* Inject global styles */}
      {globalCSS && (
        <style dangerouslySetInnerHTML={{ __html: globalCSS }} />
      )}
      
      <div
        className={`enhanced-text-block-renderer ${isSelected ? 'selected' : ''} ${isEditing ? 'editing' : ''}`}
        style={editorStyle}
        onClick={handleClick}
      >
        {isEditing ? (
          <SimpleTipTapEditor
            content={block.content.html || ''}
            onChange={handleContentChange}
            onBlur={handleBlur}
            placeholder={block.content.placeholder || 'Click to add text...'}
            autoFocus
          />
        ) : (
          <div>
            {block.content.html ? (
              <div 
                dangerouslySetInnerHTML={{ __html: block.content.html }}
                className="prose prose-sm max-w-none"
              />
            ) : (
              <p className="text-gray-400 italic">
                {block.content.placeholder || 'Click to add text...'}
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
};
