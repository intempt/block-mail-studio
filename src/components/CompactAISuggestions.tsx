import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Lightbulb, 
  CheckCircle,
  Copy,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Target,
  Zap,
  Brain,
  Type,
  Shield,
  Smartphone,
  FileCheck,
  Eye,
  Layout,
  User,
  AlertTriangle,
  Sparkles,
  XCircle,
  Maximize2
} from 'lucide-react';
import { CriticalEmailAnalysisService, CriticalSuggestion } from '@/services/criticalEmailAnalysisService';
import { AISuggestionsDrawer } from './AISuggestionsDrawer';
import { 
  suggestionVariants, 
  chipContainerVariants, 
  chipVariants, 
  buttonVariants, 
  statusVariants,
  loadingVariants 
} from '@/utils/motionVariants';

interface CompactAISuggestionsProps {
  emailHTML?: string;
  subjectLine?: string;
  isLoading?: boolean;
  onApplySuggestion?: (suggestion: CriticalSuggestion) => void;
  onRefresh?: () => void;
}

export const CompactAISuggestions: React.FC<CompactAISuggestionsProps> = ({
  emailHTML = '',
  subjectLine = '',
  isLoading = false,
  onApplySuggestion,
  onRefresh
}) => {
  const [suggestions, setSuggestions] = useState<CriticalSuggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredSuggestion, setHoveredSuggestion] = useState<string | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastGeneratedCount, setLastGeneratedCount] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const analyzeCriticalIssues = async () => {
    if (!emailHTML.trim()) {
      setSuggestions([]);
      setError(null);
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    try {
      const criticalSuggestions = await CriticalEmailAnalysisService.analyzeCriticalIssues(emailHTML, subjectLine);
      setSuggestions(criticalSuggestions);
      setHasGenerated(true);
      setLastGeneratedCount(criticalSuggestions.length);
    } catch (error) {
      console.error('Critical analysis failed:', error);
      setError('Failed to analyze email. Please check your API key and try again.');
      setSuggestions([]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateSuggestions = () => {
    CriticalEmailAnalysisService.clearCache();
    onRefresh?.();
    analyzeCriticalIssues();
  };

  const handleRefresh = () => {
    CriticalEmailAnalysisService.clearCache();
    onRefresh?.();
    analyzeCriticalIssues();
  };

  const getTypeIcon = (category: string) => {
    switch (category) {
      case 'subject': return <Target className="w-3 h-3" />;
      case 'deliverability': return <Shield className="w-3 h-3" />;
      case 'cta': return <Zap className="w-3 h-3" />;
      case 'mobile': return <Smartphone className="w-3 h-3" />;
      case 'compliance': return <FileCheck className="w-3 h-3" />;
      case 'accessibility': return <Eye className="w-3 h-3" />;
      case 'structure': return <Layout className="w-3 h-3" />;
      case 'personalization': return <User className="w-3 h-3" />;
      case 'tone': return <Brain className="w-3 h-3" />;
      default: return <Lightbulb className="w-3 h-3" />;
    }
  };

  const criticalSuggestions = suggestions.filter(s => s.severity === 'critical' && !s.applied);
  const highSuggestions = suggestions.filter(s => s.severity === 'high' && !s.applied);
  const appliedCount = suggestions.filter(s => s.applied).length;

  const applyAllCritical = () => {
    criticalSuggestions.forEach(suggestion => {
      onApplySuggestion?.(suggestion);
      setSuggestions(prev => prev.map(s => 
        s.id === suggestion.id ? { ...s, applied: true } : s
      ));
    });
  };

  const applyAllHigh = () => {
    highSuggestions.forEach(suggestion => {
      onApplySuggestion?.(suggestion);
      setSuggestions(prev => prev.map(s => 
        s.id === suggestion.id ? { ...s, applied: true } : s
      ));
    });
  };

  const handleApplySuggestion = (suggestion: CriticalSuggestion) => {
    onApplySuggestion?.(suggestion);
    setSuggestions(prev => prev.map(s => 
      s.id === suggestion.id ? { ...s, applied: true } : s
    ));
  };

  const handleDrawerApplySuggestion = (suggestion: CriticalSuggestion) => {
    handleApplySuggestion(suggestion);
  };

  // Show loading state
  if (isAnalyzing || isLoading) {
    return (
      <motion.div 
        className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200 px-6 py-4"
        variants={suggestionVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center gap-3">
          <motion.div variants={loadingVariants} animate="animate">
            <RefreshCw className="w-5 h-5 animate-spin text-purple-600" />
          </motion.div>
          <div className="flex-1">
            <span className="text-sm text-gray-600 font-medium">AI analyzing email for critical issues...</span>
            <div className="text-xs text-gray-500 mt-1">Usually takes 5-10 seconds</div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Show error state
  if (error) {
    return (
      <motion.div 
        className="bg-gradient-to-r from-red-50 to-orange-50 border-b border-gray-200 px-6 py-4"
        variants={suggestionVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={statusVariants}
          animate="error"
        >
          <Alert className="border-red-200 bg-red-50">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              {error}
              <motion.div className="inline-block ml-3" variants={buttonVariants} whileHover="hover" whileTap="tap">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRefresh}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Retry
                </Button>
              </motion.div>
            </AlertDescription>
          </Alert>
        </motion.div>
      </motion.div>
    );
  }

  // Show generate button when no suggestions exist
  if (suggestions.length === 0 && !hasGenerated) {
    return (
      <motion.div 
        className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200 px-6 py-4"
        variants={suggestionVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
            >
              <Sparkles className="w-5 h-5 text-purple-600" />
            </motion.div>
            <span className="text-sm font-medium text-gray-800">Get AI-powered email optimization suggestions</span>
          </div>
          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
            <Button 
              onClick={handleGenerateSuggestions}
              disabled={!emailHTML.trim()}
              className="bg-purple-600 hover:bg-purple-700 text-white"
              size="sm"
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              Generate AI Suggestions
            </Button>
          </motion.div>
          {!emailHTML.trim() && (
            <motion.span 
              className="text-xs text-gray-500 italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Add content to your email to get suggestions
            </motion.span>
          )}
        </div>
      </motion.div>
    );
  }

  // Show success state after generation if no issues found
  if (suggestions.length === 0 && hasGenerated) {
    return (
      <motion.div 
        className="bg-gradient-to-r from-green-50 to-blue-50 border-b border-gray-200 px-6 py-4"
        variants={suggestionVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              variants={statusVariants}
              animate="success"
            >
              <CheckCircle className="w-5 h-5 text-green-600" />
            </motion.div>
            <div>
              <span className="text-sm font-medium text-green-800">Great! No critical issues found in your email</span>
              <div className="text-xs text-green-600 mt-1">Analysis completed successfully</div>
            </div>
          </div>
          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Re-analyze
            </Button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // Show suggestions with controls
  return (
    <>
      <motion.div 
        className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200"
        variants={suggestionVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="px-6 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {criticalSuggestions.length > 0 && (
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  </motion.div>
                )}
                <Lightbulb className="w-4 h-4 text-purple-600" />
                <div>
                  <span className="text-sm font-medium">Critical Email Issues Found</span>
                  {lastGeneratedCount > 0 && (
                    <div className="text-xs text-gray-500">
                      Found {lastGeneratedCount} optimization{lastGeneratedCount !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={isAnalyzing}
                    className="h-6 px-2 text-xs text-purple-600 hover:text-purple-700"
                  >
                    {isAnalyzing ? (
                      <RefreshCw className="w-3 h-3 animate-spin mr-1" />
                    ) : (
                      <RefreshCw className="w-3 h-3 mr-1" />
                    )}
                    Refresh Analysis
                  </Button>
                </motion.div>
                {suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center gap-2"
                  >
                    <Badge variant="outline" className="text-xs">
                      {suggestions.length - appliedCount} issues
                    </Badge>
                    {criticalSuggestions.length > 0 && (
                      <Badge className="text-xs bg-red-100 text-red-700">
                        {criticalSuggestions.length} critical
                      </Badge>
                    )}
                    {appliedCount > 0 && (
                      <Badge className="text-xs bg-green-100 text-green-700">
                        {appliedCount} fixed
                      </Badge>
                    )}
                  </motion.div>
                )}
              </div>

              {criticalSuggestions.length > 0 && (
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                  <Button
                    onClick={applyAllCritical}
                    size="sm"
                    className="h-6 px-3 text-xs bg-red-600 hover:bg-red-700"
                  >
                    Fix All Critical ({criticalSuggestions.length})
                  </Button>
                </motion.div>
              )}

              {highSuggestions.length > 0 && (
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                  <Button
                    onClick={applyAllHigh}
                    size="sm"
                    className="h-6 px-3 text-xs bg-orange-600 hover:bg-orange-700"
                  >
                    Fix All High ({highSuggestions.length})
                  </Button>
                </motion.div>
              )}
            </div>

            {/* View All Button */}
            {suggestions.length > 0 && (
              <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                <Button
                  onClick={() => setIsDrawerOpen(true)}
                  variant="outline"
                  size="sm"
                  className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                >
                  <Maximize2 className="w-4 h-4 mr-1" />
                  View All
                </Button>
              </motion.div>
            )}
          </div>

          <ScrollArea className="w-full">
            <motion.div 
              className="flex gap-2 pb-1"
              variants={chipContainerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence>
                {suggestions.slice(0, isExpanded ? suggestions.length : 6).map((suggestion) => (
                  <motion.div
                    key={suggestion.id}
                    variants={chipVariants}
                    layout
                  >
                    <SuggestionChip 
                      suggestion={suggestion} 
                      onApply={handleApplySuggestion}
                      hoveredSuggestion={hoveredSuggestion}
                      setHoveredSuggestion={setHoveredSuggestion}
                      getTypeIcon={getTypeIcon}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
              {suggestions.length > 6 && (
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  layout
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="h-7 px-2 text-xs whitespace-nowrap"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="w-3 h-3 mr-1" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3 h-3 mr-1" />
                        +{suggestions.length - 6} more
                      </>
                    )}
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </ScrollArea>
        </div>
      </motion.div>

      {/* AI Suggestions Drawer */}
      <AISuggestionsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        suggestions={suggestions}
        onApplySuggestion={handleDrawerApplySuggestion}
        onRefresh={handleRefresh}
      />
    </>
  );
};

const SuggestionChip: React.FC<{
  suggestion: CriticalSuggestion;
  onApply: (suggestion: CriticalSuggestion) => void;
  hoveredSuggestion: string | null;
  setHoveredSuggestion: (id: string | null) => void;
  getTypeIcon: (category: string) => React.ReactNode;
}> = ({ suggestion, onApply, hoveredSuggestion, setHoveredSuggestion, getTypeIcon }) => {
  const getSeverityColor = () => CriticalEmailAnalysisService.getSeverityColor(suggestion.severity);

  return (
    <motion.div
      className={`relative flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
        suggestion.applied 
          ? 'bg-green-50 border-green-200 opacity-75' 
          : `bg-white border-gray-200 hover:shadow-sm ${getSeverityColor()}`
      }`}
      onMouseEnter={() => setHoveredSuggestion(suggestion.id)}
      onMouseLeave={() => setHoveredSuggestion(null)}
      whileHover={{ scale: 1.02, y: -1 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      layout
    >
      <div className="flex items-center gap-1.5 min-w-0">
        {getTypeIcon(suggestion.category)}
        <span className="text-xs font-medium truncate max-w-32">
          {suggestion.title}
        </span>
        <Badge variant="outline" className="text-xs px-1 py-0">
          {suggestion.severity}
        </Badge>
        <span className="text-xs text-gray-500">
          {suggestion.confidence}%
        </span>
      </div>

      <div className="flex items-center gap-1">
        {!suggestion.applied ? (
          <>
            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigator.clipboard.writeText(suggestion.suggested)}
                className="h-4 w-4 p-0 hover:bg-gray-200"
              >
                <Copy className="w-2.5 h-2.5" />
              </Button>
            </motion.div>
            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
              <Button
                onClick={() => onApply(suggestion)}
                size="sm"
                className={`h-5 px-2 text-xs ${
                  suggestion.severity === 'critical' ? 'bg-red-600 hover:bg-red-700' :
                  suggestion.severity === 'high' ? 'bg-orange-600 hover:bg-orange-700' :
                  'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                {suggestion.autoFixable ? 'Auto-Fix' : 'Apply'}
              </Button>
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <CheckCircle className="w-4 h-4 text-green-600" />
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {hoveredSuggestion === suggestion.id && !suggestion.applied && (
          <motion.div 
            className="absolute top-full left-0 mt-1 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-80 max-w-96"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <div className="space-y-2">
              <div className="text-xs">
                <span className="font-medium text-gray-700">Issue:</span>
                <div className="bg-gray-50 p-2 rounded mt-1 text-gray-600 font-mono text-xs">
                  {suggestion.current}
                </div>
              </div>
              <div className="text-xs">
                <span className="font-medium text-blue-700">Suggested Fix:</span>
                <div className="bg-blue-50 p-2 rounded mt-1 text-blue-700 font-mono text-xs">
                  {suggestion.suggested}
                </div>
              </div>
              <div className="text-xs text-gray-600 italic">
                💡 {suggestion.reason}
              </div>
              <div className="text-xs text-green-600 font-medium">
                📈 {suggestion.businessImpact}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
