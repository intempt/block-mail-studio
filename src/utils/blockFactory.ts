
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
    displayOptions: {
      showOnDesktop: true,
      showOnTablet: true,
      showOnMobile: true,
    },
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
      };

    case 'split':
      return {
        ...baseBlock,
        type: 'split',
        content: {
          leftContent: 'text',
          rightContent: 'image',
          leftData: { html: '<p>Left content</p>' },
          rightData: { src: 'https://via.placeholder.com/200x150', alt: 'Right image' },
          ratio: '50-50',
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
            { name: 'Facebook', url: '#', icon: 'https://via.placeholder.com/32x32?text=f', iconStyle: 'color', showLabel: false },
            { name: 'Twitter', url: '#', icon: 'https://via.placeholder.com/32x32?text=t', iconStyle: 'color', showLabel: false },
            { name: 'LinkedIn', url: '#', icon: 'https://via.placeholder.com/32x32?text=in', iconStyle: 'color', showLabel: false },
          ],
          layout: 'horizontal',
          iconSize: '32px',
          spacing: '8px',
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

    case 'product':
      return {
        ...baseBlock,
        type: 'product',
        content: {
          mode: 'static',
          products: [],
          layout: 'grid',
          showImages: true,
          showNames: true,
          showPrices: true,
          showDescriptions: false,
          columns: 2,
        },
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
          borderWidth: '1px',
        },
      };

    case 'header-link-bar':
      return {
        ...baseBlock,
        type: 'header-link-bar',
        content: {
          logo: {
            src: 'https://via.placeholder.com/150x50?text=Logo',
            alt: 'Logo',
            link: '#',
            width: '150px',
          },
          links: [
            { text: 'Home', url: '#', showOnDesktop: true, showOnMobile: true },
            { text: 'About', url: '#', showOnDesktop: true, showOnMobile: false },
            { text: 'Contact', url: '#', showOnDesktop: true, showOnMobile: true },
          ],
          layout: 'left-logo',
          mobileLayout: 'stacked',
        },
      };

    case 'drop-shadow':
      return {
        ...baseBlock,
        type: 'drop-shadow',
        content: {
          shadowType: 'light',
          shadowColor: 'rgba(0,0,0,0.1)',
          shadowBlur: '10px',
          shadowSpread: '0px',
          shadowOffsetX: '0px',
          shadowOffsetY: '2px',
          children: [],
        },
      };

    case 'review-quote':
      return {
        ...baseBlock,
        type: 'review-quote',
        content: {
          reviewText: 'This product is amazing! Highly recommended.',
          reviewerName: 'John Doe',
          rating: 5,
          showRating: true,
          quoteStyle: 'card',
        },
      };

    case 'columns':
      return {
        ...baseBlock,
        type: 'columns',
        content: {
          columnCount: 2,
          columnRatio: '50-50',
          columns: [
            { id: 'col-1', blocks: [], width: '50%' },
            { id: 'col-2', blocks: [], width: '50%' },
          ],
          gap: '16px',
        },
      };

    default:
      throw new Error(`Unknown block type: ${type}`);
  }
};
