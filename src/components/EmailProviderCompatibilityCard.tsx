
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Mail, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { EmailProviderCompatibility } from '@/services/EmailProviderCompatibility';
import { useState } from 'react';

interface EmailProviderCompatibilityCardProps {
  emailHTML: string;
  subjectLine: string;
}

export const EmailProviderCompatibilityCard: React.FC<EmailProviderCompatibilityCardProps> = ({
  emailHTML,
  subjectLine
}) => {
  const [expandedProvider, setExpandedProvider] = useState<string | null>(null);
  
  const compatibility = EmailProviderCompatibility.analyzeCompatibility(emailHTML, subjectLine);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-50 border-green-200';
      case 'good': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'poor': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getProviderIcon = (providerName: string) => {
    // Using Mail icon for all providers for simplicity
    return <Mail className="w-4 h-4" />;
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-gray-900 flex items-center gap-2">
          <Mail className="w-4 h-4" />
          Email Provider Compatibility
        </h4>
        <Badge variant="outline" className={`text-sm ${getStatusColor(compatibility.overallCompatibility >= 80 ? 'good' : 'warning')}`}>
          {compatibility.overallCompatibility}% Compatible
        </Badge>
      </div>

      <div className="space-y-3">
        {compatibility.providers.map((provider) => (
          <div key={provider.name} className="border rounded-lg p-3">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setExpandedProvider(
                expandedProvider === provider.name ? null : provider.name
              )}
            >
              <div className="flex items-center gap-3">
                {getProviderIcon(provider.name)}
                <span className="font-medium text-sm">{provider.name}</span>
                <Badge className={`text-xs ${getStatusColor(provider.status)}`}>
                  {provider.score}%
                </Badge>
                {provider.issues.length > 0 && (
                  <div className="flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-yellow-500" />
                    <span className="text-xs text-gray-600">{provider.issues.length} issues</span>
                  </div>
                )}
              </div>
              {expandedProvider === provider.name ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </div>

            <div className="mt-2">
              <Progress value={provider.score} className="h-2" />
            </div>

            {expandedProvider === provider.name && (
              <div className="mt-3 space-y-3">
                {/* Issues */}
                {provider.issues.length > 0 && (
                  <div>
                    <h6 className="text-xs font-medium text-gray-700 mb-2">Issues</h6>
                    <div className="space-y-2">
                      {provider.issues.map((issue, index) => (
                        <div key={index} className="text-xs bg-gray-50 p-2 rounded">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={`text-xs ${getSeverityColor(issue.severity)}`}>
                              {issue.severity}
                            </Badge>
                            <span className="font-medium">{issue.type}</span>
                          </div>
                          <p className="text-gray-700 mb-1">{issue.description}</p>
                          <p className="text-blue-600">💡 {issue.recommendation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Supported Features */}
                <div>
                  <h6 className="text-xs font-medium text-gray-700 mb-2">Supported Features</h6>
                  <div className="flex flex-wrap gap-1">
                    {provider.supportedFeatures.map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs text-green-700 bg-green-50">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Limitations */}
                {provider.limitations.length > 0 && (
                  <div>
                    <h6 className="text-xs font-medium text-gray-700 mb-2">Limitations</h6>
                    <div className="flex flex-wrap gap-1">
                      {provider.limitations.map((limitation, index) => (
                        <Badge key={index} variant="outline" className="text-xs text-red-700 bg-red-50">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          {limitation}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Overall Recommendations */}
      {compatibility.recommendations.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <h6 className="text-sm font-medium text-blue-900 flex items-center gap-2 mb-2">
            <Info className="w-4 h-4" />
            Recommendations
          </h6>
          <ul className="text-xs text-blue-800 space-y-1">
            {compatibility.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
};
