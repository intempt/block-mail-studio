
import { useCallback, useEffect, useState } from 'react';
import { EmailBlock } from '@/types/emailBlocks';
import { TableBasedHTMLGenerator } from '@/services/TableBasedHTMLGenerator';

export const useEmailHTMLGenerator = (blocks: EmailBlock[], onContentChange: (content: string) => void) => {
  const [currentEmailHTML, setCurrentEmailHTML] = useState('');

  useEffect(() => {
    const generateHTML = () => {
      const fullHTML = TableBasedHTMLGenerator.generateHTML(blocks);
      onContentChange(fullHTML);
      setCurrentEmailHTML(fullHTML);
    };

    generateHTML();
  }, [blocks, onContentChange]);

  return { currentEmailHTML };
};
