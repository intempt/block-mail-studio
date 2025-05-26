
import React from 'react';

interface MarkdownFormatterProps {
  content: string;
  className?: string;
}

export const MarkdownFormatter: React.FC<MarkdownFormatterProps> = ({ content, className = '' }) => {
  const formatText = (text: string): JSX.Element[] => {
    const parts: JSX.Element[] = [];
    let currentIndex = 0;
    let keyIndex = 0;

    // Split by bold markdown
    const boldRegex = /\*\*(.*?)\*\*/g;
    let match;

    while ((match = boldRegex.exec(text)) !== null) {
      // Add text before the bold part
      if (match.index > currentIndex) {
        const beforeText = text.slice(currentIndex, match.index);
        parts.push(<span key={keyIndex++}>{beforeText}</span>);
      }
      
      // Add the bold part
      parts.push(<strong key={keyIndex++} className="font-semibold">{match[1]}</strong>);
      currentIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (currentIndex < text.length) {
      parts.push(<span key={keyIndex++}>{text.slice(currentIndex)}</span>);
    }

    return parts;
  };

  const formatLines = (text: string): JSX.Element[] => {
    return text.split('\n').map((line, index) => {
      if (line.trim() === '') {
        return <br key={index} />;
      }
      
      // Handle bullet points
      if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
        return (
          <div key={index} className="flex items-start gap-2 mb-1 text-left">
            <span className="text-blue-500 mt-1">•</span>
            <span className="flex-1 text-left">{formatText(line.replace(/^[•-]\s*/, ''))}</span>
          </div>
        );
      }
      
      // Handle headings
      if (line.trim().startsWith('##')) {
        return (
          <h3 key={index} className="font-semibold text-lg mt-3 mb-2 text-gray-900 text-left">
            {formatText(line.replace(/^##\s*/, ''))}
          </h3>
        );
      }
      
      return (
        <div key={index} className="mb-1 text-left">
          {formatText(line)}
        </div>
      );
    });
  };

  return (
    <div className={`leading-relaxed text-left ${className}`}>
      {formatLines(content)}
    </div>
  );
};
