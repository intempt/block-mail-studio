
import React from 'react';
import { SocialBlock } from '@/types/emailBlocks';
import { Button } from '@/components/ui/button';
import { Plus, ExternalLink } from 'lucide-react';

interface MJMLSocialBlockRendererProps {
  block: SocialBlock;
  isSelected: boolean;
  onUpdate: (block: SocialBlock) => void;
}

export const MJMLSocialBlockRenderer: React.FC<MJMLSocialBlockRendererProps> = ({ 
  block, 
  isSelected, 
  onUpdate 
}) => {
  const styling = block.styling.desktop;

  const addPlatform = () => {
    const newPlatform = {
      name: 'New Platform',
      url: '#',
      icon: 'https://via.placeholder.com/32x32?text=+',
      iconStyle: 'color' as const,
      showLabel: false
    };
    
    onUpdate({
      ...block,
      content: {
        ...block.content,
        platforms: [...block.content.platforms, newPlatform]
      }
    });
  };

  return (
    <div
      className="mjml-social-block-renderer relative"
      style={{
        backgroundColor: styling.backgroundColor,
        padding: styling.padding,
        margin: styling.margin,
        textAlign: 'center',
      }}
    >
      {block.content.platforms.length === 0 ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <div className="text-gray-400 mb-4">
            <ExternalLink className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">Add Social Links</h3>
          <p className="text-gray-500 mb-4">Connect your social media platforms</p>
          <Button onClick={addPlatform} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Platform
          </Button>
        </div>
      ) : (
        <div 
          className={`
            flex justify-center items-center
            ${block.content.layout === 'vertical' ? 'flex-col space-y-3' : 'flex-row space-x-3 flex-wrap'}
          `}
          style={{ gap: block.content.spacing }}
        >
          {block.content.platforms.map((platform, index) => (
            <a
              key={index}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block transition-transform hover:scale-110"
              title={platform.name}
            >
              <img
                src={platform.icon || 'https://via.placeholder.com/32x32?text=S'}
                alt={platform.name}
                style={{ 
                  width: block.content.iconSize || '32px', 
                  height: block.content.iconSize || '32px',
                  borderRadius: '4px'
                }}
                className="transition-opacity hover:opacity-80"
              />
              {platform.showLabel && (
                <div className="text-xs mt-1 text-gray-600">{platform.name}</div>
              )}
            </a>
          ))}
          
          {isSelected && (
            <button
              onClick={addPlatform}
              className="inline-flex items-center justify-center w-8 h-8 border-2 border-dashed border-gray-300 rounded text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-colors"
              title="Add platform"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* MJML compliance indicator */}
      {isSelected && (
        <div className="absolute bottom-2 left-2">
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
            MJML Social
          </span>
        </div>
      )}
    </div>
  );
};
