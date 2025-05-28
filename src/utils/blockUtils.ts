
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

    case 'video':
      return {
        ...baseBlock,
        type: 'video',
        content: {
          videoUrl: '',
          thumbnail: 'https://via.placeholder.com/400x300?text=Video+Thumbnail',
          showPlayButton: true,
          platform: 'youtube',
          autoThumbnail: true
        }
      };

    case 'social':
      return {
        ...baseBlock,
        type: 'social',
        content: {
          platforms: [
            {
              name: 'Facebook',
              url: 'https://facebook.com',
              icon: 'facebook',
              iconStyle: 'color',
              showLabel: false
            }
          ],
          layout: 'horizontal',
          iconSize: '24px',
          spacing: '8px'
        }
      };

    case 'html':
      return {
        ...baseBlock,
        type: 'html',
        content: {
          html: '<p>Custom HTML content</p>',
          customCSS: ''
        }
      };

    case 'table':
      return {
        ...baseBlock,
        type: 'table',
        content: {
          rows: 2,
          columns: 2,
          cells: [
            [
              { type: 'text', content: 'Header 1' },
              { type: 'text', content: 'Header 2' }
            ],
            [
              { type: 'text', content: 'Cell 1' },
              { type: 'text', content: 'Cell 2' }
            ]
          ],
          headerRow: true,
          borderStyle: 'solid',
          borderColor: '#e0e0e0',
          borderWidth: '1px'
        }
      };

    default:
      // For unknown block types, default to text block
      return {
        ...baseBlock,
        type: 'text',
        content: {
          html: `<p>Unknown block type: ${blockType}</p>`,
          textStyle: 'normal',
          placeholder: 'Click to edit...'
        }
      };
  }
};
