
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Sparkles } from 'lucide-react';

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
                  <Sparkles className="w-3 h-3 mr-1" />
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
                  More Ideas
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
                className={`transition-all ${
                  chip.type === 'starter' 
                    ? 'border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 bg-gradient-to-r from-blue-50 to-purple-50'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                }`}
                disabled={isLoading}
              >
                {chip.type === 'starter' && <Sparkles className="w-3 h-3 mr-2 text-blue-500" />}
                {chip.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {chips.length === 0 && !isLoading && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">Generating growth insights...</p>
        </div>
      )}

      {isLoading && (
        <div className="text-center py-4">
          <div className="flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
            <p className="text-sm text-gray-600">GrowthOS is thinking...</p>
          </div>
        </div>
      )}
    </div>
  );
};
