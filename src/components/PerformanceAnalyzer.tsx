import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  BarChart3, 
  CheckCircle, 
  AlertTriangle, 
  Zap, 
  Eye,
  Clock,
  Smartphone,
  Monitor,
  Target,
  TrendingUp
} from 'lucide-react';
import { Editor } from '@tiptap/react';
import { EmailBlockCanvasRef } from './EmailBlockCanvas';

interface PerformanceAnalyzerProps {
  editor: Editor | null;
  emailHTML: string;
  canvasRef?: React.MutableRefObject<EmailBlockCanvasRef | null>;
  subjectLine?: string;
}

export const PerformanceAnalyzer: React.FC<PerformanceAnalyzerProps> = ({
  editor,
  emailHTML,
  canvasRef,
  subjectLine: subjectLineProp = ''
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    overallScore: 85,
    loadTime: 1.2,
    mobileOptimization: 92,
    accessibility: 78,
    spamScore: 15,
    imageOptimization: 88
  });

  const [emailMetrics, setEmailMetrics] = useState({
    characterCount: 0,
    wordCount: 0,
    linkCount: 0,
    imageCount: 0,
    estimatedReadTime: '30 seconds'
  });

  useEffect(() => {
    analyzeContent();
  }, [emailHTML, subjectLineProp]);

  const analyzeContent = () => {
    const textContent = emailHTML.replace(/<[^>]*>/g, '');
    const words = textContent.split(/\s+/).filter(word => word.length > 0);
    const links = (emailHTML.match(/<a\s+[^>]*href/gi) || []).length;
    const images = (emailHTML.match(/<img\s+[^>]*src/gi) || []).length;
    
    setEmailMetrics({
      characterCount: textContent.length,
      wordCount: words.length,
      linkCount: links,
      imageCount: images,
      estimatedReadTime: `${Math.ceil(words.length / 200)} min`
    });
  };

  const runFullAnalysis = async () => {
    setIsAnalyzing(true);
    
    // Simulate analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setPerformanceMetrics(prev => ({
      ...prev,
      overallScore: Math.floor(Math.random() * 20) + 80,
      loadTime: Math.random() * 2 + 0.5,
      mobileOptimization: Math.floor(Math.random() * 20) + 80,
      accessibility: Math.floor(Math.random() * 30) + 70,
      spamScore: Math.floor(Math.random() * 25) + 5,
      imageOptimization: Math.floor(Math.random() * 20) + 75
    }));
    
    setIsAnalyzing(false);
  };

  const optimizeImages = () => {
    if (canvasRef?.current) {
      canvasRef.current.optimizeImages();
    }
  };

  const minifyHTML = () => {
    if (canvasRef?.current) {
      canvasRef.current.minifyHTML();
    }
  };

  const checkLinks = () => {
    if (canvasRef?.current) {
      const result = canvasRef.current.checkLinks();
      console.log('Link check result:', result);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">Performance Analytics</h3>
          <Button
            size="sm"
            onClick={runFullAnalysis}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <Clock className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <BarChart3 className="w-4 h-4 mr-2" />
            )}
            {isAnalyzing ? 'Analyzing...' : 'Analyze'}
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <Card className="p-3">
            <div className="text-center">
              <div className={`text-2xl font-bold ${getScoreColor(performanceMetrics.overallScore)}`}>
                {performanceMetrics.overallScore}
              </div>
              <div className="text-xs text-gray-600">Overall Score</div>
            </div>
          </Card>
          
          <Card className="p-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {performanceMetrics.loadTime.toFixed(1)}s
              </div>
              <div className="text-xs text-gray-600">Load Time</div>
            </div>
          </Card>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Performance Metrics */}
          <Card className="p-4">
            <h4 className="font-medium text-gray-900 mb-3">Performance Metrics</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Mobile Optimization</span>
                <Badge variant={getScoreBadgeVariant(performanceMetrics.mobileOptimization)}>
                  {performanceMetrics.mobileOptimization}%
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Accessibility</span>
                <Badge variant={getScoreBadgeVariant(performanceMetrics.accessibility)}>
                  {performanceMetrics.accessibility}%
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Spam Score</span>
                <Badge variant={performanceMetrics.spamScore > 20 ? 'destructive' : 'default'}>
                  {performanceMetrics.spamScore}%
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Image Optimization</span>
                <Badge variant={getScoreBadgeVariant(performanceMetrics.imageOptimization)}>
                  {performanceMetrics.imageOptimization}%
                </Badge>
              </div>
            </div>
          </Card>

          {/* Email Content Stats */}
          <Card className="p-4">
            <h4 className="font-medium text-gray-900 mb-3">Content Analysis</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-gray-600">Characters</div>
                <div className="font-medium">{emailMetrics.characterCount.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-gray-600">Words</div>
                <div className="font-medium">{emailMetrics.wordCount}</div>
              </div>
              <div>
                <div className="text-gray-600">Links</div>
                <div className="font-medium">{emailMetrics.linkCount}</div>
              </div>
              <div>
                <div className="text-gray-600">Images</div>
                <div className="font-medium">{emailMetrics.imageCount}</div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="text-sm text-gray-600">Estimated read time</div>
              <div className="font-medium">{emailMetrics.estimatedReadTime}</div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-4">
            <h4 className="font-medium text-gray-900 mb-3">Quick Optimizations</h4>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={optimizeImages}
                className="w-full justify-start"
              >
                <Zap className="w-4 h-4 mr-2" />
                Optimize Images
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={minifyHTML}
                className="w-full justify-start"
              >
                <Target className="w-4 h-4 mr-2" />
                Minify HTML
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={checkLinks}
                className="w-full justify-start"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Check Links
              </Button>
            </div>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};
