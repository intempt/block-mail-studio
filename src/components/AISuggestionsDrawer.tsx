import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { panelVariants, chipContainerVariants, chipVariants, buttonVariants, statusVariants } from '@/utils/motionVariants';

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
        <motion.div
          variants={panelVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
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
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                  <Button variant="outline" size="sm" onClick={onRefresh}>
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Refresh
                  </Button>
                </motion.div>
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                  <Button variant="ghost" size="sm" onClick={onClose}>
                    <X className="w-4 h-4" />
                  </Button>
                </motion.div>
              </div>
            </div>

            {/* Simple Stats */}
            <motion.div 
              className="flex items-center gap-4 pt-3"
              variants={chipContainerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={chipVariants}>
                <Badge variant="outline" className="text-sm">
                  {suggestions.length} Total
                </Badge>
              </motion.div>
              {appliedCount > 0 && (
                <motion.div variants={chipVariants}>
                  <Badge className="bg-green-100 text-green-700">
                    {appliedCount} Applied
                  </Badge>
                </motion.div>
              )}
              {criticalCount > 0 && (
                <motion.div variants={chipVariants}>
                  <Badge className="bg-red-100 text-red-700">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    {criticalCount} Critical
                  </Badge>
                </motion.div>
              )}
            </motion.div>
          </DrawerHeader>

          <ScrollArea className="flex-1 px-6 pb-6">
            <motion.div 
              className="space-y-3"
              variants={chipContainerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence>
                {suggestions.map((suggestion, index) => (
                  <motion.div
                    key={suggestion.id}
                    variants={chipVariants}
                    layout
                    custom={index}
                  >
                    <SuggestionCard
                      suggestion={suggestion}
                      onApply={() => onApplySuggestion(suggestion)}
                      getTypeIcon={getTypeIcon}
                      getSeverityColor={getSeverityColor}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
              {suggestions.length === 0 && (
                <motion.div 
                  className="text-center py-12 text-gray-500"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Lightbulb className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-lg font-medium">No suggestions available</p>
                  <p className="text-sm">Add content to your email to get AI suggestions</p>
                </motion.div>
              )}
            </motion.div>
          </ScrollArea>
        </motion.div>
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
    <motion.div 
      className={`border rounded-lg p-4 transition-all ${
        suggestion.applied 
          ? 'bg-green-50 border-green-200 opacity-75' 
          : 'bg-white hover:shadow-md'
      }`}
      whileHover={{ 
        scale: 1.01,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
      layout
    >
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
              <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </motion.div>
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
            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
              <Button size="sm" onClick={onApply} className={
                suggestion.severity === 'critical' ? 'bg-red-600 hover:bg-red-700' :
                suggestion.severity === 'high' ? 'bg-orange-600 hover:bg-orange-700' :
                'bg-purple-600 hover:bg-purple-700'
              }>
                {suggestion.autoFixable ? 'Auto-Fix' : 'Apply'}
              </Button>
            </motion.div>
          ) : (
            <motion.div 
              className="flex items-center gap-1 text-green-600"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Applied</span>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
