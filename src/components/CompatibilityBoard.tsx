
import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Mail, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw,
  Monitor,
  Smartphone,
  Globe
} from 'lucide-react';
import { EmailProviderCompatibility } from '@/services/EmailProviderCompatibility';

interface CompatibilityBoardProps {
  emailHTML: string;
  subjectLine: string;
  autoAnalyze?: boolean;
}

export const CompatibilityBoard: React.FC<CompatibilityBoardProps> = ({
  emailHTML,
  subjectLine,
  autoAnalyze = true
}) => {
  const [compatibility, setCompatibility] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  const runAnalysis = useCallback(async () => {
    if (!emailHTML.trim()) {
      setCompatibility(null);
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = EmailProviderCompatibility.analyzeCompatibility(emailHTML, subjectLine);
      setCompatibility(result);
    } catch (error) {
      console.error('Error analyzing compatibility:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [emailHTML, subjectLine]);

  useEffect(() => {
    if (!autoAnalyze) return;

    const timer = setTimeout(() => {
      if (emailHTML.trim()) {
        runAnalysis();
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [emailHTML, subjectLine, autoAnalyze, runAnalysis]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 75) return 'text-blue-600 bg-blue-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getProviderIcon = (providerName: string) => {
    const iconMap: { [key: string]: any } = {
      'Gmail': Mail,
      'Outlook': Monitor,
      'Apple Mail': Smartphone,
      'Yahoo Mail': Globe,
      'Thunderbird': Monitor
    };
    const IconComponent = iconMap[providerName] || Mail;
    return <IconComponent className="w-4 h-4" />;
  };

  if (isAnalyzing) {
    return (
      <Card className="p-4">
        <div className="text-center py-6">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
          <p className="text-sm text-gray-600">Analyzing email compatibility...</p>
        </div>
      </Card>
    );
  }

  if (!compatibility) {
    return (
      <Card className="p-4 text-center">
        <Mail className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600 mb-3">
          Add email content to see provider compatibility
        </p>
        <Button size="sm" onClick={runAnalysis} disabled={!emailHTML.trim()}>
          <RefreshCw className="w-3 h-3 mr-1" />
          Analyze Compatibility
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Overall Compatibility Score */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Email Provider Compatibility
          </h3>
          <Button size="sm" variant="outline" onClick={runAnalysis}>
            <RefreshCw className="w-3 h-3 mr-1" />
            Refresh
          </Button>
        </div>

        <div className="text-center p-4 bg-slate-50 rounded mb-4">
          <div className={`text-3xl font-bold ${getScoreColor(compatibility.overallCompatibility).split(' ')[0]}`}>
            {compatibility.overallCompatibility}%
          </div>
          <div className="text-sm text-gray-600">Overall Compatibility</div>
          <Progress value={compatibility.overallCompatibility} className="mt-2" />
        </div>

        {/* Provider Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {compatibility.providers.map((provider: any) => (
            <Card key={provider.name} className="p-3 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getProviderIcon(provider.name)}
                  <span className="font-medium text-sm">{provider.name}</span>
                </div>
                <Badge className={`text-xs ${getScoreColor(provider.score)}`}>
                  {provider.score}%
                </Badge>
              </div>

              <Progress value={provider.score} className="mb-2 h-1.5" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {provider.issues.length === 0 ? (
                    <CheckCircle className="w-3 h-3 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-3 h-3 text-yellow-500" />
                  )}
                  <span className="text-xs text-gray-600">
                    {provider.issues.length === 0 ? 'No issues' : `${provider.issues.length} issues`}
                  </span>
                </div>
                
                {provider.issues.length > 0 && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 text-xs"
                    onClick={() => setSelectedProvider(
                      selectedProvider === provider.name ? null : provider.name
                    )}
                  >
                    {selectedProvider === provider.name ? 'Hide' : 'Issues'}
                  </Button>
                )}
              </div>

              {/* Expanded Issues */}
              {selectedProvider === provider.name && provider.issues.length > 0 && (
                <div className="mt-3 pt-3 border-t space-y-2">
                  {provider.issues.map((issue: any, index: number) => (
                    <div key={index} className="text-xs bg-gray-50 p-2 rounded">
                      <div className="flex items-center gap-1 mb-1">
                        <Badge variant="outline" className={`text-xs ${
                          issue.severity === 'high' ? 'text-red-600' :
                          issue.severity === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                        }`}>
                          {issue.severity}
                        </Badge>
                        <span className="font-medium">{issue.type}</span>
                      </div>
                      <p className="text-gray-700 mb-1">{issue.description}</p>
                      <p className="text-blue-600">💡 {issue.recommendation}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Overall Recommendations */}
        {compatibility.recommendations.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
            <h6 className="text-sm font-medium text-blue-900 mb-2">
              Recommendations to improve compatibility:
            </h6>
            <ul className="text-xs text-blue-800 space-y-1">
              {compatibility.recommendations.map((rec: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>
    </div>
  );
};
