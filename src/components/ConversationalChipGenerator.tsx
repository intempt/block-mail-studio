
import React from 'react';
import { Button } from '@/components/ui/button';

interface ConversationalChip {
  id: string;
  label: string;
  type: 'starter' | 'contextual';
  topic?: string;
}

interface ConversationalChipGeneratorProps {
  chips: ConversationalChip[];
  onChipSelect: (chip: ConversationalChip) => void;
  onRefreshChips: () => void;
  onResetToStarter: () => void;
  isLoading?: boolean;
  currentMode?: 'ask' | 'do';
}

export const ConversationalChipGenerator: React.FC<ConversationalChipGeneratorProps> = ({
  chips,
  onChipSelect,
  onRefreshChips,
  onResetToStarter,
  isLoading = false,
  currentMode = 'ask'
}) => {
  if (chips.length === 0) return null;

  // Filter chips based on current mode for contextual suggestions
  const getModeAwareLabel = (originalLabel: string) => {
    if (currentMode === 'do') {
      // Transform ask-style chips to do-style for do mode
      if (originalLabel.toLowerCase().includes('help me')) {
        return originalLabel.replace(/help me/i, 'Create');
      }
      if (originalLabel.toLowerCase().includes('show me')) {
        return originalLabel.replace(/show me/i, 'Build');
      }
      if (originalLabel.toLowerCase().includes('i want to')) {
        return originalLabel.replace(/i want to/i, 'Create');
      }
      if (originalLabel.toLowerCase().includes('i need')) {
        return originalLabel.replace(/i need/i, 'Build');
      }
    }
    return originalLabel;
  };

  return (
    <div className="flex flex-wrap gap-2">
      {chips.slice(0, 4).map((chip) => (
        <Button
          key={chip.id}
          variant="outline"
          size="sm"
          onClick={() => onChipSelect(chip)}
          disabled={isLoading}
          className="h-auto py-2 px-3 whitespace-normal bg-white hover:bg-blue-50 border-gray-200 hover:border-blue-300 text-gray-700 hover:text-blue-700 transition-colors max-w-xs text-left"
        >
          <span className="text-sm leading-relaxed break-words">
            {getModeAwareLabel(chip.label)}
          </span>
        </Button>
      ))}
    </div>
  );
};
