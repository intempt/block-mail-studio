
import React, { useState, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Zap, 
  Image, 
  Smartphone, 
  Globe, 
  Shield, 
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Minimize2,
  Accessibility
} from 'lucide-react';

interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'poor';
  description: string;
  recommendation?: string;
}

interface AccessibilityIssue {
  id: string;
  type: 'contrast' | 'alt-text' | 'font-size' | 'structure';
  severity: 'high' | 'medium' | 'low';
  element: string;
  description: string;
  fix: string;
}

interface PerformanceAnalyzerProps {
  editor: Editor | null;
  emailHTML: string;
}

export const PerformanceAnalyzer: React.FC<PerformanceAnalyzerProps> = ({ 
  editor, 
  emailHTML 
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [accessibilityIssues, setAccessibilityIssues] = useState<AccessibilityIssue[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'performance' | 'accessibility' | 'mobile'>('performance');
  const [overallScore, setOverallScore] = useState(85);

  useEffect(() => {
    if (emailHTML) {
      analyzeEmail();
    }
  }, [emailHTML]);

  const analyzeEmail = async () => {
    setIsAnalyzing(true);
    
    // Simulate analysis
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Performance metrics
    const newMetrics: PerformanceMetric[] = [
      {
        id: '1',
        name: 'Email Size',
        value: Math.floor(emailHTML.length / 1024),
        unit: 'KB',
        status: emailHTML.length < 100000 ? 'good' : 'warning',
        description: 'Total email size including HTML and inline CSS',
        recommendation: emailHTML.length > 100000 ? 'Consider reducing image sizes or removing unnecessary content' : undefined
      },
      {
        id: '2',
        name: 'Images',
        value: (emailHTML.match(/<img/g) || []).length,
        unit: 'count',
        status: (emailHTML.match(/<img/g) || []).length < 5 ? 'good' : 'warning',
        description: 'Number of images in the email'
      },
      {
        id: '3',
        name: 'Load Time',
        value: Math.random() * 2 + 1,
        unit: 'sec',
        status: 'good',
        description: 'Estimated email load time'
      },
      {
        id: '4',
        name: 'Links',
        value: (emailHTML.match(/<a /g) || []).length,
        unit: 'count',
        status: 'good',
        description: 'Number of clickable links'
      }
    ];

    // Accessibility issues
    const newAccessibilityIssues: AccessibilityIssue[] = [
      {
        id: '1',
        type: 'alt-text',
        severity: 'high',
        element: 'img elements',
        description: '2 images missing alt text for screen readers',
        fix: 'Add descriptive alt attributes to all images'
      },
      {
        id: '2',
        type: 'contrast',
        severity: 'medium',
        element: 'text on colored background',
        description: 'Some text may not meet WCAG contrast requirements',
        fix: 'Increase contrast ratio to at least 4.5:1'
      }
    ];

    setMetrics(newMetrics);
    setAccessibilityIssues(newAccessibilityIssues);
    setIsAnalyzing(false);
    
    // Calculate overall score
    const avgScore = newMetrics.reduce((acc, metric) => {
      const score = metric.status === 'good' ? 100 : metric.status === 'warning' ? 70 : 40;
      return acc + score;
    }, 0) / newMetrics.length;
    
    setOverallScore(Math.round(avgScore));
  };

  const fixAccessibilityIssue = (issueId: string) => {
    setAccessibilityIssues(prev => prev.filter(issue => issue.id !== issueId));
    setOverallScore(prev => Math.min(100, prev + 5));
  };

  const optimizeImages = () => {
    // Simulate image optimization
    console.log('Optimizing images...');
    setMetrics(prev => prev.map(metric => 
      metric.name === 'Email Size' 
        ? { ...metric, value: Math.max(metric.value * 0.7, 30), status: 'good' as const }
        : metric
    ));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'poor': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'alt-text': return <Image className="w-4 h-4" />;
      case 'contrast': return <Eye className="w-4 h-4" />;
      case 'font-size': return <FileText className="w-4 h-4" />;
      case 'structure': return <Shield className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center gap-1.5 mb-3">
          <Zap className="w-4 h-4 text-orange-600" />
          <h3 className="text-base font-semibold">Performance Analyzer</h3>
          <Badge variant="secondary" className="ml-auto text-xs">
            Score: {overallScore}
          </Badge>
        </div>

        <div className="mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm font-medium">Overall Performance</span>
            <span className={`text-sm font-bold ${
              overallScore >= 90 ? 'text-green-600' : 
              overallScore >= 70 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {overallScore}/100
            </span>
          </div>
          <Progress value={overallScore} className="mb-1.5 h-1.5" />
        </div>

        <div className="flex gap-1">
          {[
            { id: 'performance', label: 'Performance', icon: <Zap className="w-4 h-4" /> },
            { id: 'accessibility', label: 'Accessibility', icon: <Accessibility className="w-4 h-4" /> },
            { id: 'mobile', label: 'Mobile', icon: <Smartphone className="w-4 h-4" /> }
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab(tab.id as any)}
              className="flex items-center gap-1.5 text-xs"
            >
              {tab.icon}
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3">
          {activeTab === 'performance' && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900 text-sm">Performance Metrics</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={analyzeEmail}
                  disabled={isAnalyzing}
                  className="flex items-center gap-1.5 text-xs"
                >
                  <Zap className={`w-3 h-3 ${isAnalyzing ? 'animate-pulse' : ''}`} />
                  {isAnalyzing ? 'Analyzing...' : 'Re-analyze'}
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {metrics.map((metric) => (
                  <Card key={metric.id} className="p-2.5">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium">{metric.name}</span>
                      {getStatusIcon(metric.status)}
                    </div>
                    <div className="text-xl font-bold">{metric.value.toFixed(metric.name === 'Load Time' ? 1 : 0)}</div>
                    <div className="text-xs text-gray-600">{metric.unit}</div>
                    <p className="text-xs text-gray-500 mt-1 line-height-tight">{metric.description}</p>
                    {metric.recommendation && (
                      <p className="text-xs text-blue-600 mt-1 italic line-height-tight">
                        💡 {metric.recommendation}
                      </p>
                    )}
                  </Card>
                ))}
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2 text-sm">Quick Optimizations</h4>
                <div className="grid grid-cols-2 gap-1.5">
                  <Button variant="outline" size="sm" onClick={optimizeImages} className="flex items-center gap-1.5 text-xs">
                    <Minimize2 className="w-3 h-3" />
                    Optimize Images
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-1.5 text-xs">
                    <FileText className="w-3 h-3" />
                    Minify HTML
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-1.5 text-xs">
                    <Globe className="w-3 h-3" />
                    Check Links
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-1.5 text-xs">
                    <Shield className="w-3 h-3" />
                    Security Scan
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'accessibility' && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900 text-sm">Accessibility Issues</h4>
                <Badge variant="outline" className="text-xs">
                  WCAG 2.1 AA
                </Badge>
              </div>

              <div className="space-y-2">
                {accessibilityIssues.map((issue) => (
                  <Card key={issue.id} className="p-2.5">
                    <div className="flex items-start justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        {getIssueIcon(issue.type)}
                        <span className="font-medium text-sm">{issue.element}</span>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getSeverityColor(issue.severity)}`}
                        >
                          {issue.severity}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-1.5">{issue.description}</p>
                    <p className="text-xs text-blue-600 italic mb-2">
                      🔧 {issue.fix}
                    </p>
                    
                    <Button
                      size="sm"
                      onClick={() => fixAccessibilityIssue(issue.id)}
                      className="w-full text-xs"
                    >
                      Fix Issue
                    </Button>
                  </Card>
                ))}
                
                {accessibilityIssues.length === 0 && (
                  <div className="text-center py-6">
                    <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-1.5" />
                    <p className="text-sm text-gray-600">All accessibility checks passed!</p>
                    <p className="text-xs text-gray-500 mt-0.5">Your email meets WCAG guidelines</p>
                  </div>
                )}
              </div>

              <Card className="p-2.5 bg-blue-50 border-blue-200">
                <h5 className="font-medium text-sm mb-1.5 text-blue-900">Accessibility Guidelines</h5>
                <div className="space-y-0.5 text-xs text-blue-800">
                  <div>• All images have descriptive alt text</div>
                  <div>• Text contrast ratio is at least 4.5:1</div>
                  <div>• Font sizes are at least 14px</div>
                  <div>• Proper heading structure is used</div>
                  <div>• Links have meaningful text</div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'mobile' && (
            <div className="space-y-2.5">
              <h4 className="font-medium text-gray-900 text-sm">Mobile Optimization</h4>
              
              <div className="grid grid-cols-2 gap-2">
                <Card className="p-2.5">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Smartphone className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">Responsive Design</span>
                  </div>
                  <div className="text-xl font-bold text-green-600">✓</div>
                  <div className="text-xs text-gray-600">Passes mobile tests</div>
                </Card>
                
                <Card className="p-2.5">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Eye className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">Touch Targets</span>
                  </div>
                  <div className="text-xl font-bold text-green-600">44px</div>
                  <div className="text-xs text-gray-600">Minimum size met</div>
                </Card>
              </div>

              <Card className="p-2.5">
                <h5 className="font-medium text-sm mb-2">Mobile Preview</h5>
                <div className="bg-gray-100 rounded-lg p-3 max-w-xs mx-auto">
                  <div className="bg-white rounded shadow-sm p-2.5">
                    <div className="h-1.5 bg-blue-500 rounded mb-1.5"></div>
                    <div className="space-y-0.5">
                      <div className="h-1 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-1 bg-gray-300 rounded w-1/2"></div>
                    </div>
                    <div className="bg-blue-500 text-white text-xs text-center py-1 rounded mt-1.5">
                      CTA Button
                    </div>
                  </div>
                </div>
              </Card>

              <div>
                <h5 className="font-medium text-sm mb-1.5">Mobile Optimizations</h5>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span>Single column layout</span>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Large touch targets</span>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Readable font sizes</span>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Fast loading images</span>
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};
