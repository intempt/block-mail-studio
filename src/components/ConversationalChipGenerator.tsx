
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, RotateCcw } from 'lucide-react';

interface ConversationalChip {
  id: string;
  label: string;
  type: 'starter' | 'contextual';
}

interface ConversationalChipGeneratorProps {
  chips: ConversationalChip[];
  onChipSelect: (chip: ConversationalChip) => void;
  onRefreshChips?: () => void;
  onResetToStarter?: () => void;
  isLoading?: boolean;
}

export const ConversationalChipGenerator: React.FC<ConversationalChipGeneratorProps> = ({
  chips,
  onChipSelect,
  onRefreshChips,
  onResetToStarter,
  isLoading = false
}) => {
  const starterChips = chips.filter(chip => chip.type === 'starter');
  const contextualChips = chips.filter(chip => chip.type === 'contextual');

  return (
    <div className="space-y-4">
      {/* Starter Chips */}
      {starterChips.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-700">Message Types</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {starterChips.map((chip) => (
              <Button
                key={chip.id}
                variant="outline"
                size="sm"
                onClick={() => onChipSelect(chip)}
                className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all"
                disabled={isLoading}
              >
                {chip.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Contextual Chips */}
      {contextualChips.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-700">Next Steps</h4>
            <div className="flex gap-2">
              {onResetToStarter && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onResetToStarter}
                  disabled={isLoading}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Fresh Start
                </Button>
              )}
              {onRefreshChips && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRefreshChips}
                  disabled={isLoading}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  <RefreshCw className={`w-3 h-3 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {contextualChips.map((chip) => (
              <Button
                key={chip.id}
                variant="outline"
                size="sm"
                onClick={() => onChipSelect(chip)}
                className="border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
                disabled={isLoading}
              >
                {chip.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {chips.length === 0 && !isLoading && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">No suggestions available</p>
        </div>
      )}
    </div>
  );
};
