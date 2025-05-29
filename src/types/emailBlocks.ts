
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
    width?: string;
    dynamicVariable?: string;
  };
  styling: {
    desktop: {
      width?: string;
      height?: string;
      maxWidth?: string;
      padding?: string;
      border?: string;
      borderRadius?: string;
      backgroundColor?: string;
      margin?: string;
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
      margin?: string;
    };
  };
}

export interface DividerBlock extends EmailBlock {
  type: 'divider';
  content: {
    style: 'solid' | 'dashed' | 'dotted';
    size: 'small' | 'medium' | 'large';
    thickness?: string;
    color?: string;
    width?: string;
    alignment?: 'left' | 'center' | 'right';
  };
  styling: {
    desktop: {
      width?: string;
      height?: string;
      color?: string;
      margin?: string;
      backgroundColor?: string;
      padding?: string;
    };
  };
}

export interface SpacerBlock extends EmailBlock {
  type: 'spacer';
  content: {
    height: string;
    mobileHeight?: string;
  };
  styling: {
    desktop: {
      height: string;
    };
  };
}

export interface VideoBlock extends EmailBlock {
  type: 'video';
  content: {
    src: string;
    thumbnail: string;
    title?: string;
    showPlayButton?: boolean;
  };
  styling: {
    desktop: {
      width?: string;
      height?: string;
      borderRadius?: string;
      backgroundColor?: string;
      padding?: string;
      margin?: string;
    };
  };
}

export interface SocialBlock extends EmailBlock {
  type: 'social';
  content: {
    platforms: Array<{
      name: string;
      url: string;
      icon?: string;
    }>;
    layout?: 'horizontal' | 'vertical';
  };
  styling: {
    desktop: {
      backgroundColor?: string;
      padding?: string;
      margin?: string;
    };
  };
}

export interface HtmlBlock extends EmailBlock {
  type: 'html';
  content: {
    html: string;
  };
  styling: {
    desktop: {
      backgroundColor?: string;
      padding?: string;
      margin?: string;
    };
  };
}

export interface TableBlock extends EmailBlock {
  type: 'table';
  content: {
    rows: Array<Array<string>>;
    headers?: Array<string>;
  };
  styling: {
    desktop: {
      backgroundColor?: string;
      padding?: string;
      margin?: string;
      borderColor?: string;
    };
  };
}

export interface CodeBlock extends EmailBlock {
  type: 'code';
  content: {
    code: string;
    language?: string;
  };
  styling: {
    desktop: {
      backgroundColor?: string;
      padding?: string;
      margin?: string;
    };
  };
}

export interface MenuBlock extends EmailBlock {
  type: 'menu';
  content: {
    items: Array<{
      text: string;
      link?: string;
      url?: string;
      label?: string;
    }>;
    layout?: 'horizontal' | 'vertical';
  };
  styling: {
    desktop: {
      backgroundColor?: string;
      padding?: string;
      margin?: string;
    };
  };
}

export interface ColumnsBlock extends EmailBlock {
  type: 'columns';
  content: {
    columns: Array<{
      id: string;
      width: number;
      blocks: EmailBlock[];
    }>;
  };
  styling: {
    desktop: {
      backgroundColor?: string;
      padding?: string;
      margin?: string;
    };
  };
}

export interface SplitBlock extends EmailBlock {
  type: 'split';
  content: {
    leftColumn: EmailBlock[];
    rightColumn: EmailBlock[];
    leftWidth?: number;
    rightWidth?: number;
  };
  styling: {
    desktop: {
      backgroundColor?: string;
      padding?: string;
      margin?: string;
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

export type BlockType = 'text' | 'image' | 'button' | 'divider' | 'spacer' | 'video' | 'social' | 'html' | 'table' | 'columns' | 'code' | 'menu' | 'split';
