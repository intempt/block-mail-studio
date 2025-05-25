
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
  const hasContextualChips = chips.some(chip => chip.type === 'contextual');

  return (
    <div className="space-y-4">
      {/* Simple chip grid without headers or separation */}
      {chips.length > 0 && (
        <div>
          {(onResetToStarter || onRefreshChips) && hasContextualChips && (
            <div className="flex justify-end gap-2 mb-3">
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
          )}
          <div className="flex flex-wrap gap-2">
            {chips.map((chip) => (
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
