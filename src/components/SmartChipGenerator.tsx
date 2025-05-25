
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Mail, 
  MessageSquare, 
  Bell, 
  FileText,
  Sparkles,
  RefreshCw
} from 'lucide-react';

interface Chip {
  id: string;
  label: string;
  type: 'starter' | 'contextual';
  campaignType?: 'sms' | 'push' | 'marketing-email' | 'html-email';
  icon?: React.ReactNode;
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
  const getChipIcon = (campaignType?: string) => {
    switch (campaignType) {
      case 'sms': return <MessageSquare className="w-3 h-3" />;
      case 'push': return <Bell className="w-3 h-3" />;
      case 'marketing-email': return <Mail className="w-3 h-3" />;
      case 'html-email': return <FileText className="w-3 h-3" />;
      default: return <Sparkles className="w-3 h-3" />;
    }
  };

  const getChipStyle = (campaignType?: string) => {
    switch (campaignType) {
      case 'sms': return 'border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300';
      case 'push': return 'border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300';
      case 'marketing-email': return 'border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300';
      case 'html-email': return 'border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300';
      default: return 'border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300';
    }
  };

  const starterChips = chips.filter(chip => chip.type === 'starter');
  const contextualChips = chips.filter(chip => chip.type === 'contextual');

  return (
    <div className="space-y-4">
      {/* Starter Chips */}
      {starterChips.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-700">Campaign Types</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {starterChips.map((chip) => (
              <Button
                key={chip.id}
                variant="outline"
                size="sm"
                onClick={() => onChipSelect(chip)}
                className={`${getChipStyle(chip.campaignType)} transition-all`}
                disabled={isLoading}
              >
                {chip.icon || getChipIcon(chip.campaignType)}
                <span className="ml-2">{chip.label}</span>
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
                className={`${getChipStyle(chip.campaignType)} transition-all`}
                disabled={isLoading}
              >
                {chip.icon || getChipIcon(chip.campaignType)}
                <span className="ml-2">{chip.label}</span>
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

// Updated starter chips function
export const getStarterChips = (): Chip[] => [
  {
    id: 'sms',
    label: 'SMS Campaign',
    type: 'starter',
    campaignType: 'sms',
    icon: <MessageSquare className="w-3 h-3" />
  },
  {
    id: 'push',
    label: 'Push Notification',
    type: 'starter',
    campaignType: 'push',
    icon: <Bell className="w-3 h-3" />
  },
  {
    id: 'marketing-email',
    label: 'Marketing Email',
    type: 'starter',
    campaignType: 'marketing-email',
    icon: <Mail className="w-3 h-3" />
  },
  {
    id: 'html-email',
    label: 'HTML Email',
    type: 'starter',
    campaignType: 'html-email',
    icon: <FileText className="w-3 h-3" />
  }
];
