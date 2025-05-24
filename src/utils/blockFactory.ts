
import { EmailBlock } from '@/types/emailBlocks';

const defaultResponsiveSettings = {
  desktop: {
    width: '100%',
    height: 'auto',
    backgroundColor: 'transparent',
    padding: '16px',
    margin: '0',
  },
  tablet: {
    width: '100%',
    height: 'auto',
    backgroundColor: 'transparent',
    padding: '12px',
    margin: '0',
  },
  mobile: {
    width: '100%',
    height: 'auto',
    backgroundColor: 'transparent',
    padding: '8px',
    margin: '0',
  },
};

export const createBlock = (type: string): EmailBlock => {
  const baseBlock = {
    id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    styling: defaultResponsiveSettings,
    position: { x: 0, y: 0 },
    selected: false,
  };

  switch (type) {
    case 'text':
      return {
        ...baseBlock,
        type: 'text',
        content: {
          html: '<p>Add your text content here...</p>',
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
        },
      };

    case 'split':
      return {
        ...baseBlock,
        type: 'split',
        content: {
          leftBlocks: [],
          rightBlocks: [],
          ratio: '50-50',
        },
      };

    case 'spacer':
      return {
        ...baseBlock,
        type: 'spacer',
        content: {
          height: '40px',
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
        },
      };

    case 'video':
      return {
        ...baseBlock,
        type: 'video',
        content: {
          thumbnail: 'https://via.placeholder.com/400x225?text=Video+Thumbnail',
          videoUrl: '',
          playButton: true,
        },
      };

    case 'social':
      return {
        ...baseBlock,
        type: 'social',
        content: {
          platforms: [
            { name: 'Facebook', url: '#', icon: 'https://via.placeholder.com/32x32?text=f' },
            { name: 'Twitter', url: '#', icon: 'https://via.placeholder.com/32x32?text=t' },
            { name: 'LinkedIn', url: '#', icon: 'https://via.placeholder.com/32x32?text=in' },
          ],
          layout: 'horizontal',
        },
      };

    case 'menu':
      return {
        ...baseBlock,
        type: 'menu',
        content: {
          items: [
            { label: 'Home', url: '#' },
            { label: 'About', url: '#' },
            { label: 'Contact', url: '#' },
          ],
          layout: 'horizontal',
        },
      };

    case 'html':
      return {
        ...baseBlock,
        type: 'html',
        content: {
          html: '<div style="padding: 20px; background-color: #f8f9fa; border: 1px dashed #ccc; text-align: center;">Custom HTML Block</div>',
        },
      };

    case 'code':
      return {
        ...baseBlock,
        type: 'code',
        content: {
          code: 'console.log("Hello, World!");',
          language: 'javascript',
        },
      };

    default:
      throw new Error(`Unknown block type: ${type}`);
  }
};
