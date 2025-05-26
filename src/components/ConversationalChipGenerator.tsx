
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, RotateCcw } from 'lucide-react';

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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Quick responses:</span>
          <Badge variant="outline" className="text-xs">
            {chips[0]?.type === 'starter' ? 'Getting Started' : 'Continue Chat'}
          </Badge>
          <Badge variant="outline" className={`text-xs ${
            currentMode === 'ask' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'
          }`}>
            {currentMode === 'ask' ? '💭 Ask Mode' : '⚡ Do Mode'}
          </Badge>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefreshChips}
            disabled={isLoading}
            className="h-8 px-2 text-gray-500 hover:text-gray-700"
          >
            <RefreshCw className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetToStarter}
            disabled={isLoading}
            className="h-8 px-2 text-gray-500 hover:text-gray-700"
          >
            <RotateCcw className="w-3 h-3" />
          </Button>
        </div>
      </div>

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
    </div>
  );
};
