
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Link, Italic, Underline } from 'lucide-react';
import { StylesSectionCard } from './styles/StylesSectionCard';

interface LinksCardProps {
  isOpen: boolean;
  onToggle: () => void;
  onStylesChange: (styles: any) => void;
}

export const LinksCard: React.FC<LinksCardProps> = ({
  isOpen,
  onToggle,
  onStylesChange
}) => {
  const [linkStyles, setLinkStyles] = useState({
    color: '#4a90e2',
    style: 'Normal',
    italic: false,
    underline: false
  });

  const handleLinkStyleChange = (property: string, value: any) => {
    const newStyles = { ...linkStyles, [property]: value };
    setLinkStyles(newStyles);
    
    onStylesChange({
      links: {
        normal: newStyles.color,
        fontStyle: newStyles.italic ? 'italic' : 'normal',
        textDecoration: newStyles.underline ? 'underline' : 'none'
      }
    });
  };

  return (
    <StylesSectionCard
      title="Links"
      icon={<Link className="w-4 h-4" />}
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-3">
          {/* Color */}
          <div>
            <Label className="text-xs">Color</Label>
            <div className="flex gap-2 mt-1">
              <input
                type="color"
                value={linkStyles.color}
                onChange={(e) => handleLinkStyleChange('color', e.target.value)}
                className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
              />
              <Input
                value={linkStyles.color}
                onChange={(e) => handleLinkStyleChange('color', e.target.value)}
                className="flex-1 h-8 text-xs font-mono"
              />
            </div>
          </div>

          {/* Style */}
          <div>
            <Label className="text-xs">Style</Label>
            <Select value={linkStyles.style} onValueChange={(value) => handleLinkStyleChange('style', value)}>
              <SelectTrigger className="h-8 mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Normal">Normal</SelectItem>
                <SelectItem value="Bold">Bold</SelectItem>
                <SelectItem value="Light">Light</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Text Formatting */}
          <div>
            <Label className="text-xs">Format</Label>
            <div className="flex gap-1 mt-1">
              <Button
                variant={linkStyles.italic ? 'default' : 'outline'}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handleLinkStyleChange('italic', !linkStyles.italic)}
              >
                <Italic className="w-3 h-3" />
              </Button>
              <Button
                variant={linkStyles.underline ? 'default' : 'outline'}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handleLinkStyleChange('underline', !linkStyles.underline)}
              >
                <Underline className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-600 pt-2 border-t border-gray-200">
          Applied to all links
        </div>
      </div>
    </StylesSectionCard>
  );
};
