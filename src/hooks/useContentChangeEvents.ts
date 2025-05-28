
import { useCallback, useRef, useEffect } from 'react';

interface ContentChangeEventOptions {
  debounceMs?: number;
  changeThreshold?: number;
}

export type ContentChangeCallback = (hasChanged: boolean, isStable: boolean) => void;

export const useContentChangeEvents = (
  content: string,
  onContentChange: ContentChangeCallback,
  options: ContentChangeEventOptions = {}
) => {
  const { debounceMs = 2000, changeThreshold = 0.05 } = options;
  
  const lastAnalyzedHashRef = useRef<string>('');
  const lastContentRef = useRef(content);
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();
  const observerRef = useRef<MutationObserver>();

  const hashContent = useCallback((text: string): string => {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString();
  }, []);

  const calculateSimilarity = useCallback((content1: string, content2: string): number => {
    if (content1 === content2) return 1;
    if (!content1 || !content2) return 0;
    
    const longer = content1.length > content2.length ? content1 : content2;
    const shorter = content1.length > content2.length ? content2 : content1;
    
    if (longer.length === 0) return 1;
    
    // Simple similarity check for performance
    const commonChars = shorter.split('').filter(char => longer.includes(char)).length;
    return commonChars / longer.length;
  }, []);

  const processContentChange = useCallback(() => {
    const currentContent = content.trim();
    const lastContent = lastContentRef.current.trim();
    
    if (currentContent === lastContent) return;
    
    // Immediate callback for instability
    onContentChange(false, false);
    
    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    // Set stabilization timeout
    debounceTimeoutRef.current = setTimeout(() => {
      const currentHash = hashContent(currentContent);
      const similarity = calculateSimilarity(currentContent, lastContent);
      const isSignificantChange = similarity < (1 - changeThreshold);
      const hasNewContent = currentHash !== lastAnalyzedHashRef.current;
      const hasChanged = isSignificantChange && hasNewContent && currentContent.length > 10;
      
      lastContentRef.current = currentContent;
      onContentChange(hasChanged, true);
    }, debounceMs);
  }, [content, onContentChange, debounceMs, changeThreshold, hashContent, calculateSimilarity]);

  const markAsAnalyzed = useCallback(() => {
    const currentHash = hashContent(content);
    lastAnalyzedHashRef.current = currentHash;
    onContentChange(false, true);
  }, [content, hashContent, onContentChange]);

  // Process changes immediately when content changes
  useEffect(() => {
    processContentChange();
    
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [processContentChange]);

  return { markAsAnalyzed };
};
