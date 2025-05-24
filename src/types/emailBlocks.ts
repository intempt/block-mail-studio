
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
  fontFamily?: string;
  letterSpacing?: string;
  lineHeight?: string;
  textAlign?: 'left' | 'center' | 'right';
  padding?: string;
  margin?: string;
  borderRadius?: string;
  border?: string;
  boxShadow?: string;
}

export interface ResponsiveSettings {
  desktop: BlockStyling & BlockDimensions;
  tablet: BlockStyling & BlockDimensions;
  mobile: BlockStyling & BlockDimensions;
}

export interface DisplayOptions {
  showOnDesktop: boolean;
  showOnTablet: boolean;
  showOnMobile: boolean;
  audienceTargeting?: string[];
}

export interface BaseBlock {
  id: string;
  type: string;
  content: any;
  styling: ResponsiveSettings;
  position: BlockPosition;
  displayOptions: DisplayOptions;
  selected?: boolean;
  sectionId?: string;
}

export interface TextBlock extends BaseBlock {
  type: 'text';
  content: {
    html: string;
    textStyle: 'normal' | 'heading1' | 'heading2' | 'heading3' | 'heading4';
    placeholder?: string;
  };
}

export interface ImageBlock extends BaseBlock {
  type: 'image';
  content: {
    src: string;
    alt: string;
    link?: string;
    alignment: 'left' | 'center' | 'right';
    width: string;
    isDynamic: boolean;
    dynamicVariable?: string;
  };
}

export interface ButtonBlock extends BaseBlock {
  type: 'button';
  content: {
    text: string;
    link: string;
    style: 'solid' | 'outline' | 'text';
    size: 'small' | 'medium' | 'large';
  };
}

export interface SplitBlock extends BaseBlock {
  type: 'split';
  content: {
    leftContent: 'text' | 'image';
    rightContent: 'text' | 'image';
    leftData: any;
    rightData: any;
    ratio: '50-50' | '60-40' | '40-60' | '70-30' | '30-70';
  };
}

export interface ProductBlock extends BaseBlock {
  type: 'product';
  content: {
    mode: 'static' | 'dynamic';
    products: Array<{
      id: string;
      name: string;
      price: string;
      image: string;
      description?: string;
      ctaText: string;
      ctaLink: string;
    }>;
    feedId?: string;
    layout: 'grid' | 'list' | 'carousel';
    showImages: boolean;
    showNames: boolean;
    showPrices: boolean;
    showDescriptions: boolean;
    columns: number;
  };
}

export interface TableBlock extends BaseBlock {
  type: 'table';
  content: {
    rows: number;
    columns: number;
    cells: Array<Array<{
      type: 'text' | 'image';
      content: string;
      styling?: BlockStyling;
    }>>;
    headerRow: boolean;
    borderStyle: 'none' | 'solid' | 'dashed' | 'dotted';
    borderColor: string;
    borderWidth: string;
  };
}

export interface HeaderLinkBarBlock extends BaseBlock {
  type: 'header-link-bar';
  content: {
    logo: {
      src: string;
      alt: string;
      link: string;
      width: string;
    };
    links: Array<{
      text: string;
      url: string;
      showOnDesktop: boolean;
      showOnMobile: boolean;
    }>;
    layout: 'left-logo' | 'center-logo' | 'right-logo';
    mobileLayout: 'stacked' | 'hamburger' | 'minimal';
  };
}

export interface DropShadowBlock extends BaseBlock {
  type: 'drop-shadow';
  content: {
    shadowType: 'light' | 'dark' | 'darker' | 'custom';
    shadowColor: string;
    shadowBlur: string;
    shadowSpread: string;
    shadowOffsetX: string;
    shadowOffsetY: string;
    children: EmailBlock[];
  };
}

export interface ReviewQuoteBlock extends BaseBlock {
  type: 'review-quote';
  content: {
    reviewId?: string;
    reviewText: string;
    reviewerName: string;
    rating: number;
    showRating: boolean;
    quoteStyle: 'simple' | 'card' | 'testimonial';
  };
}

export interface ColumnsBlock extends BaseBlock {
  type: 'columns';
  content: {
    columnCount: 1 | 2 | 3 | 4;
    columnRatio: string;
    columns: Array<{
      id: string;
      blocks: EmailBlock[];
      width: string;
    }>;
    gap: string;
  };
}

export interface VideoBlock extends BaseBlock {
  type: 'video';
  content: {
    videoUrl: string;
    thumbnail: string;
    showPlayButton: boolean;
    platform: 'youtube' | 'vimeo' | 'tiktok' | 'custom';
    autoThumbnail: boolean;
  };
}

export interface SocialBlock extends BaseBlock {
  type: 'social';
  content: {
    platforms: Array<{
      name: string;
      url: string;
      icon: string;
      iconStyle: 'color' | 'black' | 'white' | 'grey' | 'custom';
      showLabel: boolean;
    }>;
    layout: 'horizontal' | 'vertical';
    iconSize: string;
    spacing: string;
  };
}

export interface SpacerBlock extends BaseBlock {
  type: 'spacer';
  content: {
    height: string;
    mobileHeight: string;
  };
}

export interface DividerBlock extends BaseBlock {
  type: 'divider';
  content: {
    style: 'solid' | 'dashed' | 'dotted';
    thickness: string;
    color: string;
    width: string;
    alignment: 'left' | 'center' | 'right';
  };
}

export interface HtmlBlock extends BaseBlock {
  type: 'html';
  content: {
    html: string;
    customCSS?: string;
  };
}

export type EmailBlock = 
  | TextBlock 
  | ImageBlock 
  | ButtonBlock 
  | SplitBlock 
  | ProductBlock
  | TableBlock
  | HeaderLinkBarBlock
  | DropShadowBlock
  | ReviewQuoteBlock
  | ColumnsBlock
  | VideoBlock
  | SocialBlock
  | SpacerBlock 
  | DividerBlock 
  | HtmlBlock;

export interface EmailSection {
  id: string;
  name: string;
  blocks: EmailBlock[];
  styling: ResponsiveSettings;
  displayOptions: DisplayOptions;
  backgroundImage?: string;
}

export interface TemplateStyles {
  templateBackground: string;
  backgroundImage?: string;
  contentBackground: string;
  width: string;
  cornerRadius: string;
  margins: string;
  padding: string;
  border: string;
  fontFamily: string;
  textStyles: {
    normal: BlockStyling;
    heading1: BlockStyling;
    heading2: BlockStyling;
    heading3: BlockStyling;
    heading4: BlockStyling;
  };
  mobileOptimization: boolean;
  currency: string;
}

export interface UniversalContent {
  id: string;
  name: string;
  type: 'block' | 'section';
  content: EmailBlock | EmailSection;
  createdAt: Date;
  updatedAt: Date;
  usageCount: number;
}

export interface EmailCanvas {
  sections: EmailSection[];
  templateStyles: TemplateStyles;
  universalContent: UniversalContent[];
  settings: {
    width: string;
    backgroundColor: string;
    fontFamily: string;
  };
}
