
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  RefreshCw,
  Key,
  Wifi,
  WifiOff
} from 'lucide-react';
import { DirectAIService } from '@/services/directAIService';
import { ApiKeyService } from '@/services/apiKeyService';

interface CanvasStatusProps {
  emailHTML: string;
  subjectLine: string;
}

export const CanvasStatus: React.FC<CanvasStatusProps> = ({
  emailHTML,
  subjectLine
}) => {
  const [metrics, setMetrics] = useState({
    overallScore: 0,
    deliverabilityScore: 0,
    engagementScore: 0,
    mobileScore: 0
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [apiKeyStatus, setApiKeyStatus] = useState<'checking' | 'valid' | 'invalid' | 'missing'>('checking');
  const [lastAnalysis, setLastAnalysis] = useState<number>(0);

  const checkApiKeyStatus = async () => {
    try {
      const status = await ApiKeyService.getKeyStatus();
      setApiKeyStatus(status);
    } catch (error) {
      setApiKeyStatus('missing');
    }
  };

  const refreshApiKey = () => {
    ApiKeyService.forceRefresh();
    DirectAIService.refreshApiKey();
    setApiKeyStatus('checking');
    checkApiKeyStatus();
  };

  const analyzePerformance = async () => {
    if (!emailHTML.trim() || apiKeyStatus !== 'valid') return;

    setIsAnalyzing(true);
    try {
      const result = await DirectAIService.analyzePerformance(emailHTML, subjectLine);
      
      if (result.success && result.data) {
        setMetrics({
          overallScore: result.data.overallScore || 0,
          deliverabilityScore: result.data.deliverabilityScore || 0,
          engagementScore: result.data.engagementScore || 0,
          mobileScore: result.data.mobileScore || 0
        });
        setLastAnalysis(Date.now());
      }
    } catch (error) {
      console.error('Performance analysis failed:', error);
      // Refresh API key on error in case it's a key issue
      refreshApiKey();
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Check API key status on mount
  useEffect(() => {
    checkApiKeyStatus();
  }, []);

  // Auto-analyze when content changes (with debounce)
  useEffect(() => {
    if (emailHTML.trim() && apiKeyStatus === 'valid') {
      const timer = setTimeout(() => {
        const timeSinceLastAnalysis = Date.now() - lastAnalysis;
        if (timeSinceLastAnalysis > 10000) { // Only analyze if 10+ seconds since last
          analyzePerformance();
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [emailHTML, subjectLine, apiKeyStatus, lastAnalysis]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (score >= 60) return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
    return <AlertTriangle className="w-4 h-4 text-red-600" />;
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-blue-500" />
          Performance Metrics
        </h3>
        
        <div className="flex items-center gap-2">
          {/* API Key Status */}
          <Badge 
            variant={apiKeyStatus === 'valid' ? 'default' : 'destructive'}
            className="h-5 text-xs flex items-center gap-1"
          >
            {apiKeyStatus === 'valid' ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            {apiKeyStatus === 'checking' ? 'Checking...' : 
             apiKeyStatus === 'valid' ? 'AI Ready' : 
             'API Key Issue'}
          </Badge>
          
          {apiKeyStatus !== 'valid' ? (
            <Button
              variant="outline"
              size="sm"
              onClick={refreshApiKey}
              className="h-6 text-xs text-orange-600 hover:text-orange-700"
            >
              <Key className="w-3 h-3 mr-1" />
              Refresh Key
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={analyzePerformance}
              disabled={isAnalyzing || !emailHTML.trim()}
              className="h-6 text-xs"
            >
              {isAnalyzing ? (
                <RefreshCw className="w-3 h-3 animate-spin mr-1" />
              ) : (
                <TrendingUp className="w-3 h-3 mr-1" />
              )}
              {isAnalyzing ? 'Analyzing...' : 'Analyze'}
            </Button>
          )}
        </div>
      </div>

      {apiKeyStatus !== 'valid' ? (
        <div className="text-center py-6">
          <div className="text-sm text-gray-600 mb-2">
            {apiKeyStatus === 'checking' ? 'Checking API key...' :
             apiKeyStatus === 'missing' ? 'OpenAI API key not configured' :
             'Invalid OpenAI API key'}
          </div>
          <p className="text-xs text-gray-500">
            Configure your OpenAI API key to enable AI metrics
          </p>
        </div>
      ) : !emailHTML.trim() ? (
        <div className="text-center py-6">
          <div className="text-sm text-gray-600 mb-2">No content to analyze</div>
          <p className="text-xs text-gray-500">Add content to see performance metrics</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Overall Score */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Overall Score</span>
            <div className="flex items-center gap-2">
              {getScoreIcon(metrics.overallScore)}
              <span className={`text-lg font-bold ${getScoreColor(metrics.overallScore)}`}>
                {metrics.overallScore}
              </span>
            </div>
          </div>
          
          {metrics.overallScore > 0 && (
            <Progress value={metrics.overallScore} className="h-2" />
          )}

          {/* Individual Metrics */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">Deliverability</span>
                <span className={getScoreColor(metrics.deliverabilityScore)}>
                  {metrics.deliverabilityScore}
                </span>
              </div>
              <Progress value={metrics.deliverabilityScore} className="h-1" />
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">Engagement</span>
                <span className={getScoreColor(metrics.engagementScore)}>
                  {metrics.engagementScore}
                </span>
              </div>
              <Progress value={metrics.engagementScore} className="h-1" />
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">Mobile Score</span>
                <span className={getScoreColor(metrics.mobileScore)}>
                  {metrics.mobileScore}
                </span>
              </div>
              <Progress value={metrics.mobileScore} className="h-1" />
            </div>
          </div>

          {isAnalyzing && (
            <div className="text-center py-2">
              <RefreshCw className="w-4 h-4 animate-spin mx-auto mb-1 text-blue-500" />
              <p className="text-xs text-gray-600">AI analyzing email performance...</p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
