
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

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => (
        <Button
          key={chip.id}
          variant="outline"
          size="sm"
          onClick={() => onChipSelect(chip)}
          disabled={isLoading}
          className="h-auto py-2 px-3 text-left whitespace-normal bg-white hover:bg-blue-50 border-gray-200 hover:border-blue-300 text-gray-700 hover:text-blue-700 transition-colors max-w-xs"
        >
          <span className="text-sm leading-relaxed break-words">
            {chip.label}
          </span>
        </Button>
      ))}
    </div>
  );
};
