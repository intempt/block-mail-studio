export interface Position {
  x: number;
  y: number;
}

export interface Styling {
  desktop: {
    width: string;
    height: string;
    padding?: string;
    margin?: string;
    backgroundColor?: string;
    border?: string;
    borderRadius?: string;
    fontSize?: string;
    fontFamily?: string;
    color?: string;
    textColor?: string;
    textAlign?: string;
    boxShadow?: string;
    fontWeight?: string;
    textDecoration?: string;
    lineHeight?: string;
  };
  tablet: {
    width: string;
    height: string;
    padding?: string;
    margin?: string;
    backgroundColor?: string;
    border?: string;
    borderRadius?: string;
    fontSize?: string;
    fontFamily?: string;
    color?: string;
    textColor?: string;
    textAlign?: string;
    boxShadow?: string;
    fontWeight?: string;
    textDecoration?: string;
    lineHeight?: string;
  };
  mobile: {
    width: string;
    height: string;
    padding?: string;
    margin?: string;
    backgroundColor?: string;
    border?: string;
    borderRadius?: string;
    fontSize?: string;
    fontFamily?: string;
    color?: string;
    textColor?: string;
    textAlign?: string;
    boxShadow?: string;
    fontWeight?: string;
    textDecoration?: string;
    lineHeight?: string;
  };
}

export interface DisplayOptions {
  showOnDesktop: boolean;
  showOnTablet: boolean;
  showOnMobile: boolean;
}

export interface TextContent {
  html: string;
  textStyle: 'normal' | 'heading1' | 'heading2' | 'heading3' | 'heading4' | 'heading5' | 'heading6' | 'quote' | 'code';
  placeholder?: string;
}

export interface ButtonContent {
  text: string;
  link: string;
  style: 'solid' | 'outline' | 'ghost' | 'text';
  size: 'small' | 'medium' | 'large';
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderRadius?: string;
  padding?: string;
  fontSize?: string;
  fontWeight?: string;
  alignment?: 'left' | 'center' | 'right';
}

export interface ImageContent {
  src: string;
  alt: string;
  alignment: 'left' | 'center' | 'right';
  width: string;
  height?: string;
  link?: string;
  borderRadius?: string;
  isDynamic?: boolean;
  dynamicSrc?: string;
  dynamicVariable?: string;
}

export interface SpacerContent {
  height: string;
  mobileHeight?: string;
  backgroundColor?: string;
}

export interface DividerContent {
  style: 'solid' | 'dashed' | 'dotted';
  thickness: string;
  color: string;
  width: string;
  alignment: 'left' | 'center' | 'right';
  marginTop?: string;
  marginBottom?: string;
}

export interface HtmlContent {
  html: string;
  customCSS?: string;
}

export interface VideoContent {
  videoUrl: string;
  thumbnail: string;
  showPlayButton: boolean;
  platform: 'youtube' | 'vimeo' | 'custom' | 'tiktok';
  autoThumbnail: boolean;
  width?: string;
  height?: string;
  alignment?: 'left' | 'center' | 'right';
}

export interface SocialPlatform {
  name: string;
  url: string;
  icon: string;
  iconStyle: 'color' | 'black' | 'white';
  showLabel: boolean;
}

export interface SocialContent {
  platforms: SocialPlatform[];
  layout: 'horizontal' | 'vertical';
  iconSize: string;
  spacing: string;
  alignment?: 'left' | 'center' | 'right';
}

export interface TableCell {
  type: 'text' | 'image' | 'button';
  content: string;
}

export interface TableContent {
  rows: number;
  columns: number;
  cells: TableCell[][];
  headerRow: boolean;
  borderStyle: 'solid' | 'dashed' | 'dotted' | 'none';
  borderColor: string;
  borderWidth: string;
  cellPadding?: string;
  backgroundColor?: string;
  headerBackgroundColor?: string;
  textAlign?: 'left' | 'center' | 'right';
}

export interface Column {
  id: string;
  blocks: EmailBlock[];
  width: string;
}

export interface ColumnsContent {
  columnCount: number;
  columnRatio: string;
  columns: Column[];
  gap: string;
  backgroundColor?: string;
  padding?: string;
  borderRadius?: string;
  border?: string;
}

