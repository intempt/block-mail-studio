
import { useState, useEffect, useCallback, useRef } from 'react';

interface ContentChangeDetectionOptions {
  debounceMs?: number;
  changeThreshold?: number;
}

export const useContentChangeDetection = (
  content: string,
  options: ContentChangeDetectionOptions = {}
) => {
  const { debounceMs = 2000, changeThreshold = 0.05 } = options;
  
  const [hasChanged, setHasChanged] = useState(false);
  const [lastAnalyzedHash, setLastAnalyzedHash] = useState<string>('');
  const [isStable, setIsStable] = useState(true);
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();
  const lastContentRef = useRef(content);

  // Simple hash function for content
  const hashContent = useCallback((text: string): string => {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }, []);

  // Calculate content similarity
  const calculateSimilarity = useCallback((content1: string, content2: string): number => {
    if (content1 === content2) return 1;
    if (!content1 || !content2) return 0;
    
    const longer = content1.length > content2.length ? content1 : content2;
    const shorter = content1.length > content2.length ? content2 : content1;
    
    if (longer.length === 0) return 1;
    
    const editDistance = levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }, []);

  // Simple Levenshtein distance implementation
  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  };

  // Mark content as analyzed
  const markAsAnalyzed = useCallback(() => {
    const currentHash = hashContent(content);
    setLastAnalyzedHash(currentHash);
    setHasChanged(false);
  }, [content, hashContent]);

  // Check for content changes
  useEffect(() => {
    const currentContent = content.trim();
    const lastContent = lastContentRef.current.trim();
    
    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    // Set as unstable immediately when content changes
    if (currentContent !== lastContent) {
      setIsStable(false);
      
      // Set debounced timeout for stability
      debounceTimeoutRef.current = setTimeout(() => {
        setIsStable(true);
        
        // Check if change is significant enough
        const currentHash = hashContent(currentContent);
        const similarity = calculateSimilarity(currentContent, lastContent);
        const isSignificantChange = similarity < (1 - changeThreshold);
        const isNewContent = currentHash !== lastAnalyzedHash;
        
        if (isSignificantChange && isNewContent && currentContent.length > 10) {
          setHasChanged(true);
        }
        
        lastContentRef.current = currentContent;
      }, debounceMs);
    }
    
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [content, debounceMs, changeThreshold, hashContent, calculateSimilarity, lastAnalyzedHash]);

  return {
    hasChanged,
    isStable,
    markAsAnalyzed
  };
};
