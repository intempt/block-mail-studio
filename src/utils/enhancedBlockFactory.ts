import { EmailBlock, Styling, DisplayOptions } from '@/types/emailBlocks';

const createDefaultStyling = (): Styling => ({
  desktop: {
    width: '100%',
    height: 'auto',
    backgroundColor: 'transparent',
    padding: '16px',
    margin: '0',
    textColor: '#333333',
    fontSize: '16px',
    fontWeight: 'normal',
    fontFamily: 'Arial, sans-serif',
    lineHeight: '1.6',
    textAlign: 'left',
    borderRadius: '0',
    border: 'none',
  },
  tablet: {
    width: '100%',
    height: 'auto',
    backgroundColor: 'transparent',
    padding: '12px',
    margin: '0',
    textColor: '#333333',
    fontSize: '16px',
    fontWeight: 'normal',
    fontFamily: 'Arial, sans-serif',
    lineHeight: '1.6',
    textAlign: 'left',
    borderRadius: '0',
    border: 'none',
  },
  mobile: {
    width: '100%',
    height: 'auto',
    backgroundColor: 'transparent',
    padding: '8px',
    margin: '0',
    textColor: '#333333',
    fontSize: '14px',
    fontWeight: 'normal',
    fontFamily: 'Arial, sans-serif',
    lineHeight: '1.6',
    textAlign: 'left',
    borderRadius: '0',
    border: 'none',
  },
});

const createDefaultDisplayOptions = (): DisplayOptions => ({
  showOnDesktop: true,
  showOnTablet: true,
  showOnMobile: true,
});

export const generateUniqueId = (): string => {
  return `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const createBlock = (type: string, sectionId?: string): EmailBlock => {
  const baseBlock = {
    id: generateUniqueId(),
    styling: createDefaultStyling(),
    position: { x: 0, y: 0 },
    displayOptions: createDefaultDisplayOptions(),
    sectionId,
  };

  switch (type) {
    case 'text':
      return {
        ...baseBlock,
        type: 'text',
        content: {
          html: '<p>Add your text content here...</p>',
          textStyle: 'normal',
          placeholder: 'Click to add text...',
        },
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
          isDynamic: false,
        },
      };

    case 'button':
      return {
        ...baseBlock,
        type: 'button',
        content: {
          text: 'Click Here',
          link: '#',
          style: 'solid',
          size: 'medium',
        },
        styling: {
          ...baseBlock.styling,
          desktop: {
            ...baseBlock.styling.desktop,
            backgroundColor: '#3B82F6',
            textColor: '#ffffff',
            padding: '12px 24px',
            borderRadius: '6px',
            textAlign: 'center',
          },
        },
      };

    case 'spacer':
      return {
        ...baseBlock,
        type: 'spacer',
        content: {
          height: '40px',
          mobileHeight: '20px',
        },
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
          alignment: 'center',
        },
      };

    case 'video':
      return {
        ...baseBlock,
        type: 'video',
        content: {
          videoUrl: '',
          thumbnail: 'https://via.placeholder.com/400x225?text=Video+Thumbnail',
          showPlayButton: true,
          platform: 'youtube',
          autoThumbnail: true,
        },
      };

    case 'social':
      return {
        ...baseBlock,
        type: 'social',
        content: {
          platforms: [
            { name: 'Facebook', url: '#', icon: 'facebook', iconStyle: 'color', showLabel: false },
            { name: 'Twitter', url: '#', icon: 'twitter', iconStyle: 'color', showLabel: false },
            { name: 'Instagram', url: '#', icon: 'instagram', iconStyle: 'color', showLabel: false },
          ],
          layout: 'horizontal',
          iconSize: '32px',
          spacing: '16px',
        },
      };

    case 'html':
      return {
        ...baseBlock,
        type: 'html',
        content: {
          html: '<div style="padding: 20px; background-color: #f8f9fa; border: 1px dashed #ccc; text-align: center;">Custom HTML Block</div>',
          customCSS: '',
        },
      };

    case 'table':
      return {
        ...baseBlock,
        type: 'table',
        content: {
          rows: 3,
          columns: 2,
          cells: [
            [
              { type: 'text', content: 'Header 1' },
              { type: 'text', content: 'Header 2' },
            ],
            [
              { type: 'text', content: 'Row 1, Col 1' },
              { type: 'text', content: 'Row 1, Col 2' },
            ],
            [
              { type: 'text', content: 'Row 2, Col 1' },
              { type: 'text', content: 'Row 2, Col 2' },
            ],
          ],
          headerRow: true,
          borderStyle: 'solid',
          borderColor: '#e0e0e0',
          borderWidth: '1px',
        },
      };

    default:
      throw new Error(`Unknown block type: ${type}`);
  }
};

export const duplicateBlock = (block: EmailBlock): EmailBlock => {
  return {
    ...block,
    id: generateUniqueId(),
  };
};

export const createSection = (name: string = 'New Section') => ({
  id: generateUniqueId(),
  name,
  blocks: [],
  styling: createDefaultStyling(),
  displayOptions: createDefaultDisplayOptions(),
});