export interface CodeContent {
  code: string;
  language: string;
  theme?: string;
}

export interface MenuContent {
  items: Array<{
    text: string;
    link: string;
    label?: string;
    url?: string;
  }>;
  layout: 'horizontal' | 'vertical';
  alignment?: 'left' | 'center' | 'right';
}

export interface SplitContent {
  leftColumn: EmailBlock[];
  rightColumn: EmailBlock[];
  splitRatio: string;
  ratio?: string;
}

export type EmailBlockContent = 
  | TextContent 
  | ButtonContent 
  | ImageContent 
  | SpacerContent 
  | DividerContent 
  | HtmlContent 
  | VideoContent 
  | SocialContent 
  | TableContent
  | ColumnsContent
  | CodeContent
  | MenuContent
  | SplitContent
  | ProductContent;

export interface EmailBlock {
  id: string;
  type: 'text' | 'button' | 'image' | 'spacer' | 'divider' | 'html' | 'video' | 'social' | 'table' | 'columns' | 'code' | 'menu' | 'split' | 'product' | 'header-link-bar' | 'drop-shadow' | 'review-quote';
  content: any;
  styling: Styling;
  position: Position;
  displayOptions: DisplayOptions;
  isStarred?: boolean;
  selected?: boolean;
}

// Specific typed block interfaces
export interface TextBlock extends EmailBlock {
  type: 'text';
  content: TextContent;
}

export interface ButtonBlock extends EmailBlock {
  type: 'button';
  content: ButtonContent;
}

export interface ImageBlock extends EmailBlock {
  type: 'image';
  content: ImageContent;
}

export interface SpacerBlock extends EmailBlock {
  type: 'spacer';
  content: SpacerContent;
}

export interface DividerBlock extends EmailBlock {
  type: 'divider';
  content: DividerContent;
}

export interface HtmlBlock extends EmailBlock {
  type: 'html';
  content: HtmlContent;
}

export interface VideoBlock extends EmailBlock {
  type: 'video';
  content: VideoContent;
}

export interface SocialBlock extends EmailBlock {
  type: 'social';
  content: SocialContent;
}

export interface TableBlock extends EmailBlock {
  type: 'table';
  content: TableContent;
}

export interface ColumnsBlock extends EmailBlock {
  type: 'columns';
  content: ColumnsContent;
}

export interface CodeBlock extends EmailBlock {
  type: 'code';
  content: CodeContent;
}

export interface MenuBlock extends EmailBlock {
  type: 'menu';
  content: MenuContent;
}

export interface SplitBlock extends EmailBlock {
  type: 'split';
  content: SplitContent;
}

export interface Product {
  id: string;
  image: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  link: string;
}

export interface ProductContent {
  products: Product[];
  layout: 'grid' | 'list';
  columns: number;
  showImages: boolean;
  showTitles: boolean;
  showDescriptions: boolean;
  showPrices: boolean;
  showOriginalPrices: boolean;
  type?: 'dynamic' | 'static';
  schemaKeys?: string[];
}

export interface ProductBlock extends EmailBlock {
  type: 'product';
  content: ProductContent;
}

export interface UniversalContent {
  id: string;
  name: string;
  type: 'text' | 'image' | 'button' | 'link';
  content: string;
  metadata?: {
    fontSize?: string;
    color?: string;
    backgroundColor?: string;
    alignment?: 'left' | 'center' | 'right';
    fontWeight?: string;
    textDecoration?: string;
  };
}

// Unified EmailTemplate interface for consistent usage across the app
export interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  html?: string;
  subject?: string;
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  isFavorite: boolean;
  usageCount: number;
  blocks?: EmailBlock[];
  thumbnail?: string;
  globalStyles?: string;
  settings?: {
    width?: string;
    backgroundColor?: string;
    fontFamily?: string;
    [key: string]: any;
  };
}

// Legacy type aliases for compatibility
export type BlockStyling = Styling;
export interface ResponsiveSettings {
  desktop: any;
  tablet: any;
  mobile: any;
}
