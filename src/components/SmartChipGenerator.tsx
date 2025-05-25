
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
  return (
    <div className="space-y-4">
      {/* All chips in one simple grid */}
      {chips.length > 0 && (
        <div>
          {onRefreshChips && chips.some(chip => chip.type === 'contextual') && (
            <div className="flex justify-end mb-3">
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
                    ? 'border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                }`}
                disabled={isLoading}
              >
                {chip.type === 'starter' && <Sparkles className="w-3 h-3 mr-2" />}
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

// Natural conversational starter chips - more question-based and exploratory
export const getStarterChips = (): Chip[] => [
  {
    id: 'understand-customers',
    label: 'Who are my best customers and why?',
    type: 'starter'
  },
  {
    id: 'personalize-experience',
    label: 'What if I could personalize every interaction?',
    type: 'starter'
  },
  {
    id: 'automate-journey',
    label: 'How can I automate my customer experience?',
    type: 'starter'
  },
  {
    id: 'data-insights',
    label: 'What story is my data telling me?',
    type: 'starter'
  },
  {
    id: 'engagement-strategy',
    label: 'How do I keep customers coming back?',
    type: 'starter'
  }
];
