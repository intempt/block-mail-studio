
export interface EmailSnippet {
  id: string;
  name: string;
  description: string;
  category: 'content' | 'layout' | 'media' | 'navigation' | 'custom';
  tags: string[];
  blockData: any; // The actual block content
  blockType: string;
  thumbnail?: string;
  createdAt: Date;
  updatedAt: Date;
  usageCount: number;
  isFavorite: boolean;
  author?: string;
}

export interface SnippetLibrary {
  id: string;
  name: string;
  description: string;
  snippets: EmailSnippet[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SnippetCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  count: number;
}
