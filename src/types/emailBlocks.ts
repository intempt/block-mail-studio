export interface EmailBlock {
  id: string;
  type: BlockType;
  content: any;
  styling: any;
}

export interface TextBlock extends EmailBlock {
  type: 'text';
  content: {
    html: string;
    placeholder?: string;
  };
  styling: {
    desktop: {
      fontFamily: string;
      fontSize: string;
      color: string;
      padding: string;
      textAlign: 'left' | 'center' | 'right';
      backgroundColor: string;
      border: string;
      borderRadius: string;
      width?: string;
      height?: string;
    };
  };
}

export interface ImageBlock extends EmailBlock {
  type: 'image';
  content: {
    src: string;
    alt: string;
  };
  styling: {
    desktop: {
      width?: string;
      height?: string;
      maxWidth?: string;
      padding?: string;
      border?: string;
      borderRadius?: string;
    };
  };
}

export interface ButtonBlock extends EmailBlock {
  type: 'button';
  content: {
    text: string;
    link: string;
  };
  styling: {
    desktop: {
      backgroundColor: string;
      textColor: string;
      borderRadius: string;
      padding: string;
      fontFamily?: string;
      fontSize?: string;
      fontWeight?: string;
      border?: string;
    };
  };
}

export interface DividerBlock extends EmailBlock {
  type: 'divider';
  content: {
    style: 'solid' | 'dashed';
    size: 'small' | 'medium' | 'large';
  };
  styling: {
    desktop: {
      width?: string;
      height?: string;
      color?: string;
      margin?: string;
    };
  };
}

export type BlockType = 'text' | 'image' | 'button' | 'divider' | 'spacer' | 'video' | 'social' | 'html' | 'table' | 'columns';
