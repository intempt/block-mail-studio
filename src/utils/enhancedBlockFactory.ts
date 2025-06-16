import { EmailBlock, Styling, DisplayOptions } from '@/types/emailBlocks';
import { generateUniqueId } from '@/utils/idGenerator';

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
          html: '',
          textStyle: 'normal',
          placeholder: 'Start typing your content here...',
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
          text: '<a href="#" style="color: inherit; text-decoration: none;">Click Here</a>',
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
          width: '100%',
          height: 'auto',
          alignment: 'center',
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
          cellPadding: '8px',
          backgroundColor: 'transparent',
          headerBackgroundColor: '#f8fafc',
          textAlign: 'left',
        },
      };

    case 'content':
      return {
        ...baseBlock,
        type: 'content',
        content: {
          jsonData: [
            { name: 'John Doe', email: 'john@example.com', age: 30, role: 'Developer' },
            { name: 'Jane Smith', email: 'jane@example.com', age: 28, role: 'Designer' },
            { name: 'Bob Johnson', email: 'bob@example.com', age: 35, role: 'Manager' }
          ],
          rows: 3,
          columns: 3,
          layout: 'table',
          selectedFields: ['name', 'email', 'role'],
          fieldMappings: {
            name: { label: 'Full Name', type: 'text' },
            email: { label: 'Email Address', type: 'text' },
            age: { label: 'Age', type: 'text' },
            role: { label: 'Job Role', type: 'text' }
          },
          showHeaders: true,
          headerStyle: 'bold',
          cellPadding: '8px',
          borderStyle: 'solid',
          borderColor: '#e0e0e0',
          alternateRowColors: true,
          alternateColor: '#f9f9f9'
        },
      };

    case 'columns':
      return createColumnsBlock('50-50');

    default:
      throw new Error(`Unknown block type: ${type}`);
  }
};

const createColumnsBlock = (ratio: string): EmailBlock => {
  const baseBlock = {
    id: generateUniqueId(),
    styling: createDefaultStyling(),
    position: { x: 0, y: 0 },
    displayOptions: createDefaultDisplayOptions(),
  };

  const getColumnsConfig = (ratio: string) => {
    switch (ratio) {
      case '100%':
        return {
          columnCount: 1,
          columns: [{ id: generateUniqueId('column'), blocks: [] }]
        };
      case '50-50':
        return {
          columnCount: 2,
          columns: [
            { id: generateUniqueId('column'), blocks: [] },
            { id: generateUniqueId('column'), blocks: [] }
          ]
        };
      case '33-67':
        return {
          columnCount: 2,
          columns: [
            { id: generateUniqueId('column'), blocks: [] },
            { id: generateUniqueId('column'), blocks: [] }
          ]
        };
      case '67-33':
        return {
          columnCount: 2,
          columns: [
            { id: generateUniqueId('column'), blocks: [] },
            { id: generateUniqueId('column'), blocks: [] }
          ]
        };
      case '33-33-33':
        return {
          columnCount: 3,
          columns: [
            { id: generateUniqueId('column'), blocks: [] },
            { id: generateUniqueId('column'), blocks: [] },
            { id: generateUniqueId('column'), blocks: [] }
          ]
        };
      case '25-25-25-25':
        return {
          columnCount: 4,
          columns: [
            { id: generateUniqueId('column'), blocks: [] },
            { id: generateUniqueId('column'), blocks: [] },
            { id: generateUniqueId('column'), blocks: [] },
            { id: generateUniqueId('column'), blocks: [] }
          ]
        };
      default:
        return {
          columnCount: 2,
          columns: [
            { id: generateUniqueId('column'), blocks: [] },
            { id: generateUniqueId('column'), blocks: [] }
          ]
        };
    }
  };

  const config = getColumnsConfig(ratio);

  return {
    ...baseBlock,
    type: 'columns',
    content: {
      columnCount: config.columnCount,
      columnRatio: ratio,
      columns: config.columns,
      gap: '16px',
    },
  };
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
