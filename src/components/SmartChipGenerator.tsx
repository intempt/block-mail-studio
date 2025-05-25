
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Sparkles,
  RefreshCw
} from 'lucide-react';

interface Chip {
  id: string;
  label: string;
  type: 'starter' | 'contextual';
}

interface SmartChipGeneratorProps {
  chips: Chip[];
  onChipSelect: (chip: Chip) => void;
  onRefreshChips?: () => void;
  isLoading?: boolean;
}

export const SmartChipGenerator: React.FC<SmartChipGeneratorProps> = ({
  chips,
  onChipSelect,
  onRefreshChips,
  isLoading = false
}) => {
  const starterChips = chips.filter(chip => chip.type === 'starter');
  const contextualChips = chips.filter(chip => chip.type === 'contextual');

  return (
    <div className="space-y-4">
      {/* Starter Chips */}
      {starterChips.length > 0 && (
        <div>
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
                <Sparkles className="w-3 h-3 mr-2" />
                <span>{chip.label}</span>
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
                <span>{chip.label}</span>
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

// Natural conversational starter chips
export const getStarterChips = (): Chip[] => [
  {
    id: 'email-customers',
    label: 'Email my customers',
    type: 'starter'
  },
  {
    id: 'send-sms',
    label: 'Send SMS updates',
    type: 'starter'
  },
  {
    id: 'app-notifications',
    label: 'App notifications',
    type: 'starter'
  },
  {
    id: 'rich-email',
    label: 'Rich email design',
    type: 'starter'
  }
];
