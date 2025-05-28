
import { EmailBlock } from '@/types/emailBlocks';

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

export const createEmailBlock = (blockType: string): EmailBlock => {
  const baseBlock = {
    id: generateUniqueId(),
    styling: {
      desktop: { width: '100%', height: 'auto' },
      tablet: { width: '100%', height: 'auto' },
      mobile: { width: '100%', height: 'auto' }
    },
    position: { x: 0, y: 0 },
    displayOptions: {
      showOnDesktop: true,
      showOnTablet: true,
      showOnMobile: true
    }
  };

  switch (blockType) {
    case 'text':
      return {
        ...baseBlock,
        type: 'text',
        content: {
          html: '<p>Add your text content here...</p>',
          textStyle: 'normal',
          placeholder: 'Click to add text...'
        }
      };

    case 'image':
      return {
        ...baseBlock,
        type: 'image',
        content: {
          src: 'https://via.placeholder.com/400x200?text=Your+Image',
          alt: 'Image description',
          link: '',
          alignment: 'center',
          width: '100%',
          isDynamic: false
        }
      };

    case 'button':
      return {
        ...baseBlock,
        type: 'button',
        content: {
          text: 'Click Here',
          link: '#',
          style: 'solid',
          size: 'medium'
        }
      };

    case 'spacer':
      return {
        ...baseBlock,
        type: 'spacer',
        content: {
          height: '40px',
          mobileHeight: '20px'
        }
      };

    case 'divider':
      return {
        ...baseBlock,
        type: 'divider',
        content: {
          style: 'solid',
          thickness: '1px',
          color: '#e0e0e0',
          width: '100%',
          alignment: 'center'
        }
      };

    default:
      return {
        ...baseBlock,
        type: blockType,
        content: {}
      };
  }
};
