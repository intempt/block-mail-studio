
export interface BlockPosition {
  x: number;
  y: number;
}

export interface BlockDimensions {
  width: string;
  height: string;
}

export interface BlockStyling {
  backgroundColor?: string;
  textColor?: string;
  fontSize?: string;
  fontWeight?: string;
  padding?: string;
  margin?: string;
  borderRadius?: string;
  border?: string;
}

export interface ResponsiveSettings {
  desktop: BlockStyling & BlockDimensions;
  tablet: BlockStyling & BlockDimensions;
  mobile: BlockStyling & BlockDimensions;
}

export interface BaseBlock {
  id: string;
  type: string;
  content: any;
  styling: ResponsiveSettings;
  position: BlockPosition;
  selected?: boolean;
}

export interface TextBlock extends BaseBlock {
  type: 'text';
  content: {
    html: string;
    placeholder?: string;
  };
}

export interface ImageBlock extends BaseBlock {
  type: 'image';
  content: {
    src: string;
    alt: string;
    link?: string;
  };
}

export interface ButtonBlock extends BaseBlock {
  type: 'button';
  content: {
    text: string;
    link: string;
    style: 'solid' | 'outline' | 'text';
  };
}

export interface SplitBlock extends BaseBlock {
  type: 'split';
  content: {
    leftBlocks: EmailBlock[];
    rightBlocks: EmailBlock[];
    ratio: '50-50' | '60-40' | '40-60' | '70-30' | '30-70';
  };
}

export interface SpacerBlock extends BaseBlock {
  type: 'spacer';
  content: {
    height: string;
  };
}

export interface DividerBlock extends BaseBlock {
  type: 'divider';
  content: {
    style: 'solid' | 'dashed' | 'dotted';
    thickness: string;
    color: string;
  };
}

export interface VideoBlock extends BaseBlock {
  type: 'video';
  content: {
    thumbnail: string;
    videoUrl: string;
    playButton?: boolean;
  };
}

export interface SocialBlock extends BaseBlock {
  type: 'social';
  content: {
    platforms: Array<{
      name: string;
      url: string;
      icon: string;
    }>;
    layout: 'horizontal' | 'vertical';
  };
}

export interface MenuBlock extends BaseBlock {
  type: 'menu';
  content: {
    items: Array<{
      label: string;
      url: string;
    }>;
    layout: 'horizontal' | 'vertical';
  };
}

export interface HtmlBlock extends BaseBlock {
  type: 'html';
  content: {
    html: string;
  };
}

export interface CodeBlock extends BaseBlock {
  type: 'code';
  content: {
    code: string;
    language?: string;
  };
}

export type EmailBlock = 
  | TextBlock 
  | ImageBlock 
  | ButtonBlock 
  | SplitBlock 
  | SpacerBlock 
  | DividerBlock 
  | VideoBlock 
  | SocialBlock 
  | MenuBlock 
  | HtmlBlock 
  | CodeBlock;

export interface EmailCanvas {
  blocks: EmailBlock[];
  settings: {
    width: string;
    backgroundColor: string;
    fontFamily: string;
  };
}
