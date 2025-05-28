
export const generateUniqueId = (): string => {
  return `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const createDefaultBlockStyling = (blockType: string) => {
  const baseStyles = {
    desktop: { width: '100%', height: 'auto' },
    tablet: { width: '100%', height: 'auto' },
    mobile: { width: '100%', height: 'auto' }
  };

  switch (blockType) {
    case 'text':
      return {
        ...baseStyles,
        desktop: {
          ...baseStyles.desktop,
          padding: '12px',
          margin: '8px 0',
          borderRadius: '4px'
        }
      };
    case 'button':
      return {
        ...baseStyles,
        desktop: {
          ...baseStyles.desktop,
          textAlign: 'center',
          padding: '16px'
        }
      };
    case 'image':
      return {
        ...baseStyles,
        desktop: {
          ...baseStyles.desktop,
          textAlign: 'center',
          padding: '16px'
        }
      };
    default:
      return baseStyles;
  }
};
