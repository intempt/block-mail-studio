
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  CheckCircle,
  Copy,
  AlertTriangle,
  Target,
  Zap,
  Shield,
  Smartphone,
  FileCheck,
  Eye,
  Layout,
  User,
  Brain,
  Lightbulb,
  MoreVertical,
  X,
  RefreshCw,
  BarChart3
} from 'lucide-react';
import { CriticalSuggestion, CriticalEmailAnalysisService } from '@/services/criticalEmailAnalysisService';

interface AISuggestionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  suggestions: CriticalSuggestion[];
  onApplySuggestion: (suggestion: CriticalSuggestion) => void;
  onRefresh: () => void;
}

export const AISuggestionsDrawer: React.FC<AISuggestionsDrawerProps> = ({
  isOpen,
  onClose,
  suggestions,
  onApplySuggestion,
  onRefresh
}) => {
  const getTypeIcon = (category: string) => {
    switch (category) {
      case 'subject': return <Target className="w-4 h-4" />;
      case 'deliverability': return <Shield className="w-4 h-4" />;
      case 'cta': return <Zap className="w-4 h-4" />;
      case 'mobile': return <Smartphone className="w-4 h-4" />;
      case 'compliance': return <FileCheck className="w-4 h-4" />;
      case 'accessibility': return <Eye className="w-4 h-4" />;
      case 'structure': return <Layout className="w-4 h-4" />;
      case 'personalization': return <User className="w-4 h-4" />;
      case 'tone': return <Brain className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: string) => CriticalEmailAnalysisService.getSeverityColor(severity);

  const appliedCount = suggestions.filter(s => s.applied).length;
  const criticalCount = suggestions.filter(s => s.severity === 'critical' && !s.applied).length;

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="h-[70vh] max-h-[600px]">
        <DrawerHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DrawerTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                AI Email Suggestions
              </DrawerTitle>
              <DrawerDescription>
                Review and apply optimization suggestions for your email
              </DrawerDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onRefresh}>
                <RefreshCw className="w-4 h-4 mr-1" />
                Refresh
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Simple Stats */}
          <div className="flex items-center gap-4 pt-3">
            <Badge variant="outline" className="text-sm">
              {suggestions.length} Total
            </Badge>
            {appliedCount > 0 && (
              <Badge className="bg-green-100 text-green-700">
                {appliedCount} Applied
              </Badge>
            )}
            {criticalCount > 0 && (
              <Badge className="bg-red-100 text-red-700">
                <AlertTriangle className="w-3 h-3 mr-1" />
                {criticalCount} Critical
              </Badge>
            )}
          </div>
        </DrawerHeader>

        <ScrollArea className="flex-1 px-6 pb-6">
          <div className="space-y-3">
            {suggestions.map((suggestion) => (
              <SuggestionCard
                key={suggestion.id}
                suggestion={suggestion}
                onApply={() => onApplySuggestion(suggestion)}
                getTypeIcon={getTypeIcon}
                getSeverityColor={getSeverityColor}
              />
            ))}
            {suggestions.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Lightbulb className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-lg font-medium">No suggestions available</p>
                <p className="text-sm">Add content to your email to get AI suggestions</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};

interface SuggestionCardProps {
  suggestion: CriticalSuggestion;
  onApply: () => void;
  getTypeIcon: (category: string) => React.ReactNode;
  getSeverityColor: (severity: string) => string;
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({
  suggestion,
  onApply,
  getTypeIcon,
  getSeverityColor
}) => {
  return (
    <div className={`border rounded-lg p-4 transition-all ${
      suggestion.applied 
        ? 'bg-green-50 border-green-200 opacity-75' 
        : 'bg-white hover:shadow-md'
    }`}>
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getTypeIcon(suggestion.category)}
            <h4 className="font-medium">{suggestion.title}</h4>
            <Badge variant="outline" className={`text-xs ${getSeverityColor(suggestion.severity)}`}>
              {suggestion.severity}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {suggestion.confidence}%
            </Badge>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(suggestion.suggested)}>
                <Copy className="w-4 h-4 mr-2" />
                Copy Fix
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium text-gray-700">Current:</span>
            <div className="bg-gray-50 p-2 rounded mt-1 font-mono text-xs">
              {suggestion.current}
            </div>
          </div>
          
          <div>
            <span className="font-medium text-blue-700">Suggested:</span>
            <div className="bg-blue-50 p-2 rounded mt-1 font-mono text-xs">
              {suggestion.suggested}
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          <p className="italic">💡 {suggestion.reason}</p>
          <p className="text-green-600 font-medium mt-1">📈 {suggestion.businessImpact}</p>
        </div>

        <div className="flex items-center justify-between pt-2">
          <Badge variant="outline" className="text-xs capitalize">
            {suggestion.category}
          </Badge>
          
          {!suggestion.applied ? (
            <Button size="sm" onClick={onApply} className={
              suggestion.severity === 'critical' ? 'bg-red-600 hover:bg-red-700' :
              suggestion.severity === 'high' ? 'bg-orange-600 hover:bg-orange-700' :
              'bg-purple-600 hover:bg-purple-700'
            }>
              {suggestion.autoFixable ? 'Auto-Fix' : 'Apply'}
            </Button>
          ) : (
            <div className="flex items-center gap-1 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Applied</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
