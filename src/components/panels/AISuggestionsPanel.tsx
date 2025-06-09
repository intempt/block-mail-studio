
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { InlineNotificationContainer } from '@/components/ui/inline-notification';
import { 
  BarChart3, 
  CheckCircle, 
  AlertTriangle, 
  Zap, 
  RefreshCw,
  Shield,
  Lightbulb,
  FileCheck,
  Eye,
  Layout,
  User,
  Brain,
  Type,
  Target,
  Smartphone
} from 'lucide-react';
import { CriticalSuggestion } from '@/services/criticalEmailAnalysisService';
import { CompleteAnalysisResult } from '@/services/CentralizedAIAnalysisService';
import { useInlineNotifications } from '@/hooks/useInlineNotifications';

interface AISuggestionsPanelProps {
  isAnalyzing: boolean;
  allSuggestions: CriticalSuggestion[];
  appliedFixes: Set<string>;
  analysisTimestamp: number;
  onRunAnalysis: () => Promise<void>;
  onApplyFix: (suggestion: CriticalSuggestion) => Promise<void>;
  onApplyAllAutoFixes: () => Promise<void>;
  emailHTML: string;
}

export const AISuggestionsPanel: React.FC<AISuggestionsPanelProps> = ({
  isAnalyzing,
  allSuggestions,
  appliedFixes,
  analysisTimestamp,
  onRunAnalysis,
  onApplyFix,
  onApplyAllAutoFixes,
  emailHTML
}) => {
  const { notifications, removeNotification } = useInlineNotifications();

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'high': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'medium': return <CheckCircle className="w-4 h-4 text-yellow-500" />;
      case 'low': return <CheckCircle className="w-4 h-4 text-blue-500" />;
      default: return <Lightbulb className="w-4 h-4 text-gray-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
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
      case 'content': return <Type className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  const hasAnalysisResults = allSuggestions.length > 0;
  const autoFixableCount = allSuggestions.filter(s => s.autoFixable && !appliedFixes.has(s.id)).length;
  const totalSuggestionsCount = allSuggestions.length;

  return (
    <div className="h-full flex flex-col bg-gray-50 border-l border-gray-200">
      {/* Inline Notifications */}
      {notifications.length > 0 && (
        <div className="p-3 border-b border-gray-200 bg-white">
          <InlineNotificationContainer
            notifications={notifications}
            onRemove={removeNotification}
            maxNotifications={2}
          />
        </div>
      )}

      {/* Header */}
      <div className="p-3 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-900">AI Suggestions</span>
            
            {/* Quick Stats Badges */}
            {totalSuggestionsCount > 0 && (
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                {totalSuggestionsCount} issues
              </Badge>
            )}
            
            {autoFixableCount > 0 && (
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                {autoFixableCount} auto-fixable
              </Badge>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          {!hasAnalysisResults ? (
            <Button 
              onClick={onRunAnalysis} 
              disabled={isAnalyzing || !emailHTML.trim()}
              size="sm"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-3 h-3 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="w-3 h-3 mr-2" />
                  Analyze & Fix Email
                </>
              )}
            </Button>
          ) : (
            <>
              <Button 
                onClick={onRunAnalysis} 
                disabled={isAnalyzing}
                variant="outline"
                size="sm"
                className="w-full border-gray-300 hover:bg-gray-50"
              >
                <RefreshCw className="w-3 h-3 mr-2" />
                Re-analyze
              </Button>
              {autoFixableCount > 0 && (
                <Button 
                  onClick={onApplyAllAutoFixes}
                  size="sm"
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <Zap className="w-3 h-3 mr-2" />
                  Apply All Auto-Fixes ({autoFixableCount})
                </Button>
              )}
            </>
          )}
        </div>

        {/* Status */}
        {isAnalyzing && (
          <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200 mt-2">
            <RefreshCw className="w-2 h-2 mr-1 animate-spin" />
            Analyzing...
          </Badge>
        )}
        
        {analysisTimestamp > 0 && !isAnalyzing && (
          <span className="text-xs text-gray-500 mt-2 block">
            Updated {new Date(analysisTimestamp).toLocaleTimeString()}
          </span>
        )}
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-3">
          {/* Show message when no analysis has been run */}
          {!hasAnalysisResults && !isAnalyzing && (
            <div className="text-center py-8 bg-white rounded-lg border-2 border-dashed border-gray-200">
              <Brain className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">AI Analysis Ready</h3>
              <p className="text-gray-600 mb-4 text-sm">
                Get intelligent suggestions to improve your email's performance, deliverability, and engagement.
              </p>
              <div className="flex flex-col gap-2 text-sm text-gray-500">
                <div className="flex items-center justify-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Spam Detection
                </div>
                <div className="flex items-center justify-center gap-1">
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                  Mobile Optimization
                </div>
                <div className="flex items-center justify-center gap-1">
                  <CheckCircle className="w-4 h-4 text-purple-500" />
                  Auto-Fixes
                </div>
              </div>
            </div>
          )}

          {/* AI Suggestions & Auto-Fixes */}
          {allSuggestions.length > 0 && (
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Suggestions & Auto-Fixes</h3>
                <div className="flex flex-col gap-1">
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">
                    {allSuggestions.filter(s => s.severity === 'critical').length} critical
                  </Badge>
                  <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 text-xs">
                    {allSuggestions.filter(s => s.severity === 'high').length} high
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                {allSuggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className={`p-4 rounded-lg border ${
                      appliedFixes.has(suggestion.id)
                        ? 'bg-green-50 border-green-200'
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(suggestion.category)}
                        <span className="font-medium text-gray-900 text-sm">{suggestion.title}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {getSeverityIcon(suggestion.severity)}
                        <span className="text-xs text-gray-500">{suggestion.confidence}%</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-2">
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          suggestion.severity === 'critical'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : suggestion.severity === 'high'
                            ? 'bg-orange-50 text-orange-700 border-orange-200'
                            : suggestion.severity === 'medium'
                            ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                      >
                        {suggestion.severity}
                      </Badge>
                      {suggestion.autoFixable && (
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                          Auto-fixable
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 mb-3">{suggestion.reason}</p>

                    {suggestion.businessImpact && (
                      <p className="text-sm text-blue-600 mb-3 italic">💼 {suggestion.businessImpact}</p>
                    )}

                    {suggestion.current && suggestion.suggested && (
                      <div className="space-y-2 mb-3">
                        <div className="text-xs">
                          <span className="text-gray-500">Current:</span>
                          <div className="bg-red-50 p-2 rounded text-red-700 mt-1 text-sm font-mono">
                            {suggestion.current}
                          </div>
                        </div>
                        <div className="text-xs">
                          <span className="text-gray-500">Suggested:</span>
                          <div className="bg-green-50 p-2 rounded text-green-700 mt-1 text-sm font-mono">
                            {suggestion.suggested}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      {suggestion.autoFixable ? (
                        <Button
                          size="sm"
                          onClick={() => onApplyFix(suggestion)}
                          disabled={appliedFixes.has(suggestion.id)}
                          className={
                            appliedFixes.has(suggestion.id)
                              ? 'bg-green-600 hover:bg-green-700'
                              : 'bg-blue-600 hover:bg-blue-700'
                          }
                        >
                          {appliedFixes.has(suggestion.id) ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-2" />
                              Applied
                            </>
                          ) : (
                            <>
                              <Zap className="w-3 h-3 mr-2" />
                              Auto-Fix
                            </>
                          )}
                        </Button>
                      ) : (
                        <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-200">
                          Manual review required
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
