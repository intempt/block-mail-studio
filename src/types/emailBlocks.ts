
export interface EmailBlock {
  id: string;
  type: BlockType;
  content: any;
  styling: any;
  isStarred?: boolean;
  displayOptions?: {
    showOnDesktop: boolean;
    showOnTablet: boolean;
    showOnMobile: boolean;
  };
  position?: { x: number; y: number };
}

export interface TextBlock extends EmailBlock {
  type: 'text';
  content: {
    html: string;
    placeholder?: string;
    textStyle?: string;
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
      margin?: string;
      textColor?: string;
      fontWeight?: string;
    };
  };
}

export interface ImageBlock extends EmailBlock {
  type: 'image';
  content: {
    src: string;
    alt: string;
    link?: string;
    alignment?: 'left' | 'center' | 'right';
    isDynamic?: boolean;
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
    style?: string;
    size?: 'small' | 'medium' | 'large';
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
    thickness?: number;
    color?: string;
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

export interface SpacerBlock extends EmailBlock {
  type: 'spacer';
  content: {
    height: number;
  };
  styling: {
    desktop: {
      height: string;
    };
  };
}

export interface UniversalContent {
  id: string;
  type: string;
  name: string;
  content: any;
  metadata?: any;
}

export type BlockType = 'text' | 'image' | 'button' | 'divider' | 'spacer' | 'video' | 'social' | 'html' | 'table' | 'columns';
